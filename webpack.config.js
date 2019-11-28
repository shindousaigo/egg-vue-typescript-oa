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
    typescript: true,
    scss: true,
  },
  plugins: {
    copy: [{
      from: 'app/web/asset',
      to: 'asset'
    }]
  }
};