# AMP4 - frontend vvvv
## 接口注意事项
    1.拓扑图接口返回的数据必须经过node层处理，不可以直接透传使用
## 依赖
    es6--
    sass
    element
    echarts
    ionicons
    lodash
    axios

## 使用说明

    # 安装依赖
    npm install

    # 运行本地开发环境 localhost:9999
    npm run dev-server

    # 运行本地生产环境 localhost:8000
    npm run prod-server

    # 打包命令（会在根目录生成dist文件夹）
    npm run build

    # 删除dist文件夹
    npm run clear-dist

## 服务器环境

    http://10.200.10.22:8888 ##测试环境压缩版 ， jenkins任务对应： apm-web-nginx
    http://10.200.10.22:9999 ##测试环境源码版 ， jenkins任务对应： apm-web-node

## 修改主题
    # 项目主题修改方式
    1.编辑项目主题文件 /src/assets/css/theme/v1/var.scss

    # UI库主题修过方式
    请修改 /src/assets/css/element-variables.scss
    变量名参考 theme-chalk/src/common/var.scss


## 字体图标列表地址
    http://ionicons.com/

## 路由配置
    1. 手动配置
    修改/router/router-config.js文件
    2. 自动配置
    /views目录下创建2级文件夹且保证里面有一个index.vue文件 然后重启服务

## 常见的环境报错信息
> 端口被占用时
```
events.js:160
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE :::8088
```


## 以下为Node加入后的调整：

本地前端开发环境的接口服务全部依赖于node服务层。

前端启动后的服务请求地址全部以`/api/`开头（自动拼接已经完成，无需关注）

开发环境`node服务`启动方式：`node index` 开发环境服务端口号为`9092`

开发环境`前端VUE`启动方式： `npm run dev-server`

jenkins构建地址：[https://jenkins.rcs.dataengine.com/jenkins/view/msa/job/apm-web-node/]()

关于特定服务返回数据的格式转换：

统一的service存放路径：`./backend/services/`
如果自己有特定服务的返回数据需要格式转换或处理，需要在此目录下新建文件（建议文件名字按照模块拆分）
具体范例情参看agent.js文件



## Node应用安装流程
APM前端构建是基于Node环境构建，其安装部署流程如下：

1. **安装NodeJS**

	NodeJS安装包，安装版本不低于6.10。安装包下载地址：[https://npm.taobao.org/mirrors/node/v6.11.0/node-v6.11.0-linux-x64.tar.xz]()

	或者去[https://npm.taobao.org/mirrors/node/v6.11.0/]()地址下边下载也可。

	安装包下载下来之后，解压后需要将Node的bin文件夹加入环境变量。

    完成后通过 `node -v` 进行验证

2. **将`Node`默认的`npm`命令更改为`cnpm`**
> 注：`-g`参数为全局安装的参数。
>
> `cnpm`为淘宝做的镜像服务器，在国内下载对应的`Node`依赖包速度有保证


执行命令：`npm install -g cnpm --registry=https://registry.npm.taobao.org`

验证命令：`cnpm -v`

3. **安装PM2插件，用来管理Node应用进程**

执行命令：`cnpm install pm2 -g`

验证命令：`pm2 -v`

4. **下载代码并安装依赖**

进入我们的Web应用根目录，安装应用运行的Node依赖包，假设我们的Web应用根目录为`/rc/local/app/apm-frontend`
> gitlab项目地址：
git@gitlab.dataengine.com:liuxiaofan/apm-frontend.git

执行命令：`cd /rc/local/app/apm-frontend && cnpm install`

5. `构建应用静态资源`

执行命令：`npm run build`

6. **修改指定的配置文件（需要修改两个文件）：**

    A.需要修改的配置文件：./app.config/app.config.production.json

         要调整的配置节：
             app/remoteHost: ”http://10.200.10.37:28080”       —此配置节需要配置为后端的Java服务应用地址

             runtime/listenPort: ”9092”. —此配置节为Node应用启动后的应用地址

      B.需要修改的配置文件：./app.config/app.config.json

         需要调整的配置节：

             runtime/redis/cluster:[]      —此配置节需要配置对应的redis集群

7. **在当前的应用根目录下启动应用，PM2启动后对应的APP名字为apm**

执行命令：`pm2 start pm2.json --env release`

     pm2 start pm2.json --env release    //根据pm2的配置文件 从对应的环境启动node进程 配置文件中的env_release 对应为 production 环境
     另，pm2的其他命令：
     pm2 restart apm    ——pm2重新启动

     pm2 delete apm     ——pm2删除APP命令，假如应用的配置文件更改了之后，我们不能直接使用pm2 restart apm命令进行启动，需要使用pm2 delete apm命令删除掉原来的应用，然后再使用pm2 start pm2.json —env release再启动应用

     pm2 monit apm      ——可以通过此命令查看Node各个节点的CPU、内存、日志的详细情况

    pm2 list            ——可以通过此命令获取当前PM2启动的所有Node进程

    pm2 logs            ——可以通过此命令查看应用日志

    pm2 stop all        ——停止所有服务


8. **客户端浏览页面，验证是否发布成功。**


CAAS环境相关用户：

当前CAAS统一使用的是10.200.10.47服务器上搭建的CAAS应用。

环境 | 管理员账号 | APP KEY | 测试用户
-----|-----|-----|-----
开发 | UserName:apm-dev-admin@rongcapital.cn Pwd:admin |  KEY:349381fd84d040f1baea0b0a4dbfd103 Secret:3a9cadcf4d7f44de9f9afb50780311b4 | UserName:apm-dev-test Pwd:admin
测试 | UserName:apm-admin@rongcapital.cn Pwd:admin | KEY:d4e17626fc0e4abb8c4195835b766e7c Secret:6f2be2a485604954b168484b55a3359b | UserName:apm-test Pwd:admin
UAT | UserName:apmuattest@rongcapital.cn Pwd:admin | KEY:bfcea9e9a3194901b2470d55011f0e20 Secret:1cfca970c5274dc28d7236baf615a684 | UserName:apm-uat-test Pwd:admin


