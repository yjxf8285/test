# mi

> 基于 `Node Express` 与 `Vue` 实现的全端开发解决方案

## Build Setup

``` bash
# 安装依赖
npm install

# 开发环境调试，当前启动8090端口
npm run start

# 将Node服务与前端热重载分开调试，前端启动端口8090，Node服务启动9092端口
npm run devp

# 将Node服务与前端热重载合并，启动端口为8080
npm run dev

# 不同环境部署时的构建命令，自动生成部署包，你可以通过在build后添加环境的名称来生成不同环境的压缩包
npm run build [env]

```
> ### Jenkins构建流程思路：
> 1. _使用`npm run build [env]`来构建，其中默认的环境为`development`环境，根据不同环境的jenkins赋值不同。其中的环境变量可以自己灵活调整，规约是必须在admin/config文件夹下创建对应环境变量的配置文件，如：`npm run build sit` 对应的配置> 文件为`sit.js`_
> 2. _构建完成后，会在`./zip`文件夹下创建一个压缩包，此压缩包中包含了构建完成后的程序和依赖，将它拷贝到对应的服务器上，将之解压，并最终使用`pm2 start pm2.json`来启动程序_

## admin UI 更新方式
删掉node_moudules下的admin-ui-2文件夹，然后重新使用下面的命令安装
```
npm install git+ssh://git@gitlab.dataengine.com:awey/admin-ui-2-publish.git --save
```

## 字体图标列表地址
    http://fontawesome.io/

## 项目中的VUE独立插件列表
  https://github.com/RobinCK/vue-popper


## 接口规范

