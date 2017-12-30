var path = require('path'), webpack = require('webpack')

var jsLoader = {
    test: /\.js$/, // 你也可以用.es6做文件扩展名, 然后在这里定义相应的pattern
    loader: 'babel-loader',
    query: {
        // 代码转译预设, 并不包含ES新特性的polyfill, polyfill需要在具体代码中显示require
        presets: ["es2015", "stage-0"]
    },
    // 指定转译es6目录下的代码
    include: path.join(__dirname, 'es6'),
    // 指定不转译node_modules下的代码
    exclude: path.join(__dirname, 'node_modules')
}

module.exports = {
    // sourcemap 选项, 建议开发时包含sourcemap, production版本时去掉(节能减排)
    devtool: false,

    // 指定es6目录为context目录, 这样在下面的entry, output部分就可以少些几个`../`了
    context: path.join(__dirname, 'es6'),

    // 定义要打包的文件
    // 比如: `{entry: {out: ['./x', './y','./z']}}` 的意思是: 将x,y,z等这些文件打包成一个文件,取名为: out
    // 具体请参看webpack文档
    entry: {
        index: './index'
    },

    output: {
        // 将打包后的文件输出到lib目录
        path: path.join(__dirname, 'src/lib'),

        // 将打包后的文件命名为 myapp, `[name]`可以理解为模板变量
        filename: '[name].js',

        // module规范为 `umd`, 兼容commonjs和amd, 具体请参看webpack文档
        libraryTarget: 'umd'
    },

    module: {
        loaders: [jsLoader]
    },

    resolve: {
        extensions: ['.js'],
        // 将es6目录指定为加载目录, 这样在require/import时就会自动在这个目录下resolve文件(可以省去不少../)
        modules: ['es6', 'node_modules']
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        // 通常会需要区分dev和production, 建议定义这个变量
        // 编译后会在global中定义`process.env`这个Object
        new webpack.DefinePlugin({
            "process.env": { 
               NODE_ENV: JSON.stringify("production") 
             }
        }),

        new webpack.optimize.UglifyJsPlugin({
            output: {
              comments: false,  // remove all comments
            },
            compress: {
              warnings: false
            }
        }),

    ]
}