const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          net: false,
          tls: false,
          dns: false,
        },
      },
    },
    plugins: {
      add: [new NodePolyfillPlugin()],
    },
  },
};
