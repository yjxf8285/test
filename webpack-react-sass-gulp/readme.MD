项目使用方法：
    
    需要手动修改的2处地方：
        1.静态资源服务器地址 webpack.config.js下的publicPath为http://localhost:8080
        2.接口服务器地址 util.js 下的 API_PATH
    开发环境：
        1.启动webpackServer
        2.启动gulpStart 
    打包上线：
        1. 启动build，生成js文件
        2. 执行htmlmin 压缩代码
        
webpack 参数： 
   
    webpack 最基本的启动webpack命令
    webpack -w 提供watch方法，实时进行打包更新
    webpack -p 对打包后的文件进行压缩
    webpack -d 提供SourceMaps，方便调试
    webpack --colors 输出结果带彩色，比如：会用红色显示耗时较长的步骤
    webpack --profile 输出性能数据，可以看到每一步的耗时
    webpack --display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块

常用Plugins介绍

    代码热替换, HotModuleReplacementPlugin
    生成html文件，HtmlWebpackPlugin
    将css成生文件，而非内联，ExtractTextPlugin
    报错但不退出webpack进程，NoErrorsPlugin
    代码丑化，UglifyJsPlugin，开发过程中不建议打开
    多个 html共用一个js文件(chunk)，可用CommonsChunkPlugin
    清理文件夹，Clean
    调用模块的别名ProvidePlugin，例如想在js中用$，如果通过webpack加载，需要将$与jQuery对应起来

html-webpack-plugin 配置说明：

    title: 用来生成页面的 title 元素
    filename: 输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有子目录。
    template: 模板文件路径，支持加载器，比如 html!./index.html
    inject: true | 'head' | 'body' | false  ,注入所有的资源到特定的 template 或者 templateContent 中，如果设置为 true 或者 body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中。
    favicon: 添加特定的 favicon 路径到输出的 HTML 文件中。
    minify: {} | false , 传递 html-minifier 选项给 minify 输出
    hash: true | false, 如果为 true, 将添加一个唯一的 webpack 编译 hash 到所有包含的脚本和 CSS 文件，对于解除 cache 很有用。
    cache: true | false，如果为 true, 这是默认值，仅仅在文件修改之后才会发布文件。
    showErrors: true | false, 如果为 true, 这是默认值，错误信息会写入到 HTML 页面中
    chunks: 允许只添加某些块 (比如，仅仅 unit test 块)
    chunksSortMode: 允许控制块在添加到页面之前的排序方式，支持的值：'none' | 'default' | {function}-default:'auto'
    excludeChunks: 允许跳过某些块，(比如，跳过单元测试的块) 
    
    