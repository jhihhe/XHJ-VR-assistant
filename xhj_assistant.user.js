// ==UserScript==
// @name         象视平台助手
// @namespace    http://tampermonkey.net/
// @version      1.46
// @description  象视平台综合辅助工具：包含多款皮肤切换（MacOS Light/Dracula/Midnight/Synthwave等）、UI 深度美化 (Pro级配色/3D立体视效)、iframe 样式同步、以及自动化同步操作功能。v1.46: 极致净化 MacOS 主题，去除多余色彩，还原系统级磨砂质感。
// @author       Jhih he
// @license      MIT
// @match        https://vr.xhj.com/houseadmin/*
// @match        *://vr.xhj.com/*
// @match        *://*.xhj.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /* ==========================================================================
       模块 1: 皮肤与 UI 优化 (Skin & UI)
       ========================================================================== */

    const SKIN_STORAGE_KEY = 'xhj_skin_theme';
    const STYLE_ID = 'xhj-custom-skin-style';

    // 定义主题配置
    const themes = {
        'default': {
            name: '默认 (Default)',
            vars: {} // 空对象表示移除样式
        },
        'dracula': {
            name: 'Dracula (Official)',
            vars: {
                '--xhj-bg': '#282a36',
                '--xhj-fg': '#f8f8f2',
                '--xhj-header-bg': '#44475a',
                '--xhj-side-bg': '#21222c',
                '--xhj-active-bg': '#bd93f9',
                '--xhj-active-fg': '#282a36',
                '--xhj-border': '#6272a4',
                '--xhj-hover-bg': '#44475a',
                '--xhj-input-bg': '#282a36',
                '--xhj-table-head': '#44475a',
                '--xhj-glow-color': 'rgba(189, 147, 249, 0.6)',
                '--xhj-shadow-color': 'rgba(98, 114, 164, 0.4)'
            }
        },
        'solarized-dark': {
            name: 'Solarized Dark (Pro)',
            vars: {
                '--xhj-bg': '#002b36',
                '--xhj-fg': '#839496',
                '--xhj-header-bg': '#073642',
                '--xhj-side-bg': '#00212b',
                '--xhj-active-bg': '#2aa198',
                '--xhj-active-fg': '#002b36',
                '--xhj-border': '#586e75',
                '--xhj-hover-bg': '#073642',
                '--xhj-input-bg': '#002b36',
                '--xhj-table-head': '#073642',
                '--xhj-glow-color': 'rgba(42, 161, 152, 0.6)',
                '--xhj-shadow-color': 'rgba(42, 161, 152, 0.3)'
            }
        },
        'monokai': {
            name: 'Monokai Pro (Spectrum)',
            vars: {
                '--xhj-bg': '#2D2A2E',
                '--xhj-fg': '#fcfcfa',
                '--xhj-header-bg': '#403E41',
                '--xhj-side-bg': '#221F22',
                '--xhj-active-bg': '#FFD866',
                '--xhj-active-fg': '#2D2A2E',
                '--xhj-border': '#727072',
                '--xhj-hover-bg': '#403E41',
                '--xhj-input-bg': '#2D2A2E',
                '--xhj-table-head': '#403E41',
                '--xhj-glow-color': 'rgba(255, 216, 102, 0.6)',
                '--xhj-shadow-color': 'rgba(255, 216, 102, 0.3)'
            }
        },
        'github-dark': {
            name: 'GitHub Dark (Dimmed)',
            vars: {
                '--xhj-bg': '#0d1117',
                '--xhj-fg': '#c9d1d9',
                '--xhj-header-bg': '#161b22',
                '--xhj-side-bg': '#010409',
                '--xhj-active-bg': '#1f6feb',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': '#30363d',
                '--xhj-hover-bg': '#21262d',
                '--xhj-input-bg': '#0d1117',
                '--xhj-table-head': '#161b22',
                '--xhj-glow-color': 'rgba(31, 111, 235, 0.6)',
                '--xhj-shadow-color': 'rgba(31, 111, 235, 0.3)'
            }
        },
        'cyberpunk': {
            name: 'Cyberpunk 2077 (Edgerunner)',
            vars: {
                '--xhj-bg': '#000b1e',
                '--xhj-fg': '#00f3ff',
                '--xhj-header-bg': '#05122b',
                '--xhj-side-bg': '#000000',
                '--xhj-active-bg': '#fcee0a',
                '--xhj-active-fg': '#000000',
                '--xhj-border': '#ff003c',
                '--xhj-hover-bg': 'rgba(255, 0, 60, 0.2)',
                '--xhj-input-bg': '#000000',
                '--xhj-table-head': '#05122b',
                '--xhj-glow-color': '#00f3ff',
                '--xhj-special-font': 'Courier New, monospace',
                '--xhj-shadow-color': 'rgba(255, 0, 60, 0.5)'
            }
        },
        'glass-morphism': {
            name: 'Glass Morphism (Frost)',
            vars: {
                '--xhj-bg': '#1a1c2c',
                '--xhj-fg': '#e0e6ed',
                '--xhj-header-bg': 'rgba(255, 255, 255, 0.08)',
                '--xhj-side-bg': 'rgba(0, 0, 0, 0.3)',
                '--xhj-active-bg': '#7aa2f7',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': 'rgba(255, 255, 255, 0.15)',
                '--xhj-hover-bg': 'rgba(255, 255, 255, 0.1)',
                '--xhj-input-bg': 'rgba(0, 0, 0, 0.25)',
                '--xhj-table-head': 'rgba(255, 255, 255, 0.05)',
                '--xhj-glow-color': '#7aa2f7',
                '--xhj-shadow-color': 'rgba(122, 162, 247, 0.3)'
            }
        },
        'future-tech': {
            name: 'Future Tech (Grid)',
            vars: {
                '--xhj-bg': '#050a14',
                '--xhj-fg': '#00f2ff',
                '--xhj-header-bg': 'rgba(5, 10, 20, 0.9)',
                '--xhj-side-bg': 'rgba(0, 0, 0, 0.85)',
                '--xhj-active-bg': '#d900ff',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': '#00f2ff',
                '--xhj-hover-bg': 'rgba(217, 0, 255, 0.25)',
                '--xhj-input-bg': 'rgba(0, 0, 0, 0.6)',
                '--xhj-table-head': 'rgba(0, 242, 255, 0.1)',
                '--xhj-glow-color': '#d900ff',
                '--xhj-shadow-color': 'rgba(217, 0, 255, 0.4)'
            }
        },
        'modern-dark': {
            name: 'Modern Dark (Stone)',
            vars: {
                '--xhj-bg': '#1C1917',
                '--xhj-fg': '#E7E5E4',
                '--xhj-header-bg': '#292524',
                '--xhj-side-bg': '#1C1917',
                '--xhj-active-bg': '#CA8A04',
                '--xhj-active-fg': '#FFFFFF',
                '--xhj-border': '#44403C',
                '--xhj-hover-bg': '#44403C',
                '--xhj-input-bg': '#292524',
                '--xhj-table-head': '#292524',
                '--xhj-glow-color': 'rgba(202, 138, 4, 0.6)',
                '--xhj-shadow-color': 'rgba(202, 138, 4, 0.3)'
            }
        },
        'midnight-blue': {
            name: 'Midnight Blue (Deep Ocean)',
            vars: {
                '--xhj-bg': '#020617',
                '--xhj-fg': '#F1F5F9',
                '--xhj-header-bg': '#0F172A',
                '--xhj-side-bg': '#020617',
                '--xhj-active-bg': '#38BDF8',
                '--xhj-active-fg': '#000000',
                '--xhj-border': '#1E293B',
                '--xhj-hover-bg': '#1E293B',
                '--xhj-input-bg': '#0F172A',
                '--xhj-table-head': '#0F172A',
                '--xhj-glow-color': 'rgba(56, 189, 248, 0.6)',
                '--xhj-shadow-color': 'rgba(56, 189, 248, 0.3)'
            }
        },
        'synthwave-84': {
            name: 'Synthwave \'84 (Retrowave)',
            vars: {
                '--xhj-bg': '#241b2f', /* Lighter purple-ish base */
                '--xhj-fg': '#ff71ce', /* Neon Pink Text */
                '--xhj-header-bg': '#2b213a',
                '--xhj-side-bg': '#241b2f',
                '--xhj-active-bg': '#01cdfe', /* Cyan Active */
                '--xhj-active-fg': '#241b2f',
                '--xhj-border': '#b967ff',
                '--xhj-hover-bg': '#b967ff',
                '--xhj-input-bg': '#2b213a',
                '--xhj-table-head': '#2b213a',
                '--xhj-glow-color': 'rgba(1, 205, 254, 0.8)',
                '--xhj-shadow-color': 'rgba(1, 205, 254, 0.4)'
            }
        },
        'emerald-forest': {
            name: 'Emerald Forest (Nature)',
            vars: {
                '--xhj-bg': '#022c22',
                '--xhj-fg': '#ecfdf5',
                '--xhj-header-bg': '#064e3b',
                '--xhj-side-bg': '#022c22',
                '--xhj-active-bg': '#10b981', /* Brighter Emerald */
                '--xhj-active-fg': '#022c22',
                '--xhj-border': '#065f46',
                '--xhj-hover-bg': '#065f46',
                '--xhj-input-bg': '#064e3b',
                '--xhj-table-head': '#064e3b',
                '--xhj-glow-color': 'rgba(16, 185, 129, 0.6)',
                '--xhj-shadow-color': 'rgba(16, 185, 129, 0.3)'
            }
        },
        'macos-light': {
            name: 'MacOS Light (Clean)',
            vars: {
                '--xhj-bg': '#F5F5F7',
                '--xhj-fg': '#1D1D1F',
                '--xhj-header-bg': 'rgba(255, 255, 255, 0.6)',
                '--xhj-side-bg': 'rgba(235, 235, 240, 0.85)', /* Finder Sidebar Gray */
                '--xhj-active-bg': '#007AFF',
                '--xhj-active-fg': '#FFFFFF',
                '--xhj-border': 'rgba(0, 0, 0, 0.1)',
                '--xhj-hover-bg': 'rgba(0, 0, 0, 0.05)',
                '--xhj-input-bg': '#FFFFFF',
                '--xhj-table-head': 'rgba(0, 0, 0, 0.02)',
                '--xhj-glow-color': 'rgba(0, 122, 255, 0.2)',
                '--xhj-shadow-color': 'rgba(0, 0, 0, 0.05)'
            }
        }
    };

    // 通用 CSS 模板 (Layui 覆盖)
    const getCssTemplate = (vars) => {
        if (Object.keys(vars).length === 0) return '';

        const varDeclarations = Object.entries(vars)
            .map(([k, v]) => `${k}: ${v};`)
            .join('\n');
            
        // Future Tech 专属网格背景
        let extraCss = '';
        if (vars['--xhj-bg'] === '#050a14') {
             extraCss = `
                body::before {
                    content: "";
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: 
                        linear-gradient(rgba(0, 242, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 242, 255, 0.05) 1px, transparent 1px);
                    background-size: 50px 50px;
                    z-index: -1;
                    pointer-events: none;
                }
             `;
        }
        
        // MacOS Light 专属极致净化 (Pure MacOS)
        if (vars['--xhj-bg'] === '#F5F5F7') {
             extraCss += `
                /* 1. 强制去除侧边栏黑色 (Force Light Sidebar) */
                .layui-side, .layui-side-scroll, .layui-nav, .layui-nav-tree, .layui-nav-item, .layui-nav-child, .layui-logo {
                    background-color: transparent !important;
                    background: transparent !important;
                }
                /* 确保 Logo 区域颜色适配 */
                .layui-layout-admin .layui-logo {
                    color: var(--xhj-fg) !important;
                    border-bottom: 1px solid var(--xhj-border) !important;
                    box-shadow: none !important;
                }
                /* 侧边栏文字颜色 */
                .layui-nav-tree .layui-nav-item a {
                    color: #1d1d1f !important; /* Force Dark Text */
                }
                .layui-nav-tree .layui-nav-item a:hover {
                    background-color: rgba(0,0,0,0.05) !important;
                }
                
                /* 2. 净化高亮与按钮颜色 (System Colors) */
                .layui-btn-normal { background-color: #007AFF !important; } /* System Blue */
                .layui-btn-warm { background-color: #FF9500 !important; }   /* System Orange */
                .layui-btn-danger { background-color: #FF3B30 !important; } /* System Red */
                .layui-bg-cyan { background-color: #5AC8FA !important; }    /* System Cyan */
                .layui-bg-green { background-color: #34C759 !important; }   /* System Green */
                .layui-badge { border-radius: 4px !important; }
                
                /* 3. 柔化卡片与表格 (Soften & De-noise) */
                .layui-card {
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
                    border: 1px solid rgba(0,0,0,0.05) !important;
                }
                .layui-table-header {
                    background-color: rgba(0,0,0,0.02) !important;
                }
                /* 去除过重的阴影 */
                .el-dialog, .el-button--primary {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                }
             `;
        }

        return `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
            ${extraCss}
            :root {
                ${varDeclarations}
                --xhj-shadow-color: rgba(0, 0, 0, 0.3);
                --xhj-shadow: 0 10px 30px -10px var(--xhj-shadow-color);
                --xhj-shadow-hover: 0 20px 40px -12px var(--xhj-shadow-color);
                --xhj-radius: 8px;
                --xhj-btn-gradient: linear-gradient(180deg, rgba(255,255,255,0.15), rgba(0,0,0,0));
                --xhj-card-gradient: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.02));
                --xhj-sidebar-bg: rgba(33, 34, 44, 0.95);
                --xhj-glow: 0 0 15px var(--xhj-glow-color, rgba(189, 147, 249, 0.4));
                --xhj-glass-border: 1px solid rgba(255, 255, 255, 0.1);
            }

            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
                100% { transform: translateY(0px); }
            }

            @keyframes neon-pulse {
                0% { box-shadow: 0 0 5px var(--xhj-active-bg), 0 0 10px var(--xhj-active-bg); }
                50% { box-shadow: 0 0 10px var(--xhj-active-bg), 0 0 20px var(--xhj-active-bg); }
                100% { box-shadow: 0 0 5px var(--xhj-active-bg), 0 0 10px var(--xhj-active-bg); }
            }

            @keyframes ripple-effect {
                0% { transform: scale(0); opacity: 0.8; }
                100% { transform: scale(4); opacity: 0; }
            }
            
            /* --- 视觉净化与去噪 (Cleanup) --- */
            
            /* 1. 暴力隐藏购物插件注入的垃圾元素 */
            [class*="gwd-"], [id*="gwd"], [class*="bjg-"] {
                display: none !important;
                visibility: hidden !important;
                width: 0 !important;
                height: 0 !important;
                pointer-events: none !important;
            }

            /* 2. 移除左侧生硬的绿色边框 */
            #admin-body {
                border-left: none !important;
                box-shadow: -5px 0 15px rgba(0,0,0,0.1) !important; /* 用柔和阴影代替 */
            }

            /* 3. Logo 区域现代化 */
            .admin-login-box .logo span {
                /* 科技感霓虹渐变 (极光青 -> 霓虹紫) */
                background: linear-gradient(135deg, #00dbde 0%, #fc00ff 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 800;
                letter-spacing: 2px;
                filter: drop-shadow(0 0 8px rgba(252, 0, 255, 0.4));
            }
            
            /* 4. 顶部导航栏毛玻璃悬浮感 (Enhanced) */
            .layui-header {
                background-color: rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.8) !important;
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border-bottom: 1px solid rgba(255,255,255,0.08) !important;
            }

            /* 5. 滚动条美化 (全局) */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            ::-webkit-scrollbar-thumb {
                background: var(--xhj-border); /* 使用主题变量 */
                opacity: 0.5;
                border-radius: 4px;
                border: 1px solid transparent;
                background-clip: content-box;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: var(--xhj-active-bg);
                border: 0;
            }

            /* --- 核心修复：强制应用背景色 --- */
            html, body {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
                -webkit-font-smoothing: antialiased;
                /* Polish Style Font Stack + Inter */
                font-family: 'Inter', ui-rounded, 'SF Pro Rounded', 'SF Pro Text', 'Helvetica Neue', -apple-system, system-ui, BlinkMacSystemFont, Roboto, sans-serif !important;
            }
            
            /* Accessibility: Focus States */
            :focus-visible {
                outline: 2px solid var(--xhj-active-bg) !important;
                outline-offset: 2px !important;
            }
            
            /* 修复 iframe 内可能存在的白色背景类 */
            .layui-bg-white, .admin-main, .layui-fluid {
                background-color: transparent !important;
            }
            
            /* 修复 iframe 内部增加底部内边距，防止底部按钮被遮挡 */
            body.xhj-iframe-body {
                padding-bottom: 0px !important;
            }

            /* --- 修复 Loading 等待框白色背景 --- */
            .layui-table-init, .layui-layer-loading .layui-layer-content {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
            }
            .layui-table-init .layui-icon {
                color: var(--xhj-active-bg) !important;
            }
            /* 针对 .layui-layer-shade (遮罩层) 保持透明度但适配深色 */
            .layui-layer-shade {
                opacity: 0.6 !important;
                background-color: #000 !important;
            }
            /* 通用白色背景类覆盖 */
            .layui-bg-white {
                background-color: transparent !important;
            }

            /* --- 炫酷交互特效 --- */

            /* --- 7. 原版平台深度适配 (Original Platform Adaptation) --- */
            
            /* 7.1 Element UI 组件适配 (3D Enhanced v1.45) */
            .el-dialog {
                background: var(--xhj-side-bg) !important;
                /* 3D Surface Gradient */
                background-image: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%) !important;
                color: var(--xhj-fg) !important;
                /* Rim Light & Deep Shadow */
                border: 1px solid rgba(255,255,255,0.1) !important;
                box-shadow: 
                    0 25px 50px -12px rgba(0,0,0,0.5), 
                    0 0 0 1px rgba(255,255,255,0.1) inset,
                    0 10px 30px rgba(0,0,0,0.2) inset !important;
                border-radius: 16px !important;
                backdrop-filter: blur(25px) saturate(180%);
            }
            .el-dialog__title { 
                color: var(--xhj-active-bg) !important; 
                font-weight: 700 !important;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .el-dialog__headerbtn .el-dialog__close { color: var(--xhj-fg) !important; }
            .el-dialog__body { color: var(--xhj-fg) !important; padding: 25px !important; }
            .el-form-item__label { color: var(--xhj-fg) !important; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
            
            /* Input 3D Recessed Look */
            .el-input__inner, .el-textarea__inner {
                background-color: rgba(0, 0, 0, 0.25) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid rgba(0,0,0,0.3) !important;
                border-bottom: 1px solid rgba(255,255,255,0.1) !important; /* Bottom Highlight */
                border-radius: 10px !important;
                box-shadow: inset 0 2px 5px rgba(0,0,0,0.4) !important; /* Inner Shadow */
                transition: all 0.3s ease;
            }
            .el-input__inner:focus, .el-textarea__inner:focus {
                border-color: var(--xhj-active-bg) !important;
                background-color: rgba(0, 0, 0, 0.4) !important;
                box-shadow: 
                    inset 0 2px 5px rgba(0,0,0,0.5),
                    0 0 0 2px var(--xhj-glow-color) !important;
            }
            
            /* Upload Box 3D Slot Look */
            .el-upload--picture-card, .picture-add, .avatar-uploader .el-upload {
                background-color: rgba(0,0,0,0.2) !important;
                border: 2px dashed rgba(255,255,255,0.2) !important;
                border-radius: 12px !important;
                box-shadow: inset 0 0 15px rgba(0,0,0,0.3) !important;
                transition: all 0.3s !important;
            }
            .el-upload--picture-card:hover, .picture-add:hover, .avatar-uploader .el-upload:hover {
                border-color: var(--xhj-active-bg) !important;
                box-shadow: inset 0 0 20px var(--xhj-glow-color) !important;
                transform: scale(0.98);
            }
            
            .el-button {
                background: var(--xhj-input-bg) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                color: var(--xhj-fg) !important;
                border-radius: 10px !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
            }
            .el-button--primary {
                background: var(--xhj-active-bg) !important;
                border-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                /* Glossy 3D Button */
                background-image: linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(0,0,0,0.15)) !important;
                box-shadow: 
                    0 4px 14px -4px var(--xhj-active-bg),
                    0 1px 0 rgba(255,255,255,0.2) inset,
                    0 -1px 0 rgba(0,0,0,0.1) inset !important;
            }
            .el-button--primary:hover {
                filter: brightness(1.1);
                transform: translateY(-1px);
                box-shadow: 
                    0 6px 20px -4px var(--xhj-active-bg),
                    0 1px 0 rgba(255,255,255,0.2) inset !important;
            }
            .el-button--primary:active {
                transform: translateY(1px) scale(0.98);
                box-shadow: inset 0 3px 5px rgba(0,0,0,0.3) !important;
            }

            /* 7.2 自定义布局组件 (from app.css) */
            .topbox {
                background-color: var(--xhj-side-bg) !important;
                border: 1px solid var(--xhj-border) !important;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.05) !important;
                border-radius: 30px !important;
                backdrop-filter: blur(10px);
            }
            .topbox_item { color: var(--xhj-fg) !important; transition: all 0.3s !important; }
            
            .isAction {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                box-shadow: 0 2px 10px var(--xhj-glow-color) !important;
                background-image: var(--xhj-btn-gradient) !important;
                transform: scale(1.05);
                font-weight: bold;
            }
            
            /* 7.3 轮播图控制适配 */
            .swiper-button-prev, .swiper-button-next {
                color: var(--xhj-active-bg) !important;
                filter: drop-shadow(0 0 5px var(--xhj-glow-color));
                transition: all 0.3s;
            }
            .swiper-button-prev:hover, .swiper-button-next:hover {
                transform: scale(1.2);
                color: #fff !important;
            }
            
            /* 7.4 头部与侧边栏深度覆盖 */
            .site-tree {
                background-color: var(--xhj-side-bg) !important;
                border-right: 1px solid var(--xhj-border) !important;
            }
            .site-banner {
                background-color: var(--xhj-header-bg) !important;
                background-image: var(--xhj-card-gradient) !important;
            }

            /* 选中文字效果 */
            ::selection {
                background: var(--xhj-active-bg);
                color: var(--xhj-active-fg);
                text-shadow: 0 0 5px var(--xhj-glow-color);
            }

            /* 鼠标点击波纹元素 */
            .xhj-click-ripple {
                position: fixed;
                border-radius: 50%;
                background: var(--xhj-active-bg);
                transform: scale(0);
                animation: ripple-effect 0.6s linear;
                pointer-events: none;
                z-index: 99999999;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
                box-shadow: 0 0 10px var(--xhj-active-bg);
            }

            /* --- Polish Style UI 深度优化 (V2EX Polish 风格移植) --- */
            
            /* 1. 大圆角容器 (Polish Style: 18px) */
            .layui-card, .layui-panel, .layui-layer, .layui-layer-page {
                border-radius: 18px !important;
            }
            
            /* 2. 按钮优化 (Polish Style: 6px-10px, subtle shadow) */
            .layui-btn {
                border-radius: 10px !important;
                font-weight: 600 !important;
                letter-spacing: 0.5px;
                /* 模拟 V2EX Polish 按钮阴影 */
                box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.1) inset !important;
            }
            .layui-btn:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.1) inset !important;
            }
            
            /* 3. 输入框优化 (Polish Style) */
            .layui-input, .layui-select, .layui-textarea {
                border-radius: 10px !important;
                padding-left: 12px !important;
            }
            
            /* 4. 侧边栏与导航 (Polish Style: Capsule Tabs) */
            .layui-nav-tree .layui-nav-item a {
                border-radius: 12px !important;
                margin: 4px 10px !important;
            }
            
            /* 5. 表格圆角化 */
            .layui-table-view {
                border-radius: 14px !important;
                overflow: hidden !important;
                border: 1px solid rgba(255,255,255,0.05) !important;
            }
            
            /* 6. 弹窗头部圆角 */
            .layui-layer-title {
                border-radius: 18px 18px 0 0 !important;
                padding-left: 25px !important;
            }
            .layui-layer-btn {
                border-radius: 0 0 18px 18px !important;
            }

            /* --- 全局组件优化 (保留原有) --- */
            
            /* 过渡动画 */
            .layui-btn, .layui-input, .layui-nav-item a, .layui-table-cell, .layui-tab-title li {
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            }

            /* 侧边栏 macOS 风格 */
            .layui-side, .layui-side-scroll, .layui-bg-black {
                background-color: var(--xhj-side-bg) !important;
                border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
                box-shadow: 5px 0 15px rgba(0,0,0,0.2);
                backdrop-filter: blur(10px);
            }
            .layui-nav-tree .layui-nav-item a {
                color: var(--xhj-fg) !important;
                /* margin & radius moved to Polish section */
                width: auto !important;
            }
            .layui-nav-tree .layui-nav-item a:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
                transform: translateX(4px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .layui-nav-tree .layui-this {
                background-color: transparent !important;
            }
            .layui-nav-tree .layui-this > a {
                background-color: var(--xhj-active-bg) !important;
                background-image: linear-gradient(135deg, var(--xhj-active-bg), var(--xhj-glow-color)) !important;
                color: var(--xhj-active-fg) !important;
                box-shadow: var(--xhj-glow) !important;
                border-radius: 12px !important; /* Updated to 12px */
                margin: 0 10px !important;
                width: auto !important;
                transform: translateY(-1px) scale(1.02) !important;
                text-shadow: none !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
            }
            .layui-nav-tree .layui-this > a::after { display: none !important; }

            /* 顶部 Header & Tabs */
            .layui-layout-admin .layui-header {
                background-color: var(--xhj-header-bg) !important;
                border-bottom: 1px solid var(--xhj-border);
                box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                z-index: 1000;
            }
            .layui-tab { background-color: transparent !important; }
            .layui-tab-title {
                border-bottom-color: var(--xhj-border) !important;
                background-color: transparent !important;
            }
            .layui-tab-title li {
                color: var(--xhj-fg) !important;
                background-color: rgba(255, 255, 255, 0.05) !important;
                border-color: transparent !important;
                margin-right: 2px;
                border-radius: 8px 8px 0 0 !important; /* Polish Style */
            }
            .layui-tab-title .layui-this {
                color: var(--xhj-active-bg) !important;
                background-color: var(--xhj-header-bg) !important;
                border-color: var(--xhj-border) !important;
                border-bottom-color: var(--xhj-header-bg) !important;
                text-shadow: 0 0 8px var(--xhj-glow-color) !important;
            }
            .layui-tab-title .layui-this:after { border: none !important; }

            /* 分页栏 */
            .layui-table-page {
                background-color: transparent !important;
                border-top: 1px solid var(--xhj-border) !important;
            }
            .layui-laypage a, .layui-laypage span {
                color: var(--xhj-fg) !important;
                background-color: transparent !important;
                border-color: var(--xhj-border) !important;
                border-radius: 8px !important; /* Polish Style */
            }
            .layui-laypage a:hover {
                color: var(--xhj-active-bg) !important;
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 5px var(--xhj-glow-color) !important;
            }
            .layui-laypage .layui-laypage-curr .layui-laypage-em {
                background-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 8px var(--xhj-glow-color) !important;
                border-radius: 8px !important;
            }
            .layui-laypage input, .layui-laypage button, .layui-laypage select {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
                border-radius: 8px !important;
            }

            /* 表单元素 */
            .layui-form-label {
                background-color: transparent !important;
                color: var(--xhj-fg) !important;
                border: none !important;
            }
            .layui-input-block, .layui-form-item { background-color: transparent !important; }
            .layui-form-pane .layui-form-label {
                background-color: rgba(255,255,255,0.05) !important;
                color: var(--xhj-fg) !important;
                border-color: var(--xhj-border) !important;
                border-radius: 8px 0 0 8px !important;
            }

            /* 卡片与容器 */
            .layui-card {
                background-color: var(--xhj-side-bg) !important;
                background-image: var(--xhj-card-gradient) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
                border-top: 1px solid rgba(255,255,255,0.1) !important;
                /* Radius moved to Polish section */
                box-shadow: var(--xhj-shadow) !important;
                backdrop-filter: blur(16px) saturate(180%);
                transition: transform 0.3s, box-shadow 0.3s !important;
            }
            /* 6. 卡片高级悬浮效果 (Glass + Lift) */
            .layui-card:hover {
                transform: translateY(-4px) scale(1.002);
                box-shadow: var(--xhj-shadow-hover), 0 0 0 1px var(--xhj-active-bg) !important;
                backdrop-filter: blur(10px) saturate(150%);
                border-color: var(--xhj-active-bg) !important;
                z-index: 10;
            }
            .layui-card-header {
                border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                color: var(--xhj-fg) !important;
                border-radius: 18px 18px 0 0 !important;
            }

            /* 按钮 (Styles partially overridden by Polish section above) */
            .layui-btn {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                /* Radius overridden */
                border: none !important;
                border-top: 1px solid rgba(255,255,255,0.2) !important;
                /* Box shadow overridden */
                background-image: var(--xhj-btn-gradient) !important;
                box-shadow: 0 4px 15px var(--xhj-glow-color), 0 1px 0 rgba(255,255,255,0.2) inset !important;
            }
            .layui-btn:hover {
                transform: translateY(-2px);
                opacity: 1;
            }
            .layui-btn-primary {
                background-color: transparent !important;
                border: 1px solid var(--xhj-border) !important;
                color: var(--xhj-fg) !important;
                box-shadow: none !important;
            }
            .layui-btn-primary:hover {
                border-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 8px var(--xhj-active-bg) !important;
            }

            /* 输入框 */
            .layui-input, .layui-select, .layui-textarea, input[type="text"] {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
                /* Radius overridden */
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.1) !important;
            }
            /* 7. 输入框聚焦动效 (Glow) */
            .layui-input:focus, .layui-select:focus, .layui-textarea:focus {
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 0 4px var(--xhj-glow-color) !important;
                background-color: var(--xhj-input-bg) !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* 8. 按钮点击涟漪效果模拟 */
            .layui-btn:active {
                transform: scale(0.96) !important;
                filter: brightness(0.9);
            }

            /* 9. 表格行悬浮高亮 */
            .layui-table tbody tr:hover {
                background-color: var(--xhj-hover-bg) !important;
                transform: scale(1); /* 修复可能的抖动 */
            }

            /* 表格 */
            .layui-table, .layui-table-view {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
                /* Radius overridden */
                border: none !important;
            }
            .layui-table-hover, .layui-table-click, .layui-table tbody tr:hover, 
            .layui-table-hover > td, .layui-table-click > td, .layui-table tbody tr:hover > td {
                background-color: rgba(98, 114, 164, 0.2) !important;
                backdrop-filter: blur(4px);
            }
            /* 表格行悬浮 3D 效果 */
            .layui-table tbody tr {
                transition: transform 0.2s, background-color 0.2s !important;
            }
            .layui-table tbody tr:hover {
                transform: scale(1.002) translateY(-1px);
                z-index: 10;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                background-color: rgba(255,255,255,0.03) !important;
            }

            .layui-table thead tr, .layui-table-header {
                background-color: var(--xhj-table-head) !important;
                color: var(--xhj-fg) !important;
            }
            .layui-table td {
                padding: 0 !important;
                border: none !important;
                border-bottom: 1px solid rgba(255,255,255,0.05) !important;
            }
            .layui-table-cell {
                font-family: 'SF Mono', 'Consolas', 'Monaco', monospace !important;
                background-color: var(--xhj-input-bg) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-radius: 4px !important;
                margin: 3px 2px !important;
                padding: 6px 8px !important;
                height: auto !important;
                white-space: nowrap !important;
                min-width: 160px !important;
                text-align: center !important;
                line-height: 24px !important;
                display: block !important;
            }

            /* 列表表头对齐修正 */
            .layui-table th .layui-table-cell {
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 8px 11px !important;
                min-width: 160px !important;
            }

            /* 列宽适配 (默认) */
            .layui-table tr td:nth-child(1) .layui-table-cell, .layui-table th:nth-child(1) .layui-table-cell { min-width: 90px !important; }
            .layui-table tr td:nth-child(3) .layui-table-cell, .layui-table th:nth-child(3) .layui-table-cell { min-width: 220px !important; }
            .layui-table tr td:nth-child(5) .layui-table-cell, .layui-table th:nth-child(5) .layui-table-cell { min-width: 260px !important; }
            .layui-table tr td:nth-child(6) .layui-table-cell, .layui-table th:nth-child(6) .layui-table-cell,
            .layui-table tr td:nth-child(7) .layui-table-cell, .layui-table th:nth-child(7) .layui-table-cell { min-width: 200px !important; }
            .layui-table tr td:nth-child(8) .layui-table-cell, .layui-table th:nth-child(8) .layui-table-cell { min-width: 70px !important; }
            
            /* 售房全景专用列宽 */
            body.xhj-table-sales .layui-table tr td:nth-child(2) .layui-table-cell, body.xhj-table-sales .layui-table th:nth-child(2) .layui-table-cell { min-width: 200px !important; }
            body.xhj-table-sales .layui-table tr td:nth-child(3) .layui-table-cell, body.xhj-table-sales .layui-table th:nth-child(3) .layui-table-cell { min-width: 140px !important; }
            
            /* 售房全景 - 缩窄特定列 (设计师/摄影师、上传人、全景状态、时间) */
            /* 第5列: 摄影师/设计师 -> 原80px，现40px */
            body.xhj-table-sales .layui-table tr td:nth-child(5) .layui-table-cell, body.xhj-table-sales .layui-table th:nth-child(5) .layui-table-cell { 
                min-width: 40px !important; width: 40px !important; 
            }
            /* 第6列: 上传人 -> 保持80px或也缩窄 */
            body.xhj-table-sales .layui-table tr td:nth-child(6) .layui-table-cell, body.xhj-table-sales .layui-table th:nth-child(6) .layui-table-cell { 
                min-width: 60px !important; width: 60px !important; 
            }
            /* 第9列: 全景状态 (如果是这一列) -> 原60px，现30px */
            body.xhj-table-sales .layui-table tr td:nth-child(9) .layui-table-cell, body.xhj-table-sales .layui-table th:nth-child(9) .layui-table-cell { 
                min-width: 30px !important; width: 30px !important; 
            }

            /* 房堪列表 - 缩窄特定列 (楼盘名称、申请人、摄影师、上传人、状态) */
            body.xhj-table-survey .layui-table tr td:nth-child(3) .layui-table-cell, body.xhj-table-survey .layui-table th:nth-child(3) .layui-table-cell { 
                min-width: 160px !important; width: 160px !important; /* 楼盘名称略宽 */
            }
            body.xhj-table-survey .layui-table tr td:nth-child(4) .layui-table-cell, body.xhj-table-survey .layui-table th:nth-child(4) .layui-table-cell,
            body.xhj-table-survey .layui-table tr td:nth-child(9) .layui-table-cell, body.xhj-table-survey .layui-table th:nth-child(9) .layui-table-cell,
            body.xhj-table-survey .layui-table tr td:nth-child(10) .layui-table-cell, body.xhj-table-survey .layui-table th:nth-child(10) .layui-table-cell { 
                min-width: 80px !important; width: 80px !important; 
            }
            body.xhj-table-survey .layui-table tr td:nth-child(12) .layui-table-cell, body.xhj-table-survey .layui-table th:nth-child(12) .layui-table-cell { 
                min-width: 90px !important; width: 90px !important; 
            }

            /* 修复双重文字框 (售房全景) - 针对图片和状态列的特殊处理 */
            body.xhj-table-sales .layui-table tr td:nth-child(7) .layui-table-cell,
            body.xhj-table-sales .layui-table tr td:nth-child(8) .layui-table-cell {
                background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important;
            }

            /* 列颜色 (Dracula/Cyberpunk 适配) */
            .layui-table tr td:nth-child(1) .layui-table-cell { color: #ff79c6 !important; box-shadow: inset 3px 0 0 #ff79c6, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(2) .layui-table-cell { color: #8be9fd !important; box-shadow: inset 3px 0 0 #8be9fd, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(3) .layui-table-cell { color: #50fa7b !important; box-shadow: inset 3px 0 0 #50fa7b, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(4) .layui-table-cell { color: #bd93f9 !important; box-shadow: inset 3px 0 0 #bd93f9, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(5) .layui-table-cell { color: #ffb86c !important; box-shadow: inset 3px 0 0 #ffb86c, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            .layui-table tr td:nth-child(6) .layui-table-cell { color: #f1fa8c !important; box-shadow: inset 3px 0 0 #f1fa8c, 0 1px 2px rgba(0,0,0,0.1) !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
            
            /* --- Element UI 适配 (Vue/房堪上传) --- */
            
            /* 基础弹窗与背景 */
            .el-dialog, .el-dialog__header, .el-dialog__body, .el-dialog__footer {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
            }
            .el-dialog__title {
                color: var(--xhj-fg) !important;
            }
            .el-dialog__close {
                color: var(--xhj-comment) !important;
            }
            .el-dialog__close:hover {
                color: var(--xhj-active-bg) !important;
            }
            
            /* 输入框与选择器 */
            .el-input__inner, .el-textarea__inner {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
            }
            .el-input__inner:focus, .el-textarea__inner:focus {
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 5px var(--xhj-glow-color) !important;
            }
            .el-input.is-disabled .el-input__inner {
                background-color: rgba(255, 255, 255, 0.05) !important;
                color: var(--xhj-comment) !important;
                border-color: var(--xhj-border) !important;
            }
            
            /* 下拉菜单 */
            .el-select-dropdown {
                background-color: var(--xhj-bg) !important;
                border: 1px solid var(--xhj-border) !important;
            }
            .el-select-dropdown__item {
                color: var(--xhj-fg) !important;
                background-color: transparent !important;
            }
            .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
                background-color: var(--xhj-selection) !important;
            }
            .el-select-dropdown__item.selected {
                color: var(--xhj-active-bg) !important;
                font-weight: bold !important;
            }
            
            /* 表单标签与单选 */
            .el-form-item__label {
                color: var(--xhj-fg) !important;
            }
            .el-radio {
                color: var(--xhj-fg) !important;
            }
            .el-radio__inner {
                background-color: transparent !important;
                border-color: var(--xhj-border) !important;
            }
            .el-radio__input.is-checked .el-radio__inner {
                border-color: var(--xhj-active-bg) !important;
                background: var(--xhj-active-bg) !important;
                box-shadow: 0 0 5px var(--xhj-glow-color);
            }
            .el-radio__label {
                color: var(--xhj-fg) !important;
            }
            
            /* 按钮 (Element UI) */
            .el-button {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border-color: var(--xhj-border) !important;
            }
            .el-button:hover, .el-button:focus {
                color: var(--xhj-active-bg) !important;
                border-color: var(--xhj-active-bg) !important;
                background-color: rgba(98, 114, 164, 0.2) !important;
            }
            .el-button--primary {
                background-color: var(--xhj-active-bg) !important;
                border-color: var(--xhj-active-bg) !important;
                color: #fff !important;
            }
            .el-button--primary:hover, .el-button--primary:focus {
                background-color: #bd93f9 !important; /* Dracula Pink/Purple lighter */
                border-color: #bd93f9 !important;
                box-shadow: 0 0 8px var(--xhj-glow-color);
            }

            /* 消除白色背景 */
            .bg-purple, .bg-purple-light, .grid-content {
                background-color: transparent !important;
            }

            /* --- 弹窗与上传适配 (重点修复) --- */
            
            /* 弹窗层 - 强制背景色 */
            .layui-layer, .layui-layer-page, .layui-layer-iframe, .layui-layer-dialog {
                background-color: var(--xhj-bg) !important;
                box-shadow: 0 20px 50px rgba(0,0,0,0.6) !important;
            }
            
            /* 弹窗标题 */
            .layui-layer-title {
                background-color: var(--xhj-header-bg) !important;
                color: var(--xhj-fg) !important;
                border-bottom: 1px solid var(--xhj-border) !important;
            }
            
            /* 弹窗内容区域 - 深度覆盖 */
            .layui-layer-content {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
            }
            
            /* 修复房堪上传等表单模态框的白色背景 - 强力覆盖 */
            .layui-layer-content .layui-form, 
            .layui-layer-content .layui-card-body,
            .layui-layer-content > div,
            .layui-layer-content iframe {
                background-color: transparent !important;
            }
            
            /* 如果是 iframe 内部，可能需要这一行 */
            body[class*="layui-layer"] { background: var(--xhj-bg) !important; }

            /* 模态框内的表单项 */
            .layui-layer .layui-form-item,
            .layui-layer .layui-input-block,
            .layui-layer .layui-inline {
                background-color: transparent !important;
            }

            /* 模态框内的标签 */
            .layui-layer .layui-form-label {
                color: var(--xhj-fg) !important;
                background-color: transparent !important;
            }

            /* 上传区域 (加号框等) */
            .layui-upload-drag, .layui-upload-list, .pic-add {
                background-color: rgba(255, 255, 255, 0.05) !important;
                border: 1px dashed var(--xhj-border) !important;
            }
            .layui-upload-drag:hover, .pic-add:hover {
                border-color: var(--xhj-active-bg) !important;
                background-color: rgba(255, 255, 255, 0.1) !important;
                box-shadow: inset 0 0 10px rgba(255,255,255,0.05);
            }
            .layui-upload-drag p, .layui-upload-drag i {
                color: var(--xhj-fg) !important;
            }

            /* 底部说明文字 */
            .layui-layer-content .layui-word-aux, 
            .layui-layer-content p, 
            .layui-layer-content span {
                color: var(--xhj-fg) !important;
            }
            
            /* 模态框按钮栏 */
            .layui-layer-btn {
                background-color: var(--xhj-header-bg) !important;
                border-top: 1px solid var(--xhj-border) !important;
                padding-top: 10px !important;
                padding-bottom: 10px !important;
            }
            .layui-layer-btn a {
                background-color: transparent !important;
                border: 1px solid var(--xhj-border) !important;
                color: var(--xhj-fg) !important;
            }
            .layui-layer-btn .layui-layer-btn0 {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 10px var(--xhj-glow-color);
            }

            /* 上传组件 (Upload Drag / Box) */
            .layui-upload-drag, .pic-add, .upload-box {
                background-color: rgba(255, 255, 255, 0.05) !important;
                border: 2px dashed var(--xhj-border) !important;
                border-radius: 8px !important;
            }
            .layui-upload-drag:hover, .pic-add:hover, .upload-box:hover {
                border-color: var(--xhj-active-bg) !important;
                background-color: rgba(255, 255, 255, 0.08) !important;
            }
            .layui-upload-drag .layui-icon, .pic-add:after {
                color: var(--xhj-active-bg) !important;
            }
            .layui-upload-drag p {
                color: var(--xhj-fg) !important;
            }
            
            /* 下拉框与选项 */
            .layui-form-select dl {
                background-color: var(--xhj-header-bg) !important;
                border-color: var(--xhj-border) !important;
            }
            .layui-form-select dl dd { color: var(--xhj-fg) !important; }
            .layui-form-select dl dd.layui-this {
                background-color: var(--xhj-active-bg) !important;
                color: #fff !important;
            }
            .layui-form-select dl dd:hover { background-color: var(--xhj-hover-bg) !important; }
            
            /* 自动同步按钮样式 (通过 ID 覆盖) */
            #auto-sync-button-v3 {
                background: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
            }
            #auto-sync-settings-v3 {
                background: var(--xhj-header-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
            }
        `;
    };

    /* ==========================================================================
       模块 2: 核心逻辑 (Theme Logic)
       ========================================================================== */

    const applyTheme = (themeName) => {
        const theme = themes[themeName] || themes['default'];
        const css = getCssTemplate(theme.vars);
        
        const oldStyle = document.getElementById(STYLE_ID);
        if (oldStyle) oldStyle.remove();

        if (!css) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
        
        // 强制给 body 加背景，防止闪烁
        const setBodyBg = () => {
             if (document.body) {
                 document.body.style.backgroundColor = theme.vars['--xhj-bg'] || '';
                 document.body.style.setProperty('background-color', theme.vars['--xhj-bg'] || '', 'important');
             }
        };
        setBodyBg();
        // 如果 DOM 还没准备好，等待加载完再设一次
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setBodyBg);
        }
    };

    const switchTheme = (themeName) => {
        localStorage.setItem(SKIN_STORAGE_KEY, themeName);
        applyTheme(themeName);
    };

    // 全局点击波纹特效逻辑
    document.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.classList.add('xhj-click-ripple');
        document.body.appendChild(ripple);
        
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });

    const createUI = () => {
        if (window.top !== window.self) return;

        const container = document.createElement('div');
        container.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: sans-serif;`;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '🎨';
        toggleBtn.style.cssText = `
            width: 56px; height: 56px; border-radius: 50%;
            background: linear-gradient(135deg, var(--xhj-active-bg), var(--xhj-glow-color));
            color: var(--xhj-active-fg); border: 2px solid rgba(255,255,255,0.5);
            font-size: 24px; cursor: pointer; box-shadow: 0 0 20px var(--xhj-glow-color);
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            z-index: 100000;
            backdrop-filter: blur(5px);
        `;
        
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: absolute; bottom: 80px; right: 0;
            background: rgba(10, 10, 20, 0.85); backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.15); border-radius: 16px;
            padding: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.05);
            display: none; width: 200px; transform-origin: bottom right;
            opacity: 0; transform: scale(0.8) translateY(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        Object.keys(themes).forEach(key => {
            const btn = document.createElement('button');
            btn.textContent = themes[key].name;
            btn.style.cssText = `
                display: block; width: 100%; padding: 12px 16px; margin-bottom: 8px;
                border: 1px solid rgba(255,255,255,0.05); background: linear-gradient(90deg, rgba(255,255,255,0.05), transparent);
                cursor: pointer; text-align: left; border-radius: 8px; color: #eee;
                transition: all 0.3s; font-size: 14px; font-weight: 500;
                position: relative; overflow: hidden;
            `;
            
            // 按钮悬停特效
            btn.onmouseenter = () => {
                btn.style.background = 'linear-gradient(90deg, var(--xhj-active-bg, #00dbde), transparent)';
                btn.style.color = '#fff';
                btn.style.transform = 'translateX(5px)';
                btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                btn.style.borderColor = 'rgba(255,255,255,0.3)';
            };
            btn.onmouseleave = () => {
                btn.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)';
                btn.style.color = '#eee';
                btn.style.transform = 'translateX(0)';
                btn.style.boxShadow = 'none';
                btn.style.borderColor = 'rgba(255,255,255,0.05)';
            };

            btn.onclick = () => { switchTheme(key); toggleMenu(false); };
            menu.appendChild(btn);
        });

        // --- 分割线 ---
        const divider = document.createElement('div');
        divider.style.cssText = 'height: 1px; background: rgba(255,255,255,0.1); margin: 8px 0;';
        menu.appendChild(divider);

        // --- 自动缩放开关 ---
        const scaleBtn = document.createElement('button');
        const updateScaleBtnText = () => {
            scaleBtn.textContent = isScaleEnabled() ? '🖥️ 关闭自动缩放' : '🖥️ 开启自动缩放';
            scaleBtn.style.background = isScaleEnabled() 
                ? 'linear-gradient(90deg, rgba(76, 175, 80, 0.2), transparent)' 
                : 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)';
        };
        updateScaleBtnText();
        scaleBtn.style.cssText = `
            display: block; width: 100%; padding: 12px 16px; margin-bottom: 8px;
            border: 1px solid rgba(255,255,255,0.05); 
            cursor: pointer; text-align: left; border-radius: 8px; color: #eee;
            transition: all 0.3s; font-size: 14px; font-weight: 500;
        `;
        scaleBtn.onclick = () => {
            toggleScale(!isScaleEnabled());
            updateScaleBtnText();
            // 不关闭菜单，方便查看效果
        };
        scaleBtn.onmouseenter = () => {
             scaleBtn.style.transform = 'translateX(5px)';
             scaleBtn.style.color = '#fff';
        };
        scaleBtn.onmouseleave = () => {
             scaleBtn.style.transform = 'translateX(0)';
             scaleBtn.style.color = '#eee';
        };
        menu.appendChild(scaleBtn);

        const toggleMenu = (show) => {
            if (show) {
                menu.style.display = 'block';
                // 强制重绘
                menu.offsetHeight;
                menu.style.opacity = '1';
                menu.style.transform = 'scale(1) translateY(0)';
            } else {
                menu.style.opacity = '0';
                menu.style.transform = 'scale(0.8) translateY(20px)';
                setTimeout(() => {
                    if (menu.style.opacity === '0') menu.style.display = 'none';
                }, 300);
            }
        };

        toggleBtn.onclick = () => {
            const isVisible = menu.style.display === 'block' && menu.style.opacity !== '0';
            toggleMenu(!isVisible);
        };
        
        // 鼠标悬停旋转特效
        toggleBtn.onmouseenter = () => {
            toggleBtn.style.transform = 'rotate(180deg) scale(1.1)';
            toggleBtn.style.boxShadow = '0 0 30px var(--xhj-glow-color)';
        };
        toggleBtn.onmouseleave = () => {
            toggleBtn.style.transform = 'rotate(0deg) scale(1)';
            toggleBtn.style.boxShadow = '0 0 20px var(--xhj-glow-color)';
        };

        container.appendChild(menu);
        container.appendChild(toggleBtn);
        document.body.appendChild(container);
    };

    /* ==========================================================================
       模块 3: 自动同步功能 (Auto Sync)
       ========================================================================== */

    const TARGET_FRAME_URLS = [
        'https://vr.xhj.com/houseadmin/house/index.html',
        'houseadmin/house/index.html' // 宽松匹配
    ];
    const BUTTON_ID = 'auto-sync-button-v3';
    const SETTINGS_BUTTON_ID = 'auto-sync-settings-v3';
    let isSyncRunning = false;

    function isInTargetFrame() {
        const frameUrl = window.location.href;
        return TARGET_FRAME_URLS.some(urlPattern => frameUrl.includes(urlPattern));
    }

    function initSyncButtons() {
        if (!isInTargetFrame()) return;
        
        // 清理旧按钮
        document.querySelectorAll(`#${BUTTON_ID}, #${SETTINGS_BUTTON_ID}`).forEach(btn => btn.remove());
        
        // 创建主按钮
        const triggerButton = document.createElement('button');
        triggerButton.id = BUTTON_ID;
        triggerButton.textContent = '开始自动同步';
        triggerButton.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 999999;
            padding: 8px 16px; border: none; border-radius: 4px;
            cursor: pointer; font-size: 14px; min-width: 140px;
            transition: all 0.3s;
            /* 默认样式，会被 CSS 变量覆盖 */
            background: #4CAF50; color: white;
        `;
        triggerButton.addEventListener('click', clickSyncButtons);
        document.body.appendChild(triggerButton);
        
        // 创建设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.id = SETTINGS_BUTTON_ID;
        settingsButton.textContent = '跳转并指定90';
        settingsButton.style.cssText = `
            position: fixed; top: 50px; right: 10px; z-index: 999999;
            padding: 8px 16px; border: none; border-radius: 4px;
            cursor: pointer; font-size: 14px; min-width: 60px;
            transition: all 0.3s;
            background: #2196F3; color: white;
        `;
        settingsButton.addEventListener('click', openSettings);
        document.body.appendChild(settingsButton);
    }

    function findSyncButtons() {
        const buttons = new Set();
        const xpath = "//*[contains(text(),'同步') or contains(@value,'同步')]";
        const elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < elements.snapshotLength; i++) {
            const element = elements.snapshotItem(i);
            if (!element.id?.startsWith('auto-sync-button') && isClickable(element) && isVisible(element)) {
                buttons.add(element);
            }
        }
        return Array.from(buttons);
    }

    function isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length) &&
            window.getComputedStyle(element).visibility !== 'hidden' &&
            window.getComputedStyle(element).display !== 'none';
    }

    function isClickable(element) {
        const clickableTags = ['A', 'BUTTON', 'INPUT', 'SELECT'];
        return clickableTags.includes(element.tagName) ||
            element.onclick != null ||
            element.getAttribute('role') === 'button' ||
            window.getComputedStyle(element).cursor === 'pointer';
    }

    function updateButtonStatus(text, isProcessing = false) {
        const button = document.getElementById(BUTTON_ID);
        if (!button) return;
        button.textContent = text;
        // 样式由 CSS 控制，这里仅更新文字
        if (isProcessing) button.style.opacity = '0.8';
        else button.style.opacity = '1';
    }

    async function clickSyncButtons(e) {
        e.preventDefault();
        if (isSyncRunning) return;
        isSyncRunning = true;

        const buttons = findSyncButtons();
        let currentCount = 0;

        if (buttons.length === 0) {
            updateButtonStatus('未找到同步按钮');
            setTimeout(() => updateButtonStatus('开始自动同步'), 2000);
            isSyncRunning = false;
            return;
        }

        for (const button of buttons) {
            try {
                await new Promise(resolve => setTimeout(resolve, 100));
                button.click();
                currentCount++;
                updateButtonStatus(`正在同步(${currentCount}/${buttons.length})`, true);
            } catch (error) {
                console.error('点击按钮时发生错误:', error);
            }
        }

        updateButtonStatus(`完成同步 ${currentCount} 个`, true);
        setTimeout(() => {
            updateButtonStatus('开始自动同步');
            isSyncRunning = false;
        }, 2000);
    }

    async function openSettings() {
        // ... (保持原有的设置逻辑) ...
        try {
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const waitForElement = async (selector, timeout = 5000) => {
                const start = Date.now();
                while (Date.now() - start < timeout) {
                    const el = document.querySelector(selector);
                    if (el) return el;
                    await delay(100);
                }
                throw new Error(`Element not found: ${selector}`);
            };

            const tabIcon = await waitForElement("body > div.admin-main.layui-anim.layui-anim-upbit > form > div > div:nth-child(2) > div > div > i");
            tabIcon.click();
            await delay(200);
            
            const orderTab = await waitForElement("body > div.admin-main.layui-anim.layui-anim-upbit > form > div > div:nth-child(2) > div > dl > dd:nth-child(5)");
            orderTab.click();
            await delay(300);
            
            const searchButton = await waitForElement("#search");
            searchButton.click();
            await delay(4000);

            const select = await waitForElement("[id^='layui-laypage'] > span > select");
            select.value = "90";
            select.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (error) {
            console.error("自动化操作失败:", error);
        }
    }

    /* ==========================================================================
       模块 4: 自动缩放功能 (Auto Scale)
       ========================================================================== */
    const AUTO_SCALE_STORAGE_KEY = 'xhj_auto_scale_enabled';
    // const DESIGN_WIDTH = 1920; // 不再使用固定设计宽度

    // 获取当前缩放状态 (默认开启: 只要不是 'false' 就算开启)
    const isScaleEnabled = () => localStorage.getItem(AUTO_SCALE_STORAGE_KEY) !== 'false';

    // 设置缩放
    const applyScale = () => {
        // v1.40: 针对全景图管理-上传页面禁用自动缩放 (解决DPI异常问题)
        // 识别策略：检查URL或标题是否包含"新增"、"上传"等关键词
        // 许多管理系统的添加页面URL通常包含 /add 或 /create
        if (window.location.href.includes('/add') || 
            window.location.href.includes('/upload') || 
            document.title.includes('新增') || 
            document.title.includes('上传')) {
            document.body.style.zoom = '';
            return;
        }

        if (!isScaleEnabled()) {
            document.body.style.zoom = '';
            return;
        }
        
        // 使用当前屏幕分辨率宽度作为基准
        const baseWidth = window.screen.width;
        // 计算缩放比例：(当前窗口宽度 / 屏幕宽度) * 1.20 (120%)
        // v1.38: 回滚最小缩放限制，调整基准比例为 120%
        const scale = (window.innerWidth / baseWidth) * 1.20;
        
        document.body.style.zoom = scale;
    };

    // 切换缩放开关
    const toggleScale = (enable) => {
        localStorage.setItem(AUTO_SCALE_STORAGE_KEY, enable);
        if (enable) {
            applyScale();
            window.addEventListener('resize', applyScale);
            showToast(`已开启自动缩放模式 (基准: 屏幕宽度 * 120%)`);
        } else {
            document.body.style.zoom = '';
            window.removeEventListener('resize', applyScale);
            showToast('已关闭自动缩放模式');
        }
    };

    // 简单的 Toast 提示
    const showToast = (msg) => {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8); color: #fff; padding: 10px 20px;
            border-radius: 20px; z-index: 9999999; font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); pointer-events: none;
            opacity: 0; transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
        // 强制重绘
        toast.offsetHeight;
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    };

    /* ==========================================================================
       初始化 (Initialization)
       ========================================================================== */

    const init = () => {
        // 1. 加载主题
        const currentTheme = localStorage.getItem(SKIN_STORAGE_KEY) || 'dracula';
        applyTheme(currentTheme);

        // 识别 iframe 并添加标识类 (用于 CSS 底部填充)
        if (window.top !== window.self) {
            document.body.classList.add('xhj-iframe-body');
        }
        
        // 注册全局点击特效事件
        document.addEventListener('click', (e) => {
            // 简单防抖或限制，避免过于频繁
            const ripple = document.createElement('div');
            ripple.className = 'xhj-click-ripple';
            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;
            document.body.appendChild(ripple);
            
            // 动画结束后移除
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // 2. 识别表格类型 & 强力去白底
        setInterval(() => {
            const headers = document.querySelectorAll('.layui-table-header th');
            if (headers.length > 0) {
                const headerTexts = Array.from(headers).map(th => th.textContent.trim());
                const body = document.body;
                
                if (headerTexts.some(t => t.includes('申请门店')) && (headerTexts.some(t => t.includes('房勘状态')) || headerTexts.some(t => t.includes('房堪状态')))) {
                    if (!body.classList.contains('xhj-table-survey')) {
                        body.classList.add('xhj-table-survey');
                        body.classList.remove('xhj-table-sales');
                    }
                } else if (headerTexts.some(t => t.includes('全景状态')) && headerTexts.some(t => t.includes('户型图'))) {
                    if (!body.classList.contains('xhj-table-sales')) {
                        body.classList.add('xhj-table-sales');
                        body.classList.remove('xhj-table-survey');
                    }
                    // 动态查找“操作”列并注入样式
                    const updateColumnWidth = (headerName, newWidth, styleIdSuffix, whiteSpace = 'normal') => {
                         const idx = headerTexts.findIndex(t => t.trim().includes(headerName));
                         if (idx !== -1) {
                             const cssIdx = idx + 1;
                             const styleId = `xhj-sales-${styleIdSuffix}-col`;
                             if (!document.getElementById(styleId)) {
                                 const style = document.createElement('style');
                                 style.id = styleId;
                                 style.textContent = `
                                     body.xhj-table-sales .layui-table tr td:nth-child(${cssIdx}) .layui-table-cell,
                                     body.xhj-table-sales .layui-table th:nth-child(${cssIdx}) .layui-table-cell {
                                         min-width: ${newWidth}px !important; width: ${newWidth}px !important;
                                         white-space: ${whiteSpace} !important;
                                         text-align: center !important;
                                     }
                                 `;
                                 document.head.appendChild(style);
                             }
                         }
                    };

                    // 1. 操作列 (原125px * 1.4 * 1.3 ≈ 228px)
                    const actionIndex = headerTexts.findIndex(t => t.trim() === '操作');
                    if (actionIndex !== -1) {
                        const cssIndex = actionIndex + 1; 
                        const styleId = 'xhj-sales-action-col';
                        if (!document.getElementById(styleId)) {
                             const style = document.createElement('style');
                             style.id = styleId;
                             style.textContent = `
                                 body.xhj-table-sales .layui-table tr td:nth-child(${cssIndex}) .layui-table-cell,
                                 body.xhj-table-sales .layui-table th:nth-child(${cssIndex}) .layui-table-cell {
                                     min-width: 228px !important; width: 228px !important;
                                     padding: 0 4px !important;
                                     text-align: center !important;
                                 }
                                 body.xhj-table-sales .layui-table tr td:nth-child(${cssIndex}) .layui-btn {
                                     padding: 0 5px !important;
                                     height: 22px !important;
                                     line-height: 22px !important;
                                     font-size: 12px !important;
                                     margin: 2px !important;
                                     min-width: unset !important;
                                 }
                                 body.xhj-table-sales .layui-table tr td:nth-child(${cssIndex}) .layui-btn i {
                                     margin-right: 0 !important;
                                     font-size: 14px !important;
                                 }
                             `;
                             document.head.appendChild(style);
                        }
                    }

                    // 2. 全景状态 (原60px * 1.4 ≈ 84px)
                    updateColumnWidth('全景状态', 84, 'status');

                    // 3. 设计师 (原40px * 2 = 80px)
                    updateColumnWidth('设计师', 80, 'designer');

                    // 4. 上传人 (原60px * 1.2 = 72px)
                    updateColumnWidth('上传人', 72, 'uploader');

                    // 5. 户型图 (原估100px * 0.8 = 80px)
                    updateColumnWidth('户型图', 80, 'floorplan');

                    // 6. 城市 (原估100px * 0.7 = 70px)
                    updateColumnWidth('城市', 70, 'city');
                    
                    // 7. 朝向 (增加宽度)
                    updateColumnWidth('朝向', 60, 'orientation');

                    // 8. 卧室 (原60px * 1.4 ≈ 84px)
                    updateColumnWidth('卧室', 84, 'bedroom');

                    // 9. 全景时间 (90px, 单行)
                    updateColumnWidth('全景时间', 90, 'pano-time', 'nowrap');

                    // 10. 同步时间 (90px, 单行)
                    updateColumnWidth('同步时间', 90, 'sync-time', 'nowrap');

                    // 11. 调整搜索和刷新按钮位置 (v1.37)
                    const inputs = document.querySelectorAll('input[placeholder*="项目名称"], input[placeholder*="项目ID"]');
                    if (inputs.length > 0) {
                        const targetInput = inputs[0];
                        // 向上找 layui-inline
                        const inputContainer = targetInput.closest('.layui-inline');
                        
                        // 检查是否已经处理过 (v1.37: 使用新的标识 xhjWrapper)
                        if (inputContainer && !inputContainer.closest('[data-xhj-wrapper="true"]')) {
                            // 查找搜索和刷新按钮 (通常在同一个 form-item 或相邻的 inline 中)
                            // 我们在整个 document 中找（或者在 inputContainer 的父级 form 中找更安全）
                            const form = inputContainer.closest('.layui-form') || document.body;
                            
                            // 搜索按钮：通常有 icon-search 或 文本包含搜索
                            const allBtns = Array.from(form.querySelectorAll('.layui-btn'));
                            const searchBtn = allBtns.find(b => b.textContent.trim().includes('搜索') || b.querySelector('.layui-icon-search'));
                            const refreshBtn = allBtns.find(b => b.textContent.trim().includes('刷新') || b.querySelector('.layui-icon-refresh'));
                            
                            // 参考按钮：待处理/全部
                            const refBtn = allBtns.find(b => b.textContent.trim() === '待处理' || b.textContent.trim() === '全部');
                            
                            if (searchBtn && refreshBtn) {
                                // v1.39 深度对齐修复：
                                // 1. 创建 wrapper 并复制原始 container 的所有类名
                                // 2. 强制 wrapper 和所有兄弟元素 vertical-align: top
                                
                                const wrapper = document.createElement('div');
                                
                                // 复制原始类名 (保留 layui-inline 等布局类)
                                wrapper.className = inputContainer.className;
                                
                                // 强制样式覆盖
                                wrapper.style.display = 'inline-block'; 
                                wrapper.style.verticalAlign = 'top'; // 关键：顶部对齐
                                wrapper.style.marginRight = '10px'; 
                                wrapper.setAttribute('data-xhj-wrapper', 'true');
                                
                                // 插入 wrapper 到 inputContainer 前面
                                inputContainer.parentNode.insertBefore(wrapper, inputContainer);

                                // 将 inputContainer 移动到 wrapper 内部
                                wrapper.appendChild(inputContainer);
                                
                                // 重置 inputContainer 样式，防止内部偏移
                                inputContainer.style.display = 'block';
                                inputContainer.style.marginBottom = '4px'; 
                                inputContainer.style.marginTop = '0'; // 防止内部下沉
                                inputContainer.style.verticalAlign = 'top';
                                inputContainer.classList.remove('layui-inline'); // 移除内部的布局类，避免双重影响

                                // 创建按钮容器
                                const btnContainer = document.createElement('div');
                                btnContainer.className = 'xhj-btn-container';
                                btnContainer.style.display = 'block'; 
                                btnContainer.style.marginTop = '0px'; 

                                // 移动按钮到新容器
                                btnContainer.appendChild(searchBtn);
                                btnContainer.appendChild(refreshBtn);
                                
                                // 确保按钮之间有间距
                                searchBtn.style.marginRight = '10px';
                                
                                wrapper.appendChild(btnContainer);
                                
                                // v1.39: 强制统一整行兄弟元素的垂直对齐
                                // 找到父容器下的所有 layui-inline 元素 (如下拉框、时间选择器)
                                const siblings = wrapper.parentNode.querySelectorAll('.layui-inline');
                                siblings.forEach(sib => {
                                    sib.style.verticalAlign = 'top';
                                });
                                
                                // 调整按钮样式 (参考 refBtn)
                                
                                // 调整按钮样式 (参考 refBtn)
                                if (refBtn) {
                                    // 获取 refBtn 的高度/padding/字体大小
                                    const computedStyle = window.getComputedStyle(refBtn);
                                    const height = computedStyle.height;
                                    const lineHeight = computedStyle.lineHeight;
                                    const padding = computedStyle.padding;
                                    const fontSize = computedStyle.fontSize;
                                    
                                    [searchBtn, refreshBtn].forEach(btn => {
                                        btn.style.setProperty('height', height, 'important');
                                        btn.style.setProperty('line-height', lineHeight, 'important');
                                        btn.style.setProperty('padding', padding, 'important');
                                        btn.style.setProperty('font-size', fontSize, 'important');
                                        
                                        // 移除可能导致大小不一致的类 (如 layui-btn-xs)
                                        btn.classList.remove('layui-btn-xs', 'layui-btn-sm', 'layui-btn-lg');
                                        // 添加与 refBtn 相同的大小类 (如果有)
                                        refBtn.classList.forEach(cls => {
                                            if (['layui-btn-xs', 'layui-btn-sm', 'layui-btn-lg'].includes(cls)) {
                                                btn.classList.add(cls);
                                            }
                                        });
                                    });
                                }
                            }
                        }
                    }
                }
            }

            // 3. VR上传状态颜色区分 (新增)
            // 扩展选择器以覆盖更多可能的元素（如按钮文本）
            const statusCells = document.querySelectorAll('.layui-table-cell, .layui-upload-list span, .status-text, td, .layui-btn, div, span');
            statusCells.forEach(cell => {
                // 仅针对包含特定状态文字的单元格，且文本长度较短（避免误伤长文本）
                // 排除 script 和 style 标签
                if (['SCRIPT', 'STYLE'].includes(cell.tagName)) return;
                
                // 仅处理直接包含文本的节点，避免父容器被错误着色
                if (cell.children.length > 0 && cell.tagName !== 'TD' && !cell.classList.contains('layui-btn')) {
                    // 如果是容器但没有直接文本，跳过 (除非是特定类名)
                     // 这里简化逻辑：只检查 textContent
                }

                const text = cell.textContent.trim();
                if (!text || text.length > 20) return; // 忽略长文本
                
                if (text === '正在上传' || text.includes('正在上传') || text.includes('上传中')) {
                    cell.style.setProperty('color', '#f1c40f', 'important'); // 橙黄色
                    cell.style.fontWeight = 'bold';
                    cell.style.textShadow = '0 0 8px rgba(241, 196, 15, 0.4)';
                } else if (text === '上传完成' || text.includes('上传完成') || text.includes('上传成功')) {
                    cell.style.setProperty('color', '#00ff9d', 'important'); // 荧光绿
                    cell.style.fontWeight = 'bold';
                    cell.style.textShadow = '0 0 8px rgba(0, 255, 157, 0.4)';
                } else if (text === '上传失败' || text.includes('上传失败')) {
                    cell.style.setProperty('color', '#ff5252', 'important'); // 红色
                    cell.style.fontWeight = 'bold';
                    cell.style.textShadow = '0 0 8px rgba(255, 82, 82, 0.4)';
                } else if (text === '等待上传' || text.includes('等待上传')) {
                    cell.style.setProperty('color', '#a0a0a0', 'important'); // 灰色
                } else if (text === '上传') {
                    // "上传" 可能是按钮，给一个醒目的蓝色
                    cell.style.setProperty('color', '#3498db', 'important'); // 蓝色
                    // 如果是按钮，可能还需要加粗
                    cell.style.fontWeight = 'bold';
                }
            });
            
            // 修复“新增房堪图”弹窗高度不足导致按钮被遮挡的问题
            const layerTitles = document.querySelectorAll('.layui-layer-title');
            layerTitles.forEach(title => {
                if (title.textContent.trim().includes('新增房堪图') || title.textContent.trim().includes('房堪上传')) {
                    const layer = title.closest('.layui-layer');
                    if (layer && !layer.dataset.xhjResized) {
                        const increase = 60; // 增加 60px 高度 (大幅减少，防止底部留黑)
                        const increaseWidth = 100; // 增加 100px 宽度

                        // 1. 调整外层高度
                        if (layer.style.height) {
                            const h = parseInt(layer.style.height);
                            layer.style.height = (h + increase) + 'px';
                        }
                        
                        // 2. 调整 Top (保持居中)
                        if (layer.style.top) {
                            const t = parseInt(layer.style.top);
                            // 简单的居中调整，防止溢出顶部
                            let newTop = t - increase / 2;
                            if (newTop < 5) newTop = 5;
                            layer.style.top = newTop + 'px';
                        }

                        // 3. 调整宽度 (防止左右贴边)
                        if (layer.style.width) {
                             const w = parseInt(layer.style.width);
                             layer.style.width = (w + increaseWidth) + 'px';
                             if (layer.style.left) {
                                 const l = parseInt(layer.style.left);
                                 layer.style.left = (l - increaseWidth / 2) + 'px';
                             }
                        }

                        // 4. 调整 content 区域
                        const content = layer.querySelector('.layui-layer-content');
                        if (content) {
                             if (content.style.height) {
                                const ch = parseInt(content.style.height);
                                content.style.height = (ch + increase) + 'px';
                             }
                        }

                        // 5. 调整 iframe 高度
                        const iframe = layer.querySelector('iframe');
                        if (iframe) {
                            if (iframe.style.height) {
                                const ih = parseInt(iframe.style.height);
                                iframe.style.height = (ih + increase) + 'px';
                            }
                        }

                        layer.dataset.xhjResized = 'true';
                    }
                }
            });
            
            // 强力去白底 (针对 iframe 或 动态加载的模态框内容)
            const whiteElements = document.querySelectorAll('.layui-bg-white, [style*="background-color: white"], [style*="background-color: #fff"], [style*="background-color: rgb(255, 255, 255)"]');
            whiteElements.forEach(el => {
                 // 排除某些可能需要保留的元素，但模态框内容一般都要去白
                 if (el.closest('.layui-layer-content')) {
                     el.style.setProperty('background-color', 'transparent', 'important');
                 }
            });
            
            // 确保 iframe 内部也应用透明背景
             const iframes = document.querySelectorAll('iframe');
             iframes.forEach(iframe => {
                 try {
                     const doc = iframe.contentDocument || iframe.contentWindow.document;
                     if (doc && doc.body) {
                          doc.body.style.backgroundColor = 'var(--xhj-bg)';
                          // 递归去白
                          const innerWhite = doc.querySelectorAll('.layui-bg-white, .admin-main, .layui-fluid');
                          innerWhite.forEach(el => el.style.setProperty('background-color', 'transparent', 'important'));
                     }
                 } catch(e) {
                     // 跨域无法操作，忽略
                 }
             });
             
             // 如果当前是 iframe 环境，强制自身背景
             if (window.top !== window.self) {
                 if (document.body) {
                      document.body.style.backgroundColor = 'var(--xhj-bg)';
                      document.body.style.setProperty('background-color', 'var(--xhj-bg)', 'important');
                 }
                 // 针对可能的容器 div
                 const containers = document.querySelectorAll('.layui-fluid, .admin-main, #app');
                 containers.forEach(c => c.style.setProperty('background-color', 'transparent', 'important'));
             }
             
         }, 500);

        // 3. 监听跨窗口同步
        window.addEventListener('storage', (e) => {
            if (e.key === SKIN_STORAGE_KEY) applyTheme(e.newValue);
        });

        // 4. 自动缩放初始化
        if (isScaleEnabled()) {
            applyScale();
            window.addEventListener('resize', applyScale);
        }

        // 5. 初始化 UI 和 自动同步按钮
        const initDOM = () => {
            createUI();
            initSyncButtons();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDOM);
        } else {
            initDOM();
        }
    };

    init();

})();
