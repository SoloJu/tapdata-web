const { resolve } = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const serveUrlMap = {
  mock: 'http://localhost:3000',
  dev: 'http://backend:3030',
  test: 'http://test.cloud.tapdata.net'
}
let origin
const { argv } = process
const { SERVE_ENV = 'mock' } = process.env

// 通过origin参数注入服务代理，优先级最高
if (~argv.indexOf('--origin')) {
  origin = argv[argv.indexOf('--origin') + 1]
  origin && (origin = origin.replace(/^(?!http)/, 'http://'))
}
const proxy = {
  target: origin || serveUrlMap[SERVE_ENV],
  changeOrigin: false
}

//如果环境变量中主题参数存在，则嵌入主题中相关的标量
let varUrl = '~@/assets/theme/dfs/var.scss'
let pages = {
  index: {
    entry: 'src/pages/main.js',
    title: 'Tapdata Cloud'
  }
}
module.exports = {
  pages,
  lintOnSave: true,
  publicPath: '',
  productionSourceMap: false,

  devServer: {
    proxy: {
      '/api/tcm/': proxy,
      '/tm/api/': proxy,
      '/ws/': {
        ...proxy,
        ws: true,
        secure: false,
        logLevel: 'debug',
        target: proxy.target.replace(/^https?/, 'ws')
      },
      '/tm/#/': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/tm': '/'
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // gzip
      config.plugins.push(
        new CompressionWebpackPlugin({
          // 正在匹配需要压缩的文件后缀
          test: /\.(js|css|svg|woff|ttf|json|html)$/,
          // 大于10kb的会压缩
          threshold: 10240
          // 其余配置查看compression-webpack-plugin
        })
      )

      config['performance'] = {
        //打包文件大小配置
        maxEntrypointSize: 10000000,
        maxAssetSize: 30000000
      }
    }
  },
  chainWebpack(config) {
    const iconDir = resolve('src/assets/icons/svg')

    // svg loader排除 icon 目录
    config.module.rule('svg').exclude.add(resolve(iconDir)).end().use('svgo-loader').loader('svgo-loader').end()

    // svg-sprite-loader打包svg
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(resolve(iconDir))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .options({
        plugins: [
          { name: 'removeStyleElement', active: true },
          {
            name: 'removeAttrs',
            active: true,
            params: {
              attrs: ['class', 'p-id', 'fill']
            }
          }
        ]
      })
      .end()
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "${varUrl}";`
      }
    }
  }
}
