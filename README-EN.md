# 🎨 Xiangshi Platform Assistant (v2.7.4)

![Platform](https://img.shields.io/badge/Platform-Xiangshi%20Admin-1f6feb?style=for-the-badge)
![Script](https://img.shields.io/badge/Type-Tampermonkey%20UserScript-8a2be2?style=for-the-badge)
![Language](https://img.shields.io/badge/Language-JavaScript-f7df1e?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-v2.7.4-00c853?style=for-the-badge)

![Themes](https://img.shields.io/badge/Themes-14+-ff9800?style=flat-square)
![AutoSync](https://img.shields.io/badge/AutoSync-Enabled-7c4dff?style=flat-square)
![AutoVerify](https://img.shields.io/badge/AutoVerify-ONNX_Local-009688?style=flat-square)
![Counter](https://img.shields.io/badge/Counter-3D_Digital-ff5252?style=flat-square)
![Layout](https://img.shields.io/badge/Layout-Smart_Table-blue?style=flat-square)
![iFrame](https://img.shields.io/badge/iFrame-Style_Sync-5c6bc0?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Copyright](https://img.shields.io/badge/Copyright-%C2%A9%202026%20Xiangshi-lightgrey?style=flat-square)

[中文](README.md) | [English](README-EN.md) | [GitHub Homepage](https://github.com/jhihhe/XHJ-VR-assistant)

> An all-in-one enhancement script for Xiangshi Admin: visual polish, workflow acceleration, and intelligent automation.

## 🌟 Highlights

- 🎯 **Deep UI Enhancement**: macOS-style dark aesthetic, glassmorphism, refined shadows, smooth interactions.
- ⚡ **Performance-Oriented**: Core dynamic handling based on MutationObserver + debounce (less wasteful polling).
- 🤖 **Automation Ready**: Auto-sync tools, local CAPTCHA recognition, status highlighting, smart counters.
- 🧩 **Cross-Context Support**: Works across main pages, popups, and iframe child pages.

## 🧠 Core Capabilities

### 1) Advanced UI Beautification
- Unified dark visual language for pages, cards, tables, and modals.
- Better interaction details: hover/click feedback and transition tuning.
- De-whitening strategy for inconsistent legacy blocks.
- Auto Scale for high-DPI and smaller display scenarios.

### 2) Intelligent Auto-Sync
- One-click trigger for repetitive sync workflows.
- Live progress/status visibility with skip logic for processed items.
- Theme-consistent controls with no visual mismatch.

### 3) Smart Table Layout Engine
- Pixel-level alignment improvements for Layui tables.
- Business-aware width strategy (Survey List / Sales Panorama).
- Better readability for long fields and dense content.

### 4) Intelligent CAPTCHA Recognition (v2.0+)
- Built-in AutoVerify with ONNX Runtime (local execution).
- No third-party API dependency.
- Better privacy with local processing.

### 5) Upload Counters & Status UX
- Survey Upload: 3D digital counter with spectrum color transition.
- Panorama Upload: real-time count for “Upload Success / Upload Completed”.
- Upload status text color coding for better progress visibility.

### 6) Login Page Beautification (v2.5.3+)
- Full theme sync for login page.
- Enhanced glassmorphism card/control styling.
- Preserves particle effects with readability tuning.

## 🎨 Built-in Themes

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
- Default (official baseline)

## 🧰 Installation & Usage

1. Install **Tampermonkey** (Chrome / Edge / Firefox).
2. Install `xhj_assistant.user.js` into Tampermonkey.
3. Open `https://vr.xhj.com/houseadmin/`.
4. Use the floating button to switch themes/features.
5. Run auto-sync or upload enhancements on supported pages.

## ✅ Compatibility

- Domains: `vr.xhj.com` and `*.xhj.com`
- Contexts: main pages, Layer popups, iframe child pages
- Components: Layui + partial Element UI support

## 📝 Recent Changelog

### v2.7.4 (2026-03-16)
- Fixed panorama counter showing 0 in certain DOM structures by improving status text recognition.

### v2.7.3 (2026-03-16)
- Moved panorama counter to the right side of the “Type” selector area.

### v2.7.2 (2026-03-16)
- Added 3D digital counter for panorama upload success counting.

### v2.7.1 (2026-03-16)
- Counter now shifts to light-green spectrum from 9 images and displays full text.

### v2.7.0 (2026-03-16)
- Survey counter upgraded to 3D digital style with gradient spectrum logic.

## 📌 Notes

- This script enhances client-side UI/interaction and does not alter backend core data structures.
- If your business page has unique DOM structures, open an issue for fast adaptation.
