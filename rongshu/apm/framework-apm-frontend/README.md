## 创建项目步骤：
1. 初始化`package.json`

```
npm init
```

2. 安装`apm-frontend-framework`依赖包
```
npm install --save git+ssh://git@gogs.in.dataengine.com:APM-FE/apm-frontend-framework.git
```
3. 安装项目模板依赖
```
npm install
```
4. 初始化项目模板
```
node ./node_modules/apm-frontend-framework/index.js --init --appname=apm
# 或者使用简写模式：
node ./node_modules/apm-frontend-framework/index.js -i -n apm
```
> 注意：--appname不能忽略，作为当前项目的标识。

## npm命令：
1. `npm run dev` 调试vue前端页面
2. `npm run build` 构建项目
3. `npm run start` 启动项目，当你在调试后端服务时，需要结合dev命令一起使用。



## 项目开发文档
1. [文件结构](./docs/file-structure.md)
2. [命令](./docs/intro.md)
3. [前端路由](./docs/router.md)
4. [状态管理](./docs/store.md)
5. [服务编写](./docs/service.md)
6. [公共组件]
  6.1. [公共组件](./docs/service.md)
