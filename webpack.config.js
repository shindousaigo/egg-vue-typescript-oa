const path = require('path')
module.exports = {
  entry: {
    'admin/home': 'app/web/page/admin/home/index.ts',
    'oa/index': 'app/web/page/oa/index.ts',
  },
  resolve: {
    alias: {
      "web": path.resolve(__dirname, 'app', 'web'),
    }
  },
  lib: ['vue', 'vuex', 'vue-router', 'vuex-router-sync', 'axios'],
  loaders: {
    babel: false,
    ts: true,
    scss: true,
  },
  plugins: {
    copy: [{
      from: 'app/web/asset',
      to: 'asset'
    }],
  },
  customize(webpackConfig) {
    webpackConfig.module.rules.find(rule => rule.test.test("*.scss")).use.push(
      {
        loader: "sass-resources-loader",
        options: {
          resources: [
            path.resolve(__dirname, "app/web/asset/css/common.scss")
          ]
        }
      }
    )
    return webpackConfig;
  }
};