"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultPreset;

var _postcssDiscardComments = _interopRequireDefault(require("postcss-discard-comments"));

var _postcssNormalizeWhitespace = _interopRequireDefault(require("postcss-normalize-whitespace"));

var _postcssDiscardEmpty = _interopRequireDefault(require("postcss-discard-empty"));

var _cssnanoUtils = require("cssnano-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultOpts = {};

function defaultPreset(opts = {}) {
  const options = Object.assign({}, defaultOpts, opts);
  const plugins = [[_postcssDiscardComments.default, options.discardComments], [_postcssNormalizeWhitespace.default, options.normalizeWhitespace], [_postcssDiscardEmpty.default, options.discardEmpty], [_cssnanoUtils.rawCache, options.rawCache]];
  return {
    plugins
  };
}

module.exports = exports.default;