Resource Hints Webpack Plugin
========================================
[![npm version](https://badge.fury.io/js/resource-hints-webpack-plugin.svg)](http://badge.fury.io/js/resource-hints-webpack-plugin) [![Dependency Status](https://david-dm.org/jantimon/resource-hints-webpack-plugin.svg)](https://david-dm.org/jantimon/resource-hints-webpack-plugin) [![Build status](https://travis-ci.org/jantimon/resource-hints-webpack-plugin.svg)](https://travis-ci.org/jantimon/resource-hints-webpack-plugin) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

This is an extension plugin for the [webpack](http://webpack.github.io) plugin [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin).

It adds automatically [resource-hints](https://www.w3.org/TR/resource-hints/) to your html files to [improve your load time](https://hackernoon.com/10-things-i-learned-making-the-fastest-site-in-the-world-18a0e1cdf4a7#.ejrj8kvk9).

Installation
------------
You must be running webpack on node 0.12.x or higher

Install the plugin with npm:
```shell
$ npm install --save-dev resource-hints-webpack-plugin
```

Install the plugin with yarn:
```shell
$ yarn add --dev resource-hints-webpack-plugin
```

Basic Usage
-----------
Load the plugin

```javascript
  const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
```

and add it to your webpack config as follows:

```javascript
plugins: [
  new HtmlWebpackPlugin(),
  new ResourceHintWebpackPlugin()
]  
```
The above configuration will actually do the same as the following:

```javascript
plugins: [
  new HtmlWebpackPlugin({
    prefetch: ['**/*.*'],
    preload: ['**/*.*']
  }),
  new ResourceHintWebpackPlugin()
]  
```

Even if you generate multiple files make sure that you add the ResourceHintWebpackPlugin **only once**:

```javascript
plugins: [
  new HtmlWebpackPlugin({
    prefetch: ['*.js', 'data.json'],
    preload: '*.*'
  }),
  new HtmlWebpackPlugin({
    preload: ['*.json'],
    preload: false,
    filename: 'demo.html'
  }),
  new ResourceHintWebpackPlugin()
]  
```
