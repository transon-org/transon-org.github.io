// Import `.md` files as raw strings via webpack 5's `asset/source`.
// The rule is unshifted into CRA's `oneOf` list so it wins over the
// catch-all `asset/resource` fallback (which would otherwise emit a URL).
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOf = webpackConfig.module.rules.find((rule) =>
        Array.isArray(rule.oneOf)
      ).oneOf;
      oneOf.unshift({
        test: /\.md$/,
        type: "asset/source",
      });
      return webpackConfig;
    },
  },
};
