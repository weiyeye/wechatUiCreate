<p align="center">
  <img src="./branding/wechat-dialogue-generator-logo-v1.png" width="140" alt="微信对话生成器 Logo">
</p>

<h1 align="center">微信对话生成器</h1>

<p align="center">
  基于 Vue 3 与 Tauri 2 的微信聊天界面创作工具，支持网页运行与 Windows 桌面应用。
</p>

<p align="center">
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white">
  <img alt="Vite 4" src="https://img.shields.io/badge/Vite-4-646cff?logo=vite&logoColor=white">
  <img alt="Tauri 2" src="https://img.shields.io/badge/Tauri-2-24c8db?logo=tauri&logoColor=white">
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
</p>

## 项目简介

微信对话生成器用于快速制作聊天界面原型、剧情配图与演示素材。你可以自由配置设备外观、聊天角色和消息内容，在右侧实时预览，并导出图片、长图、GIF 或用于视频剪辑的图片序列。

桌面端通过 Tauri 2 封装，保留完整的网页端能力，并提供更自然的本地文件保存体验。聊天数据保存在本机，不需要上传到服务器。

> [!IMPORTANT]
> 本项目仅供界面设计、学习、测试和合法的内容创作使用。请勿用于欺诈、造谣、冒充他人、伪造证据或其他违法违规行为。使用者应自行承担其生成和传播内容所产生的责任。

## 功能特性

- 自定义手机型号、状态栏、时间、电量、网络、聊天标题与背景
- 支持浅色/深色模式、听筒模式、消息免打扰和未读数量
- 创建和管理多个聊天角色，自定义昵称与头像
- 支持文本、表情、图片、视频、红包、转账、语音、时间、系统消息、拍一拍和撤回消息等内容
- 实时预览聊天效果，并可缩放或自适应窗口
- 生成普通截图与完整聊天长图
- 生成 GIF 动图；视频模式可导出编号图片序列压缩包，便于在剪辑软件中合成
- 保存常用聊天模板，支持聊天记录 JSON 导入与导出
- 使用 IndexedDB 在本地持久化数据
- 同时支持浏览器版本与 Tauri Windows 桌面版本

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 前端 | Vue 3、Vite 4、Ant Design Vue、Pinia |
| 图像与文件 | html2canvas、gif.js、JSZip、FileSaver.js |
| 本地存储 | IndexedDB、idb-keyval、pinia-plugin-persistedstate |
| 桌面端 | Tauri 2、Rust |

## 快速开始

### 环境要求

- Node.js 18 或更高版本
- npm 或 Yarn 1.x
- 仅开发桌面端时需要 Rust 1.77.2+、Cargo、WebView2，以及 Visual Studio C++ Build Tools

### 获取项目

```bash
git clone https://github.com/weiyeye/wechatUiCreate.git
cd wechatUiCreate
npm install
```

### 启动网页端

```bash
npm run serve
```

开发服务器默认运行在 `http://localhost:9527/`。

### 启动桌面端

桌面构建流程会调用 Yarn，请先确保系统已安装 Yarn：

```bash
yarn install
yarn desktop:dev
```

首次启动需要编译 Rust 依赖，耗时会比后续启动更长。

## 构建发布

### 构建网页版本

```bash
npm run build
```

构建产物位于 `dist/`。生产环境的基础路径可以在 `.env.production` 中通过 `VITE_BASE_PATH` 调整。

### 构建 Windows 安装包

```bash
yarn desktop:build
```

默认生成 NSIS 安装包，输出目录为：

```text
src-tauri/target/release/bundle/nsis/
```

## 可用命令

| 命令 | 说明 |
| --- | --- |
| `npm run serve` | 启动 Vite 开发服务器 |
| `npm run build` | 构建网页生产版本 |
| `npm run preview` | 本地预览网页构建产物 |
| `yarn desktop:dev` | 启动 Tauri 桌面开发模式 |
| `yarn desktop:build` | 构建桌面安装包 |

## 项目结构

```text
├─ branding/           品牌与应用图形资源
├─ public/             静态资源
├─ snapshot/           项目截图与演示动图
├─ src/
│  ├─ components/      配置面板、聊天预览和导出组件
│  ├─ hooks/           图像生成与交互逻辑
│  ├─ store/           Pinia 状态与本地持久化
│  └─ utils/           下载、存储、头像和通用工具
├─ src-tauri/          Tauri 桌面端配置与 Rust 代码
└─ vite.config.js      Vite 网页端/桌面端共用配置
```

## 数据与隐私

角色、聊天记录、模板及大部分设置均保存在当前设备的浏览器/WebView 本地数据库中。项目不会主动将这些内容上传到远程服务器。清理浏览器数据或卸载应用前，请先导出需要保留的聊天记录。

## 上游项目与致谢

本项目基于 [Ele-Cat/vue3-wechat-tool](https://github.com/Ele-Cat/vue3-wechat-tool) 进行二次开发，并在其基础上加入 Tauri 2 桌面端、本地文件保存适配及相关体验优化。感谢原作者和所有贡献者。

## 开源许可

项目遵循 [MIT License](./LICENSE)。二次分发或修改时，请保留原始版权与许可声明。
