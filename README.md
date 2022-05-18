# MC RES WEB

> 我的世界资源站前端

此项目是一个会员制的资源平台, 向拥有会员的用户提供资源下载及技术支持等。

## 安装

项目基于 nodeJs 运行，(开发环境的版本为 v16.14.0 )  
项目使用 svelte+sveltekit 作为构建框架, bootstrap+picocss 作为样式框架编写。

1. 首先需要安装 [NodeJs](https://nodejs.org)
2. Windows 平台运行 `init.cmd` 脚本进行初始化  
   其它平台请使用如下命令进行初始化:

```bash
npm i
npm run build
```

## 运行

Windows 平台运行 `start.cmd` 脚本启动服务器  
其它平台请使用如下命令启动:

```bash
node output/index.js
```

服务器的地址通过环境变量指定

- HOST: 指定监听地址, 默认为 0.0.0.0
- PORT: 指定监听端口, 默认为 3000
