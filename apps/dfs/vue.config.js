const { resolve } = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')
const crypto = require('crypto')

const serveUrlMap = {
  mock: 'http://localhost:3000',
  dev: 'http://backend:3030',
  test: 'https://dev.cloud.tapdata.net:8443',
  local: 'https://v3.test.cloud.tapdata.net',
  localTm: 'http://127.0.0.1:3030'
}
// const userId = '60b60af1147bce7705727188' // zed?
// const userId = '60b064e9a65d8e852c8523bc' // lemon
// const userId = '610a3d43d7f65cfcd80837b5' // auto
// const userId = '60cc0c304e190a579cbe306c' // jason
// const userId = '64ba40c389c61b08683c71b0' // xf
const userId = '64be2c812c268c9dd5afaf25' // devin
let origin
let ENV // 区分打包生产环境和开发测试环境，默认是生产
const { argv } = process
const { SERVE_ENV = 'mock' } = process.env

// 通过origin参数注入服务代理，优先级最高
if (~argv.indexOf('--origin')) {
  origin = argv[argv.indexOf('--origin') + 1]
  origin && (origin = origin.replace(/^(?!http)/, 'http://'))
}

if (~argv.indexOf('--env')) {
  ENV = argv[argv.indexOf('--env') + 1]
}

const proxy = {
  target: process.env.SERVER_URI || origin || serveUrlMap[SERVE_ENV],
  changeOrigin: true
}

//sass变量
let varUrl = '~@tap/assets/styles/var.scss'
let pages = {
  index: {
    entry: 'src/pages/main.js',
    title: 'Tapdata Cloud'
  },
  license_code_activation: {
    entry: 'src/pages/licenseCodeActivation.js',
    title: 'Tapdata Cloud'
  },
  requestConnector: {
    entry: 'src/pages/requestConnector.js',
    title: 'Tapdata Cloud'
  }
}

let prodProxyConfig = {
  '/api/tcm/': Object.assign(
    {
      pathRewrite: {
        '^/': '/console/v3/'
      }
    },
    proxy
  ),
  '/tm/': {
    ws: true,
    target: proxy.target,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/console/v3/'
    }
  },
  '/api/gw/': Object.assign(
    {
      pathRewrite: {
        '^/': '/console/v3/'
      }
    },
    proxy
  )
}
let localTmProxy = {
  target: serveUrlMap.localTm,
  changeOrigin: true,
  ws: true,
  secure: false,
  pathRewrite: {
    '^/tm/': '/'
  },
  onProxyReq: function (proxyReq, req, res, opts) {
    proxyReq.setHeader('user_id', userId)
  },
  onProxyReqWs: function (proxyReq, req, socket, options, head) {
    proxyReq.setHeader('user_id', userId)
    console.log(req.url)
  }
}

module.exports = {
  pages,
  lintOnSave: SERVE_ENV !== 'dev' && process.env.NODE_ENV !== 'production', // 打包时关闭lint输出
  publicPath:
    process.env.NODE_ENV === 'production'
      ? !ENV || ENV === 'prod'
        ? 'https://static.cloud.tapdata.net/'
        : './' // 替换为你的CDN URL
      : './',
  productionSourceMap: false,

  devServer: {
    proxy:
      SERVE_ENV === 'PROD'
        ? prodProxyConfig
        : {
            '/config/': proxy,
            '/private_ask/': proxy,
            '/api/tcm/': proxy,
            '/api/gw/': proxy,
            '/tm/':
              SERVE_ENV === 'local'
                ? localTmProxy
                : Object.assign(
                    {
                      ws: true,
                      secure: false
                    },
                    proxy
                  )
          }
  },
  transpileDependencies: [
    // 按需添加需要babel处理的模块
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]packages[/\\]table[/\\]src/,
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]packages[/\\]tooltip[/\\]src/,
    /[/\\]node_modules[/\\](.+?)?@figmania[/\\]webcomponent(.*)[/\\]/,
    /[/\\]node_modules[/\\](.+?)?driver\.js(.*)[/\\]/
  ],
  configureWebpack: config => {
    config.resolve.extensions = ['.js', 'jsx', '.vue', '.json', '.ts', '.tsx']

    if (process.env.NODE_ENV === 'production') {
      // gzip
      config.plugins.push(
        new CompressionWebpackPlugin({
          // 正在匹配需要压缩的文件后缀
          test: /\.(js|css|svg|woff|ttf|json|html)$/,
          // 大于10kb的会压缩
          threshold: 10240
          // 其余配置查看compression-webpack-plugin
        }),
        // ace editor js 输出到 js/ace 目录
        new webpack.NormalModuleReplacementPlugin(/^file-loader\?esModule=false!\.\/src-noconflict(.*)/, res => {
          res.request = res.request.replace(
            /^file-loader\?esModule=false!/,
            'file-loader?esModule=false&outputPath=js/ace!'
          )
        })
      )

      config['performance'] = {
        //打包文件大小配置
        maxEntrypointSize: 10000000,
        maxAssetSize: 30000000
      }

      const sassLoader = require.resolve('sass-loader')
      config.module.rules
        .filter(rule => {
          return rule.test.toString().indexOf('scss') !== -1
        })
        .forEach(rule => {
          rule.oneOf.forEach(oneOfRule => {
            const sassLoaderIndex = oneOfRule.use.findIndex(item => item.loader === sassLoader)
            oneOfRule.use.splice(sassLoaderIndex, 0, { loader: require.resolve('css-unicode-loader') })
          })
        })
    }
  },
  chainWebpack(config) {
    config.resolve.alias.set('@', resolve('src'))

    const iconDir = resolve('src/assets/icons/svg')
    const colorIconDir = resolve('src/assets/icons/colorSvg')
    const assetsIconDir = resolve('../../packages/assets/icons/svg')
    const assetsColorIconDir = resolve('../../packages/assets/icons/colorSvg')
    // svg loader排除 icon 目录
    config.module
      .rule('svg')
      .exclude.add(assetsIconDir)
      .add(assetsColorIconDir)
      .add(iconDir)
      .add(colorIconDir)
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .end()

    // svg-sprite-loader打包svg
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(assetsIconDir)
      .add(iconDir)
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
          { name: 'removeTitle', active: true },
          { name: 'removeStyleElement', active: true },
          {
            name: 'removeAttributesBySelector',
            params: {
              selector: ":not(path[fill='none'])",
              attributes: ['fill']
            }
          },
          {
            name: 'removeAttrs',
            active: true,
            params: {
              attrs: ['class', 'p-id']
            }
          }
        ]
      })
      .end()

    config.module
      .rule('color-svg-sprite')
      .test(/\.svg$/)
      .include.add(assetsColorIconDir)
      .add(colorIconDir)
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
          { name: 'removeTitle', active: true },
          { name: 'removeStyleElement', active: true },
          {
            name: 'removeAttrs',
            active: true,
            params: {
              attrs: ['class', 'p-id']
            }
          }
        ]
      })
      .end()

    // markdown loader
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('html')
      .loader('html-loader')
      .end()
      .use('markdown')
      .loader('markdown-loader')
      .end()

    config.resolve.alias.set('@', resolve('src'))
    config.plugins.delete('prefetch-index')

    // ============ ts处理 ============
    config.module
      .rule('compile')
      .test(/\.(jsx|tsx|ts)$/)
      .use('babel')
      .loader('babel-loader')
      .end()
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@use "${varUrl}" as *;`
      }
    }
  }
}
// 设置本地环境的token
const getToken = userId => {
  const secret = 'Q3HraAbDkmKoPzaBEYzPXB1zJXmWlQ169'
  function __encrypt(string) {
    return crypto
      .createHmac('sha256', secret)
      .update(string + secret)
      .digest('hex')
  }
  function encodeBase64(string) {
    if (typeof string !== 'string') return null
    return Buffer.from(string || '').toString('base64')
  }
  function encodeStaticTokenByUserId(userId) {
    let token = __encrypt(userId)
    return encodeBase64(userId) + '.' + encodeBase64(token)
  }
  const token = encodeStaticTokenByUserId(userId)
  return token
}
if (process.env.NODE_ENV === 'development') {
  let _userId = process.env.USER_ID || userId
  process.env.VUE_APP_ACCESS_TOKEN = getToken(_userId)

  console.log('本地用户调试ID: ' + _userId)
  console.log('本地用户调试Token: ' + process.env.VUE_APP_ACCESS_TOKEN)
  console.log('Proxy server: ' + proxy.target)
}
