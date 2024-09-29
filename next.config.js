module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /typeorm/,
      loader: "ignore-loader",
    });
    return config;
  },
};
