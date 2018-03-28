/* eslint-env jasmine */
const fs = require('fs');
const path = require('path');
const MemoryFileSystem = require('memory-fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlResourceHintPlugin = require('../');

const OUTPUT_DIR = path.join(__dirname, '../dist');

describe('HtmlResourceHintPlugin', () => {
  it('adds prefetch tags by default', (done) => {
    const expected = fs.readFileSync(path.resolve(__dirname, 'fixtures/expected.html')).toString();
    const compiler = webpack({
      entry: {
        main: path.join(__dirname, 'fixtures', 'entry.js')
      },
      output: {
        path: OUTPUT_DIR,
        filename: '[name].js'
      },
      plugins: [
        new HtmlWebpackPlugin(),
        new HtmlResourceHintPlugin()
      ]
    }, (err, result) => {
      expect(err).toBeFalsy();
      expect(JSON.stringify(result.compilation.errors)).toBe('[]');
      const html = result.compilation.assets['index.html'].source();
      expect(html).toBe(expected);
      done();
    });
    compiler.outputFileSystem = new MemoryFileSystem();
  });
});

describe('HtmlResourceHintPlugin', () => {
  it('adds prefetch tags', (done) => {
    const expected = fs.readFileSync(path.resolve(__dirname, 'fixtures/expected.html')).toString();
    const compiler = webpack({
      entry: {
        main: path.join(__dirname, 'fixtures', 'entry.js')
      },
      output: {
        path: OUTPUT_DIR,
        filename: '[name].js'
      },
      plugins: [
        new HtmlWebpackPlugin({
          prefetch: '*.js',
          preload: '*.js'
        }),
        new HtmlResourceHintPlugin()
      ]
    }, (err, result) => {
      expect(err).toBeFalsy();
      expect(JSON.stringify(result.compilation.errors)).toBe('[]');
      const html = result.compilation.assets['index.html'].source();
      expect(html).toBe(expected);
      done();
    });
    compiler.outputFileSystem = new MemoryFileSystem();
  });
});

describe('HtmlResourceHintPlugin', () => {
  it('adds no file which do not match the filter', (done) => {
    const compiler = webpack({
      entry: {
        main: path.join(__dirname, 'fixtures', 'entry.js')
      },
      output: {
        path: OUTPUT_DIR,
        filename: '[name].js'
      },
      plugins: [
        new HtmlWebpackPlugin({
          prefetch: '*.json',
          preload: false
        }),
        new HtmlResourceHintPlugin()
      ]
    }, (err, result) => {
      expect(err).toBeFalsy();
      expect(JSON.stringify(result.compilation.errors)).toBe('[]');
      const html = result.compilation.assets['index.html'].source();
      expect(html.indexOf('rel="prefetch"') === -1).toBe(true);
      expect(html.indexOf('rel="preload"') === -1).toBe(true);
      done();
    });
    compiler.outputFileSystem = new MemoryFileSystem();
  });
});

describe('HtmlResourceHintPlugin', () => {
  it('allows to add fixed prefetch url', (done) => {
    const compiler = webpack({
      entry: {
        main: path.join(__dirname, 'fixtures', 'entry.js')
      },
      output: {
        path: OUTPUT_DIR,
        filename: '[name].js'
      },
      plugins: [
        new HtmlWebpackPlugin({
          prefetch: ['demo.json']
        }),
        new HtmlResourceHintPlugin()
      ]
    }, (err, result) => {
      expect(err).toBeFalsy();
      expect(JSON.stringify(result.compilation.errors)).toBe('[]');
      const html = result.compilation.assets['index.html'].source();
      expect(!!html.indexOf('<link rel="prefetch" href="demo.json">')).toBe(true);
      done();
    });
    compiler.outputFileSystem = new MemoryFileSystem();
  });
});

describe('HtmlResourceHintPlugin', () => {
  it('allows to add fixed preload url', (done) => {
    const compiler = webpack({
      entry: {
        main: path.join(__dirname, 'fixtures', 'entry.js')
      },
      output: {
        path: OUTPUT_DIR,
        filename: '[name].js'
      },
      plugins: [
        new HtmlWebpackPlugin({
          preload: ['*.js', 'demo.json']
        }),
        new HtmlResourceHintPlugin()
      ]
    }, (err, result) => {
      expect(err).toBeFalsy();
      expect(JSON.stringify(result.compilation.errors)).toBe('[]');
      const html = result.compilation.assets['index.html'].source();
      expect(!!html.indexOf('<link rel="preload" href="demo.json">')).toBe(true);
      done();
    });
    compiler.outputFileSystem = new MemoryFileSystem();
  });
});
