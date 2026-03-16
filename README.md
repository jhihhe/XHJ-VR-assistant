# 🎨 象视平台助手 (v2.7.4)

![平台](https://img.shields.io/badge/Platform-象视后台-1f6feb?style=for-the-badge)
![脚本](https://img.shields.io/badge/Type-Tampermonkey%20UserScript-8a2be2?style=for-the-badge)
![语言](https://img.shields.io/badge/Language-JavaScript-f7df1e?style=for-the-badge)
![状态](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![版本](https://img.shields.io/badge/Version-v2.7.4-00c853?style=for-the-badge)

![主题数量](https://img.shields.io/badge/Themes-14+-ff9800?style=flat-square)
![自动同步](https://img.shields.io/badge/AutoSync-Enabled-7c4dff?style=flat-square)
![验证码识别](https://img.shields.io/badge/AutoVerify-ONNX_Local-009688?style=flat-square)
![计数器](https://img.shields.io/badge/Counter-3D_Digital-ff5252?style=flat-square)
![布局引擎](https://img.shields.io/badge/Layout-Smart_Table-blue?style=flat-square)
![iFrame适配](https://img.shields.io/badge/iFrame-Style_Sync-5c6bc0?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Copyright](https://img.shields.io/badge/Copyright-%C2%A9%202026%20Xiangshi-lightgrey?style=flat-square)

[中文](README.md) | [English](README-EN.md) | [GitHub 项目主页](https://github.com/jhihhe/XHJ-VR-assistant)

> 为象视平台后台提供「视觉升级 + 操作提效 + 智能自动化」的一站式增强体验。

## 🌟 项目亮点

- 🎯 **深度美化**：macOS 风格深色主题、玻璃拟态、细腻阴影与动效。
- ⚡ **高性能**：核心逻辑基于 MutationObserver + 防抖，减少无效轮询。
- 🤖 **高效率**：内置自动同步、智能验证码识别、状态着色与计数器。
- 🧩 **强适配**：支持主页面与 iframe 子页面样式/行为协同。

## 🧠 核心能力

### 1) UI 深度美化引擎
- 统一深色体系：背景、面板、表格、按钮、弹窗一致化。
- 动效细节增强：悬浮、点击、反馈过渡更顺滑。
- 全局去白底：减少原系统样式突兀感。
- Auto Scale：支持高分屏与小屏环境下更舒适布局。

### 2) 智能自动同步
- 一键触发批量同步任务，减少重复操作。
- 过程状态可视化，自动跳过已处理项。
- 控件风格与主题统一，视觉一致性更高。

### 3) 智能列表排版
- 表头与内容像素级对齐优化。
- 多业务表格列宽策略自适应（房勘 / 售房全景）。
- 长字段可读性提升，信息密度更高。

### 4) 智能验证码识别（v2.0+）
- 内置 AutoVerify（ONNX Runtime 本地识别）。
- 无需第三方接口与密钥。
- 本地处理更安全。

### 5) 上传计数与状态交互
- 房堪上传：3D 数码管计数器，支持光谱渐变。
- 全景上传：统计“上传成功/上传完成”数量并动态显示。
- 状态文本自动着色：上传中、成功、失败更直观。

### 6) 登录页深度美化（v2.5.3+）
- 登录页主题联动切换。
- 卡片/控件玻璃拟态增强。
- 保留粒子效果并优化可读性。

## 🎨 内置主题

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
- Default（官方原样式）

## 🧰 安装与使用

1. 安装浏览器扩展 **Tampermonkey**（Chrome / Edge / Firefox）。
2. 将 `xhj_assistant.user.js` 安装到 Tampermonkey。
3. 打开象视平台后台页面：`https://vr.xhj.com/houseadmin/`。
4. 点击右下角悬浮球切换主题与功能。
5. 在支持页面使用自动同步与上传增强能力。

## ✅ 适配范围

- 域名：`vr.xhj.com` 与 `*.xhj.com`
- 页面类型：主页面、Layer 弹窗、iframe 子页面
- 组件：Layui / 部分 Element UI 组件

## 📝 近期更新

### v2.7.4 (2026-03-16)
- 修复全景图上传计数器在部分 DOM 结构下统计为 0 的问题，增强状态文本识别。

### v2.7.3 (2026-03-16)
- 优化全景图计数器位置，移动到“类型”选择栏右侧区域。

### v2.7.2 (2026-03-16)
- 新增全景图 3D 数码管计数器，支持“上传成功”实时统计。

### v2.7.1 (2026-03-16)
- 计数器从 9 张开始进入浅绿光谱，并支持“已上传: XX 张”展示。

### v2.7.0 (2026-03-16)
- 房堪上传计数器升级为 3D 数码管样式与渐变色逻辑。

## 📌 说明

- 本脚本仅修改前端展示与交互流程，不改动后台核心数据结构。
- 若你在实际业务页面遇到结构差异，可提交 issue 以便快速适配。
