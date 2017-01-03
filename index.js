'use strict';
var assert = require('assert');
var objectAssign = require('object-assign');
var minimatch = require('minimatch');

function HtmlResourceHintPlugin (options) {
  assert.equal(options, undefined, 'The HtmlResourceHintPlugin does not accept any options');
}

function createResourceHintTag (url, ResourceHintType, htmlWebpackPluginOptions) {
  return {
    tagName: 'link',
    selfClosingTag: !!htmlWebpackPluginOptions.xhtml,
    attributes: {
      rel: ResourceHintType,
      href: url
    }
  };
}

HtmlResourceHintPlugin.prototype.apply = function (compiler) {
  var self = this;
  // Hook into the html-webpack-plugin processing
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
      var htmlWebpackPluginOptions = htmlPluginData.plugin.options;
      var pluginData = objectAssign({}, htmlPluginData);
      var tags = {
        prefetch: [],
        preload: []
      };
      // Create Resource tags
      Object.keys(tags).forEach(function (ResourceHintType) {
        var filters;
        if (htmlWebpackPluginOptions[ResourceHintType] === false) {
          return;
        }
        // Add all files by default:
        if (htmlWebpackPluginOptions[ResourceHintType] === undefined) {
          filters = ['*.*'];
        } else {
          filters = [].concat(htmlWebpackPluginOptions[ResourceHintType]);
        }
        filters.forEach(function (filter) {
          if (filter.indexOf('*') !== -1) {
            Array.prototype.push.apply(tags[ResourceHintType], self.addResourceHintTags(
              ResourceHintType,
              filter,
              pluginData.body,
              htmlWebpackPluginOptions
            ));
          } else {
            tags[ResourceHintType].push(createResourceHintTag(filter, ResourceHintType, htmlWebpackPluginOptions));
          }
        });
      });
      // Add all Resource tags to the head
      Array.prototype.push.apply(pluginData.head, tags.preload);
      Array.prototype.push.apply(pluginData.head, tags.prefetch);
      callback(null, pluginData);
    });
  });
};

/**
 * Adds Resource hint tags
 */
HtmlResourceHintPlugin.prototype.addResourceHintTags = function (ResourceHintType, filter, assetTags, htmlWebpackPluginOptions) {
  var urls = assetTags
    .map(function (tag) {
      return tag.attributes.src || tag.attributes.href;
    })
    .filter(function (url) {
      return url;
    })
    .filter(minimatch.filter(filter));
  // Add a ResourceHint for every match
  return urls.map(function (url) {
    return createResourceHintTag(url, ResourceHintType, htmlWebpackPluginOptions);
  });
};

module.exports = HtmlResourceHintPlugin;
