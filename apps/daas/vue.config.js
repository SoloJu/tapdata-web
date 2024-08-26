const { resolve } = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')

const serveUrlMap = {
  mock: 'http://localhost:30300',
  dev: 'http://localhost:3000', // TM端本地默认地址
  taptest: 'http://localhost:13030', // 自动化测试
  jet: 'http://jet.devops.tapdata.net:31613',
  test: 'http://58.251.34.123:3030' // v3.1
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
  changeOrigin: true
}

module.exports = {
  assetsDir: 'static',
  lintOnSave: SERVE_ENV !== 'dev' && process.env.NODE_ENV !== 'production', // 打包时关闭lint输出
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    proxy: {
      '/api/': proxy,
      '/oauth/': proxy,
      '/old/': { target: 'http://localhost:8081' },
      '/docs/': proxy,
      '/ws/': {
        ws: true,
        secure: false,
        logLevel: 'debug',
        target: proxy.target.replace(/^https?/, 'ws')
      }
    }
  },
  transpileDependencies: [
    // 按需添加需要babel处理的模块
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]packages[/\\]table[/\\]src/,
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]packages[/\\]tooltip[/\\]src/,
    /[/\\]node_modules[/\\](.+?)?@figmania[/\\]webcomponent(.*)[/\\]/
  ],
  chainWebpack(config) {
    //  ============ 配置别名 ============
    config.resolve.alias.set('@', resolve('src'))

    // ============ svg处理 ============
    const iconDir = resolve('src/assets/icons/svg')
    const colorIconDir = resolve('src/assets/icons/colorSvg')
    const assetsIconDir = resolve('../../packages/assets/icons/svg')
    const assetsColorIconDir = resolve('../../packages/assets/icons/colorSvg')

    // svg loader排除 icon 目录
    config.module
      .rule('svg')
      .exclude.add(iconDir)
      .add(colorIconDir)
      .add(assetsIconDir)
      .add(assetsColorIconDir)
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .end()

    // svg-sprite-loader打包svg
    config.module
      .rule('svg-sprite')
      .test(/\.svg$/)
      .include.add(iconDir)
      .add(assetsIconDir)
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
              attrs: ['class', 'p-id' /*, 'fill'*/]
            }
          }
        ]
      })
      .end()

    config.module
      .rule('color-svg-sprite')
      .test(/\.svg$/)
      .include.add(colorIconDir)
      .add(assetsColorIconDir)
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

    // ============ ts处理 ============
    config.module
      .rule('compile')
      .test(/\.(jsx|tsx|ts)$/)
      .use('babel')
      .loader('babel-loader')
      .end()

    /*console.log('js config :>> ', config.module.rule('js').toConfig())
    // element-ui 特殊处理
    config.module.rule('js').merge({
      include: [resolve('node_modules/element-ui/packages/table/src/table-body.js')]
    })*/
  },
  configureWebpack: config => {
    // 尽量保证项目中文件后缀的精确
    config.resolve.extensions = ['.js', 'jsx', '.vue', '.json', '.ts', '.tsx']

    if (process.env.NODE_ENV === 'production') {
      // gzip
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.(js|css|svg|woff|ttf|json|html|otf)$/, // 正在匹配需要压缩的文件后缀
          threshold: 10240 // 大于10kb的会压缩
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
  css: {
    extract: {
      // 一个官方维护人员的回复如下，简单的说，就是在js里css的引入顺序导致的问题，多个css的在js里的引入顺序不同，就会提示这个警告。例如，在1.js 里，引入的顺序是a.css, b.css; 在2.js里，引入顺序是b.css,a.css, 出现了这种引入顺序不同，就导致了警告。在两个js里把引入顺序调成一致，就没问题了。在1.js和2.js里的引入顺序都调整成a.css, b.css 就没有那个警告了。
      ignoreOrder: true // 对于通过使用 scoping 或命名约定来解决 css order 的项目，可以通过将插件的 ignoreOrder 选项设置为 true 来禁用 css order 警告。
    },
    loaderOptions: {
      scss: {
        additionalData: `@use "${process.env.VUE_APP_THEME_VAR || '~@tap/assets/styles/var.scss'}" as *;`
      }
    }
  }
}
