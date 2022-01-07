const { RouteMapDevPlugin } = require('../../build')

module.exports = {
  webpack(config) {
    config.plugins.push(new RouteMapDevPlugin({
      config: `${__dirname}/routes.config.js`,
    }))
    return config
  }
}
