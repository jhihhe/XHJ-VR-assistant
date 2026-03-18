# 🚀 象视平台助手 · XHJ VR Assistant

[![GitHub Stars](https://img.shields.io/github/stars/jhihhe/XHJ-VR-assistant?style=for-the-badge&logo=github&color=ffd166)](https://github.com/jhihhe/XHJ-VR-assistant/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/jhihhe/XHJ-VR-assistant?style=for-the-badge&logo=github&color=7bdff2)](https://github.com/jhihhe/XHJ-VR-assistant/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/jhihhe/XHJ-VR-assistant?style=for-the-badge&logo=github&color=ff7aa2)](https://github.com/jhihhe/XHJ-VR-assistant/issues)
[![License](https://img.shields.io/github/license/jhihhe/XHJ-VR-assistant?style=for-the-badge&color=72efdd)](LICENSE)

[![Platform](https://img.shields.io/badge/Platform-Xiangshi_Admin-223?style=for-the-badge&logo=googlechrome&logoColor=white)](#)
[![Type](https://img.shields.io/badge/Type-Tampermonkey_UserScript-8a2be2?style=for-the-badge&logo=tampermonkey&logoColor=white)](#)
[![Language](https://img.shields.io/badge/Language-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=111)](#)
[![Version](https://img.shields.io/badge/Version-v5.0.3-00c853?style=for-the-badge)](#)

[![Themes](https://img.shields.io/badge/Themes-15+-ff9800?style=flat-square)](#-内置主题)
[![HUD UI](https://img.shields.io/badge/HUD-Display_Style-00bcd4?style=flat-square)](#-核心能力)
[![AutoSync](https://img.shields.io/badge/AutoSync-Batch_Ready-7c4dff?style=flat-square)](#-核心能力)
[![AutoVerify](https://img.shields.io/badge/AutoVerify-ONNX_Local-009688?style=flat-square)](#-核心能力)
[![iFrame](https://img.shields.io/badge/iFrame-Style_Sync-5c6bc0?style=flat-square)](#-适配范围)
[![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)](#)

> 为象视平台后台打造的一体化增强脚本：**视觉升级 + 流程自动化 + 列表智能化 + 上传体验增强**。

---

## 🌐 文档导航

- [中文文档](README.md)
- [English README](README-EN.md)
- [GitHub 项目主页](https://github.com/jhihhe/XHJ-VR-assistant)

## 🖼️ 效果预览

![preview-1](pic1.png)
![preview-2](pic2.png)
![preview-3](pic3.png)
![preview-4](pic4.png)
![preview-5](pic5.png)

## ✨ 项目亮点

- **HUD 显示器风格 UI**：统一深色显示层、扫描线、信息栅格、发光描边文字质感。
- **高效业务自动化**：一键自动同步、上传状态增强、计数器反馈。
- **本地智能识别**：内置 ONNX Runtime 验证码识别，不依赖第三方密钥。
- **性能优先策略**：去除高功耗无限动画与重 blur，兼顾沉浸感和低温运行。
- **主页面 + iframe 协同**：样式与行为跨上下文统一。

## 🧠 核心能力

### 1) HUD 视觉引擎
- 全站风格统一：头部、侧栏、卡片、表格、弹窗、按钮一致视觉语义。
- 文本质感增强：主文本/次文本/按钮文字分层渲染，强调可读性与科技感。
- 上传/弹窗显示升级：提示窗、输入控件、上传区边界统一 HUD 风格。

### 2) 自动同步工作流
- 一键执行页面内“同步”按钮批处理。
- 自动进度提示，降低重复点击操作。
- 保留原业务逻辑，仅做提效增强。

### 3) 智能表格布局与可读性
- 表头和内容对齐修复。
- 房勘与售房全景场景列宽策略优化。
- 长字段显示更紧凑，信息密度更高。

### 4) 上传计数与状态增强
- 房勘上传计数（3D 数码管风格）。
- 全景上传“成功/完成”状态识别与计数。
- 状态文本自动着色，降低误判成本。

### 5) 本地验证码识别（AutoVerify）
- ONNX 本地推理，数据不出本机。
- 避免云接口依赖，稳定且可控。

## 🎨 内置主题

- Star Wars HUD (Immersive)
- Dracula (Official)
- Monokai Pro
- Solarized Dark (Pro)
- MacOS Light
- Cyberpunk 2077
- Synthwave '84'
- Emerald Forest
- Glass Morphism
- Future Tech
- Bauhaus
- Modern Dark
- Midnight Blue
- GitHub Dark
- Default（官方样式）

## 🧩 安装方式

1. 安装浏览器扩展 **Tampermonkey**（Chrome / Edge / Firefox）。
2. 按脚本页 ID 安装对应文件：`xhj_assistant_534783.user.js` / `xhj_assistant_563982.user.js` / `xhj_assistant_563997.user.js`。
3. 进入象视后台页面：`https://vr.xhj.com/houseadmin/`。
4. 通过右下角悬浮入口切换主题并启用增强功能。

## ✅ 适配范围

- 域名：`vr.xhj.com`、`*.xhj.com`
- 上下文：主页面、Layer 弹窗、iframe 子页面
- 组件生态：Layui + 部分 Element UI

## 📜 更新摘要

### v5.0
- 三脚本改为分名同码发布，统一同步到 GitHub 仓库。
- 三个 Greasy 页面名称固定为指定名称并保持独立。
- 版本号与描述统一提升到 v5.0，避免低版本号阻塞更新。

### v2.7.4 ~ v2.7.0
- 全景上传计数器定位、识别逻辑与 3D 数码管显示持续优化。

## ⚠️ 声明

- 本脚本仅增强前端显示和操作体验，不修改后台核心数据结构。
- 若你的业务页面 DOM 结构与默认场景不同，欢迎提交 Issue 反馈适配需求。
