// ==UserScript==
// @name         象视平台助手（563997）
// @namespace    http://tampermonkey.net/
// @version      5.0.4
// @description  象视平台综合辅助工具：包含多款皮肤切换（MacOS Light/Dracula/Midnight/Synthwave/Bauhaus等）、UI 深度美化 (Pro级配色/3D立体视效)、iframe 样式同步、以及自动化同步操作功能。v5.0.4: 三脚本分名同码发布，统一 Git 同步并保持各页面独立名称。
// @author       Jhih he
// @homepageURL  https://github.com/jhihhe/XHJ-VR-assistant
// @supportURL   https://github.com/jhihhe/XHJ-VR-assistant/issues
// @license      MIT
// @match        https://vr.xhj.com/houseadmin/*
// @match        *://vr.xhj.com/*
// @match        *://*.xhj.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /* ==========================================================================
       模块 1: 皮肤与 UI 优化 (Skin & UI)
       ========================================================================== */

    const SKIN_STORAGE_KEY = 'xhj_skin_theme';
    const STYLE_ID = 'xhj-custom-skin-style';
    const ENABLE_CLICK_RIPPLE = false;

    const parseColorChannels = (value, fallback = '22, 27, 34') => {
        if (typeof value !== 'string') return fallback;
        const color = value.trim();
        const hexMatch = color.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
        if (hexMatch) {
            const hex = hexMatch[1].length === 3
                ? hexMatch[1].split('').map(c => c + c).join('')
                : hexMatch[1];
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `${r}, ${g}, ${b}`;
        }
        const rgbMatch = color.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
        if (rgbMatch) {
            return `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
        }
        return fallback;
    };

    // 定义主题配置
    const themes = {
        'bauhaus': {
            name: 'Bauhaus (Geometric)',
            vars: {
                '--xhj-bg': '#f0f0f0',
                '--xhj-fg': '#121212',
                '--xhj-header-bg': '#E31C25',
                '--xhj-side-bg': '#ffffff',
                '--xhj-active-bg': '#1C4DE3',
                '--xhj-active-fg': '#ffffff',
                '--xhj-border': '#121212',
                '--xhj-hover-bg': '#F2C511',
                '--xhj-input-bg': '#ffffff',
                '--xhj-table-head': '#e0e0e0',
                '--xhj-glow-color': 'rgba(227, 28, 37, 0.4)',
                '--xhj-shadow-color': 'rgba(0, 0, 0, 0.2)'
            }
        },
        'default': {
            name: '默认 (Default)',
            vars: {} // 空对象表示移除样式
        },
        'star-wars-hud': {
            name: 'Star Wars HUD (Immersive)',
            vars: {
                '--xhj-bg': '#02060d',
                '--xhj-fg': '#b7e8ff',
                '--xhj-header-bg': '#081320',
                '--xhj-side-bg': '#040b16',
                '--xhj-active-bg': '#52d8ff',
                '--xhj-active-fg': '#02121b',
                '--xhj-border': '#1c4962',
                '--xhj-hover-bg': 'rgba(82, 216, 255, 0.16)',
                '--xhj-input-bg': '#07111d',
                '--xhj-table-head': '#0a1b2d',
                '--xhj-glow-color': 'rgba(82, 216, 255, 0.55)',
                '--xhj-shadow-color': 'rgba(3, 10, 20, 0.85)'
            }
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

    // [v2.2 优化] 立即注入关键 CSS，防止闪烁 (Anti-Flash)
    const injectCriticalCSS = () => {
        try {
            const savedTheme = localStorage.getItem(SKIN_STORAGE_KEY) || 'dracula';
            if (savedTheme === 'default') return;

            const theme = themes[savedTheme];
            if (theme && theme.vars && theme.vars['--xhj-bg']) {
                const style = document.createElement('style');
                style.id = 'xhj-critical-style';
                style.innerHTML = `
                    html, body {
                        background-color: ${theme.vars['--xhj-bg']} !important;
                        color: ${theme.vars['--xhj-fg']} !important;
                        transition: none !important; /* 禁用过渡，防止颜色缓慢变化 */
                    }
                    /* 预先隐藏可能的白色背景元素 */
                    .layui-bg-white, [style*="background-color: white"], [style*="background-color: #fff"] {
                        background-color: transparent !important;
                    }
                `;
                (document.head || document.documentElement).appendChild(style);
            }
        } catch (e) { console.error('Critical CSS injection failed:', e); }
    };
    injectCriticalCSS();

    // 通用 CSS 模板 (Layui 覆盖)
    const getCssTemplate = (vars) => {
        if (Object.keys(vars).length === 0) return '';

        const varDeclarations = Object.entries(vars)
            .map(([k, v]) => `${k}: ${v};`)
            .join('\n');
        const headerBgRgb = parseColorChannels(vars['--xhj-header-bg'] || vars['--xhj-bg'], '22, 27, 34');
        const activeBgRgb = parseColorChannels(vars['--xhj-active-bg'], '189, 147, 249');
        const shadowColor = vars['--xhj-shadow-color'] || 'rgba(0, 0, 0, 0.3)';
        const commentColor = vars['--xhj-comment'] || 'rgba(185, 210, 230, 0.72)';
        const selectionColor = vars['--xhj-selection'] || `rgba(${activeBgRgb}, 0.25)`;
            
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
        
        // Bauhaus 专属几何背景
        if (vars['--xhj-bg'] === '#f0f0f0') {
            extraCss += `
                body::before {
                    content: "";
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: 
                        radial-gradient(circle at 10% 20%, rgba(227, 28, 37, 0.05) 0%, transparent 20%),
                        radial-gradient(circle at 90% 80%, rgba(28, 77, 227, 0.05) 0%, transparent 20%),
                        linear-gradient(45deg, rgba(18, 18, 18, 0.02) 25%, transparent 25%, transparent 75%, rgba(18, 18, 18, 0.02) 75%, rgba(18, 18, 18, 0.02)),
                        linear-gradient(45deg, rgba(18, 18, 18, 0.02) 25%, transparent 25%, transparent 75%, rgba(18, 18, 18, 0.02) 75%, rgba(18, 18, 18, 0.02));
                    background-position: 0 0, 0 0, 0 0, 10px 10px;
                    background-size: 100% 100%, 100% 100%, 20px 20px, 20px 20px;
                    z-index: -1;
                    pointer-events: none;
                }
                
                /* Bauhaus 强风格化元素 */
                .layui-card, .layui-btn, .layui-input {
                    border-radius: 0 !important; /* 锐利直角 */
                }
                .layui-btn {
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 700;
                }
                .layui-nav-tree .layui-nav-item a {
                     color: #121212 !important;
                }
                .layui-nav-tree .layui-nav-item a:hover {
                    background-color: #F2C511 !important; /* 黄色高亮 */
                    color: #121212 !important;
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
        
        // 登录页专属样式 (Login Page)
        extraCss += `
            /* 1. 覆盖 body 背景 */
            body.beg-login-bg {
                background-color: var(--xhj-bg) !important;
                background-image: none !important;
            }
            
            /* 2. 处理原有背景容器 */
            #large-header {
                background: transparent !important;
                background-image: none !important;
            }
            #demo-canvas {
                opacity: 0.15 !important; /* 降低原有粒子动画透明度，避免干扰主题色 */
                mix-blend-mode: overlay; /* 尝试混合模式 */
            }

            /* 3. 登录框美化 */
            .beg-login-box {
                background-color: var(--xhj-side-bg) !important;
                border: 1px solid var(--xhj-border) !important;
                box-shadow: 0 10px 40px var(--xhj-shadow-color) !important;
                border-radius: 16px !important;
                color: var(--xhj-fg) !important;
            }

            /* 4. 登录框内部元素 */
            .beg-login-box header {
                color: var(--xhj-fg) !important;
                border-bottom: 1px solid var(--xhj-border) !important;
            }
            .beg-login-box .layui-form-item label.layui-icon {
                color: var(--xhj-fg) !important; /* 图标颜色 */
                opacity: 0.7;
            }
            .beg-login-box input[type="text"], 
            .beg-login-box input[type="password"] {
                background-color: var(--xhj-input-bg) !important;
                border: 1px solid var(--xhj-border) !important;
                color: var(--xhj-fg) !important;
                border-radius: 8px !important;
                transition: all 0.3s;
            }
            .beg-login-box input:focus {
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 0 2px var(--xhj-glow-color) !important;
            }
            
            /* 5. 登录按钮 */
            .beg-login-box .layui-btn-primary {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                border: none !important;
                border-radius: 8px !important;
                font-weight: 600;
                transition: box-shadow 0.2s ease, filter 0.2s ease;
                height: 40px;
                line-height: 40px;
            }
            .beg-login-box .layui-btn-primary:hover {
                box-shadow: 0 5px 15px var(--xhj-glow-color) !important;
                filter: brightness(1.1);
            }
            
            /* 6. 底部文字 */
            .beg-login-footer p {
                color: var(--xhj-fg) !important;
                opacity: 0.6;
            }
        `;

        return `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
            ${extraCss}
            :root {
                ${varDeclarations}
                --xhj-header-bg-rgb: ${headerBgRgb};
                --xhj-active-bg-rgb: ${activeBgRgb};
                --xhj-comment: ${commentColor};
                --xhj-selection: ${selectionColor};
                --xhj-shadow-color: ${shadowColor};
                --xhj-shadow: 0 10px 30px -10px var(--xhj-shadow-color);
                --xhj-shadow-hover: 0 20px 40px -12px var(--xhj-shadow-color);
                --xhj-radius: 8px;
                --xhj-btn-gradient: linear-gradient(180deg, rgba(255,255,255,0.15), rgba(0,0,0,0));
                --xhj-card-gradient: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.02));
                --xhj-sidebar-bg: rgba(33, 34, 44, 0.95);
                --xhj-glow: 0 0 15px var(--xhj-glow-color, rgba(189, 147, 249, 0.4));
                --xhj-glass-border: 1px solid rgba(255, 255, 255, 0.1);
                --xhj-hud-line: rgba(var(--xhj-active-bg-rgb), 0.45);
                --xhj-hud-core: rgba(var(--xhj-active-bg-rgb), 0.18);
                --xhj-hud-dim: rgba(var(--xhj-active-bg-rgb), 0.08);
                --xhj-surface-strong: linear-gradient(155deg, rgba(var(--xhj-header-bg-rgb), 0.94), rgba(var(--xhj-header-bg-rgb), 0.78));
                --xhj-surface-soft: linear-gradient(155deg, rgba(var(--xhj-header-bg-rgb), 0.9), rgba(var(--xhj-header-bg-rgb), 0.72));
                --xhj-unified-radius: 12px;
                --xhj-display-scanline: rgba(var(--xhj-active-bg-rgb), 0.055);
                --xhj-display-grid: rgba(var(--xhj-active-bg-rgb), 0.045);
                --xhj-display-glint: rgba(var(--xhj-active-bg-rgb), 0.24);
                --xhj-text-main: #9fe7ff;
                --xhj-text-soft: #6fc9e6;
                --xhj-text-glow: rgba(var(--xhj-active-bg-rgb), 0.42);
                --xhj-text-stroke: rgba(var(--xhj-active-bg-rgb), 0.2);
                --xhj-text-ghost-cyan: rgba(90, 255, 255, 0.22);
                --xhj-text-ghost-magenta: rgba(205, 120, 255, 0.16);
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

            @keyframes xhj-hud-sweep {
                0% { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
                30% { opacity: 0.3; }
                100% { transform: translateX(120vw) skewX(-20deg); opacity: 0; }
            }

            @keyframes xhj-hud-flicker {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.96; }
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
                background: var(--xhj-surface-strong) !important;
                border-bottom: 1px solid rgba(var(--xhj-active-bg-rgb), 0.24) !important;
                box-shadow: 0 8px 18px rgba(0,0,0,0.28) !important;
                position: relative;
                overflow: hidden;
            }
            .layui-header::after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, var(--xhj-display-glint), transparent);
                pointer-events: none;
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
                animation: none !important;
                background-image:
                    linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 18%),
                    repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 2px, var(--xhj-display-scanline) 2px 3px),
                    repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 28px, var(--xhj-display-grid) 28px 29px),
                    linear-gradient(180deg, rgba(var(--xhj-active-bg-rgb), 0.04), transparent 34%);
            }

            html::before, html::after {
                content: none !important;
            }

            body > * {
                position: relative;
                z-index: 1;
            }
            .layui-card-header, .layui-layer-title, .layui-form-label, .el-form-item__label, .el-dialog__title, .topbox_item {
                color: var(--xhj-text-main) !important;
                letter-spacing: 0.1em;
                text-shadow: 0 0 1px rgba(0,0,0,0.9), 0 0 10px var(--xhj-text-glow), -0.4px 0 0 var(--xhj-text-ghost-cyan), 0.4px 0 0 var(--xhj-text-ghost-magenta);
                -webkit-text-stroke: 0.32px var(--xhj-text-stroke);
                font-weight: 650;
                font-family: 'SF Pro Text', 'DIN Alternate', 'Helvetica Neue', -apple-system, sans-serif !important;
                text-rendering: geometricPrecision;
            }
            .layui-nav-tree .layui-nav-item a, .layui-tab-title li, .layui-laypage a, .layui-laypage span {
                color: var(--xhj-text-soft) !important;
                letter-spacing: 0.08em;
                text-shadow: 0 0 7px rgba(var(--xhj-active-bg-rgb), 0.24), -0.35px 0 0 rgba(90, 255, 255, 0.14);
                -webkit-text-stroke: 0.24px rgba(var(--xhj-active-bg-rgb), 0.2);
                font-family: 'SF Pro Text', 'DIN Alternate', 'Helvetica Neue', -apple-system, sans-serif !important;
            }
            .layui-input, .layui-select, .layui-textarea, .el-input__inner, .el-textarea__inner, .layui-table-cell, input[type="text"], input[type="password"], input[type="number"] {
                color: var(--xhj-text-main) !important;
                text-shadow: 0 0 6px rgba(var(--xhj-active-bg-rgb), 0.18), 0 0 1px rgba(0,0,0,0.8);
                -webkit-text-stroke: 0.22px rgba(var(--xhj-active-bg-rgb), 0.15);
            }
            .layui-input::placeholder, .layui-textarea::placeholder, .el-input__inner::placeholder, .el-textarea__inner::placeholder, input::placeholder {
                color: rgba(111, 201, 230, 0.62) !important;
                letter-spacing: 0.05em;
                text-shadow: none;
                -webkit-text-stroke: 0;
            }
            .layui-btn, .el-button, .layui-layer-btn a {
                font-weight: 700 !important;
                letter-spacing: 0.1em;
                text-shadow: 0 0 12px rgba(var(--xhj-active-bg-rgb), 0.3), -0.35px 0 0 rgba(90, 255, 255, 0.14), 0 0 1px rgba(0,0,0,0.95);
                -webkit-text-stroke: 0.28px rgba(var(--xhj-active-bg-rgb), 0.2);
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
                background: var(--xhj-surface-strong) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid rgba(var(--xhj-active-bg-rgb), 0.26) !important;
                box-shadow: 
                    0 16px 30px -14px rgba(0,0,0,0.65),
                    0 0 0 1px rgba(255,255,255,0.08) inset !important;
                border-radius: var(--xhj-unified-radius) !important;
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
                transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
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
                transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
            }
            .el-upload--picture-card:hover, .picture-add:hover, .avatar-uploader .el-upload:hover {
                border-color: var(--xhj-active-bg) !important;
                box-shadow: inset 0 0 20px var(--xhj-glow-color) !important;
                transform: none !important;
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
                box-shadow: 
                    0 6px 20px -4px var(--xhj-active-bg),
                    0 1px 0 rgba(255,255,255,0.2) inset !important;
            }
            .el-button--primary:active {
                box-shadow: inset 0 3px 5px rgba(0,0,0,0.3) !important;
            }

            /* 7.2 自定义布局组件 (from app.css) */
            .topbox {
                background-color: var(--xhj-side-bg) !important;
                border: 1px solid var(--xhj-border) !important;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.05) !important;
                border-radius: 30px !important;
            }
            .topbox_item { color: var(--xhj-fg) !important; transition: color 0.2s ease, background-color 0.2s ease !important; }
            
            .isAction {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                box-shadow: 0 2px 10px var(--xhj-glow-color) !important;
                background-image: var(--xhj-btn-gradient) !important;
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
                display: none !important;
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
                background-image:
                    linear-gradient(0deg, transparent calc(100% - 1px), rgba(var(--xhj-active-bg-rgb), 0.16) calc(100% - 1px)),
                    linear-gradient(90deg, rgba(var(--xhj-active-bg-rgb), 0.04) 1px, transparent 1px);
                background-size: 100% 100%, 22px 100%;
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
                transition: color 0.14s ease, background-color 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease, opacity 0.14s ease !important;
            }

            /* 侧边栏 macOS 风格 */
            .layui-side, .layui-side-scroll, .layui-bg-black {
                background: var(--xhj-surface-soft) !important;
                border-right: 1px solid rgba(var(--xhj-active-bg-rgb), 0.2) !important;
                box-shadow: 4px 0 12px rgba(0,0,0,0.18);
            }
            .layui-nav-tree .layui-nav-item a {
                color: var(--xhj-fg) !important;
                /* margin & radius moved to Polish section */
                width: auto !important;
            }
            .layui-nav-tree .layui-nav-item a:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
                transform: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
                transform: none !important;
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
                border-color: rgba(var(--xhj-active-bg-rgb), 0.14) !important;
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
                background: var(--xhj-surface-soft) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid rgba(var(--xhj-active-bg-rgb), 0.22) !important;
                /* Radius moved to Polish section */
                box-shadow: 0 8px 18px rgba(0,0,0,0.24) !important;
                transition: transform 0.3s, box-shadow 0.3s !important;
                overflow: hidden;
            }
            .layui-card::before {
                content: "";
                position: absolute;
                inset: 0;
                background:
                    linear-gradient(90deg, transparent calc(100% - 18px), var(--xhj-display-grid) calc(100% - 18px), var(--xhj-display-grid) calc(100% - 17px), transparent calc(100% - 17px)),
                    linear-gradient(0deg, transparent calc(100% - 18px), var(--xhj-display-grid) calc(100% - 18px), var(--xhj-display-grid) calc(100% - 17px), transparent calc(100% - 17px));
                pointer-events: none;
            }
            .layui-card::after {
                content: "";
                position: absolute;
                inset: 0;
                border: 1px solid var(--xhj-hud-dim);
                border-radius: inherit;
                pointer-events: none;
            }
            /* 6. 卡片高级悬浮效果 (Glass + Lift) */
            .layui-card:hover {
                transform: translateY(-1px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.26), 0 0 0 1px rgba(var(--xhj-active-bg-rgb), 0.2) !important;
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
                letter-spacing: 0.08em;
                text-transform: uppercase;
            }
            .layui-btn:hover {
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
                border-image: linear-gradient(90deg, var(--xhj-hud-line), transparent) 1 !important;
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
                filter: brightness(0.9);
            }

            .layui-btn, .layui-btn *, .el-button, .el-button *, .layui-layer-btn a, .layui-layer-btn a *, button, button *, [role="button"], [role="button"] * {
                cursor: pointer !important;
            }

            .el-upload--picture-card, .picture-add, .avatar-uploader .el-upload,
            .el-upload--picture-card *, .picture-add *, .avatar-uploader .el-upload * {
                cursor: pointer !important;
            }

            .layui-btn::before, .layui-btn::after,
            .el-button::before, .el-button::after,
            .layui-layer-btn a::before, .layui-layer-btn a::after,
            button::before, button::after {
                pointer-events: none !important;
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
            }
            /* 表格行悬浮 3D 效果 */
            .layui-table tbody tr {
                transition: transform 0.2s, background-color 0.2s !important;
            }
            .layui-table tbody tr:hover {
                transform: none;
                z-index: 10;
                box-shadow: 0 2px 8px rgba(0,0,0,0.14);
                background-color: rgba(255,255,255,0.03) !important;
            }

            .layui-table thead tr, .layui-table-header {
                background-color: var(--xhj-table-head) !important;
                color: var(--xhj-fg) !important;
                box-shadow: inset 0 -1px 0 var(--xhj-hud-line);
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
                font-variant-numeric: tabular-nums;
                letter-spacing: 0.04em;
                text-shadow: 0 0 7px rgba(var(--xhj-active-bg-rgb), 0.22), -0.25px 0 0 rgba(90, 255, 255, 0.14), 0 0 1px rgba(0,0,0,0.9);
                -webkit-text-stroke: 0.2px rgba(var(--xhj-active-bg-rgb), 0.16);
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
            
            /* 弹窗层 - 强制背景色 (Glassmorphism Upgrade) */
            .layui-layer, .layui-layer-page, .layui-layer-iframe, .layui-layer-dialog {
                background: var(--xhj-surface-strong) !important;
                box-shadow: 0 14px 28px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.08) inset !important;
                border-radius: var(--xhj-unified-radius) !important;
                border: 1px solid rgba(var(--xhj-active-bg-rgb), 0.26) !important;
                position: relative;
                overflow: hidden;
            }
            .layui-layer::after, .layui-layer-page::after, .layui-layer-iframe::after, .layui-layer-dialog::after {
                content: "";
                position: absolute;
                inset: 0;
                background:
                    linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0) 28%),
                    repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 2px, rgba(var(--xhj-active-bg-rgb), 0.035) 2px 3px),
                    linear-gradient(90deg, rgba(var(--xhj-active-bg-rgb), 0.08), rgba(0,0,0,0) 36%);
                opacity: 0.32;
                pointer-events: none;
            }

            /* --- 消息提示 (Toast) 专项美化 (MacOS Capsule Style) --- */
            .layui-layer-msg {
                border-radius: 14px !important;
                background: linear-gradient(160deg, rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.96), rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.72)) !important;
                box-shadow: 0 16px 36px rgba(0,0,0,0.42), inset 0 0 0 1px rgba(255,255,255,0.08) !important;
                border: 1px solid rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.45) !important;
                min-width: 190px !important;
                overflow: hidden !important;
            }
            .layui-layer-msg::before {
                content: "";
                position: absolute;
                inset: 0 auto auto 0;
                width: 100%;
                height: 1px;
                background: linear-gradient(90deg, rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0), rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.8), rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0));
                pointer-events: none;
            }
            .layui-layer-msg .layui-layer-content {
                padding: 13px 18px !important;
                color: var(--xhj-fg) !important;
                font-family: 'Inter', 'SF Pro Text', sans-serif !important;
                font-size: 15px !important;
                font-weight: 600 !important;
                letter-spacing: 0.08em;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 10px;
                text-shadow: 0 0 12px rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.32);
            }
            .layui-layer-msg .layui-layer-content.layui-layer-padding {
                padding-left: 18px !important;
            }
            .layui-layer-msg .layui-layer-ico {
                position: relative !important;
                top: auto !important;
                left: auto !important;
                margin: 0 !important;
                width: 22px !important;
                height: 22px !important;
                min-width: 22px;
                border-radius: 50%;
                border: 1px solid rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.65);
                background: rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.16) !important;
                background-image: none !important;
                color: #9fe8ff;
                box-shadow: 0 0 14px rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.42), inset 0 0 10px rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.18);
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            .layui-layer-msg .layui-layer-ico::before {
                content: "✓";
                font-size: 14px;
                font-weight: 800;
                line-height: 1;
            }
            .layui-layer-msg .layui-layer-ico0::before { content: "i"; }
            .layui-layer-msg .layui-layer-ico2::before { content: "!"; }
            .layui-layer-msg .layui-layer-ico3::before { content: "×"; }
            
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
            #xhj-theme-dock .xhj-theme-option,
            #xhj-theme-dock .xhj-scale-option,
            #auto-sync-button-v3,
            #auto-sync-settings-v3 {
                font-family: 'Inter', 'SF Pro Text', sans-serif !important;
                letter-spacing: 0.04em;
            }

            /* --- [v2.7.5] 性能优化：针对特定窗口禁用高消耗特效 --- */
            .xhj-perf-optimized,
            .xhj-perf-optimized .layui-layer-content,
            .xhj-perf-optimized iframe {
                /* 禁用背景模糊，这是掉帧的主要元凶 */
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                /* 简化阴影 */
                box-shadow: 0 5px 15px rgba(0,0,0,0.5) !important;
                /* 禁用 3D 变换和过渡，减少重排重绘 */
                transform: none !important;
                transition: none !important;
                /* 硬件加速滚动 */
                will-change: scroll-position;
            }
            /* 禁用容器内元素的悬浮特效 */
            .xhj-perf-optimized .layui-card:hover,
            .xhj-perf-optimized .upimg:hover,
            .xhj-perf-optimized .imgstyle:hover {
                transform: none !important;
                box-shadow: none !important;
                backdrop-filter: none !important;
            }
            /* 针对大量图片的列表，启用硬件加速 */
            .xhj-perf-optimized .upimg,
            .xhj-perf-optimized .imgstyle {
                will-change: transform;
                backface-visibility: hidden;
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
        if (!ENABLE_CLICK_RIPPLE) return;
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
        container.id = 'xhj-theme-dock';
        container.style.cssText = `position: fixed; bottom: 24px; right: 24px; z-index: 99999; font-family: 'Inter', sans-serif;`;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '◉';
        toggleBtn.style.cssText = `
            width: 60px; height: 60px; border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 45%), linear-gradient(145deg, rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.92), rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.42));
            color: var(--xhj-active-fg); border: 1px solid rgba(255,255,255,0.35);
            font-size: 22px; cursor: pointer; box-shadow: 0 0 28px var(--xhj-glow-color), inset 0 0 20px rgba(255,255,255,0.12);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            z-index: 100000;
        `;
        
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: absolute; bottom: 80px; right: 0;
            background: linear-gradient(160deg, rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.94), rgba(5, 12, 22, 0.9));
            border: 1px solid rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.38); border-radius: 14px;
            padding: 12px; box-shadow: 0 18px 45px rgba(0,0,0,0.68), inset 0 0 0 1px rgba(255,255,255,0.08);
            display: none; width: 240px; transform-origin: bottom right;
            opacity: 0; transform: scale(0.86) translateY(22px);
            transition: opacity 0.2s ease, transform 0.2s ease;
        `;

        Object.keys(themes).forEach(key => {
            const btn = document.createElement('button');
            btn.className = 'xhj-theme-option';
            btn.textContent = themes[key].name;
            btn.style.cssText = `
                display: block; width: 100%; padding: 10px 14px; margin-bottom: 8px;
                border: 1px solid rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.25);
                background: linear-gradient(90deg, rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.12), transparent);
                cursor: pointer; text-align: left; border-radius: 10px; color: #d4f0ff;
                transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease; font-size: 14px; font-weight: 500;
                position: relative; overflow: hidden;
            `;
            
            // 按钮悬停特效
            btn.onmouseenter = () => {
                btn.style.background = 'linear-gradient(90deg, rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.36), rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.12))';
                btn.style.color = '#fff';
                btn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.12) inset';
                btn.style.borderColor = 'rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.58)';
            };
            btn.onmouseleave = () => {
                btn.style.background = 'linear-gradient(90deg, rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.12), transparent)';
                btn.style.color = '#d4f0ff';
                btn.style.boxShadow = 'none';
                btn.style.borderColor = 'rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.25)';
            };

            btn.onclick = () => { switchTheme(key); toggleMenu(false); };
            menu.appendChild(btn);
        });

        // --- 分割线 ---
        const divider = document.createElement('div');
        divider.style.cssText = 'height: 1px; background: linear-gradient(90deg, rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.05), rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.5), rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.05)); margin: 10px 0;';
        menu.appendChild(divider);

        // --- 自动缩放开关 ---
        const scaleBtn = document.createElement('button');
        scaleBtn.className = 'xhj-scale-option';
        const updateScaleBtnText = () => {
            scaleBtn.textContent = isScaleEnabled() ? '关闭自动缩放' : '开启自动缩放';
            scaleBtn.style.background = isScaleEnabled() 
                ? 'linear-gradient(90deg, rgba(66, 239, 175, 0.24), rgba(66, 239, 175, 0.1))' 
                : 'linear-gradient(90deg, rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.1), transparent)';
        };
        updateScaleBtnText();
        scaleBtn.style.cssText = `
            display: block; width: 100%; padding: 10px 14px; margin-bottom: 6px;
            border: 1px solid rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.25); 
            cursor: pointer; text-align: left; border-radius: 10px; color: #d4f0ff;
            transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease; font-size: 14px; font-weight: 500;
        `;
        scaleBtn.onclick = () => {
            toggleScale(!isScaleEnabled());
            updateScaleBtnText();
            // 不关闭菜单，方便查看效果
        };
        scaleBtn.onmouseenter = () => {
             scaleBtn.style.color = '#fff';
             scaleBtn.style.borderColor = 'rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.58)';
        };
        scaleBtn.onmouseleave = () => {
             scaleBtn.style.color = '#d4f0ff';
             scaleBtn.style.borderColor = 'rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.25)';
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
            toggleBtn.style.boxShadow = '0 0 36px var(--xhj-glow-color), inset 0 0 24px rgba(255,255,255,0.2)';
        };
        toggleBtn.onmouseleave = () => {
            toggleBtn.style.transform = 'rotate(0deg) scale(1)';
            toggleBtn.style.boxShadow = '0 0 28px var(--xhj-glow-color), inset 0 0 18px rgba(255,255,255,0.12)';
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
            padding: 10px 18px; border: 1px solid rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.42); border-radius: 10px;
            cursor: pointer; font-size: 13px; min-width: 146px;
            transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
            background: linear-gradient(135deg, rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.76), rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.3));
            color: var(--xhj-active-fg, #fff);
            box-shadow: 0 8px 18px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.12);
            letter-spacing: 0.08em;
            text-transform: uppercase;
        `;
        triggerButton.addEventListener('click', clickSyncButtons);
        document.body.appendChild(triggerButton);
        
        // 创建设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.id = SETTINGS_BUTTON_ID;
        settingsButton.textContent = '跳转并指定90';
        settingsButton.style.cssText = `
            position: fixed; top: 50px; right: 10px; z-index: 999999;
            padding: 10px 16px; border: 1px solid rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.34); border-radius: 10px;
            cursor: pointer; font-size: 13px; min-width: 92px;
            transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
            background: linear-gradient(135deg, rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.95), rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.68));
            color: var(--xhj-fg, #fff);
            box-shadow: 0 6px 14px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.08);
            letter-spacing: 0.06em;
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
            background: linear-gradient(140deg, rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.96), rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.72));
            color: var(--xhj-fg, #fff); padding: 12px 22px;
            border: 1px solid rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.48);
            border-radius: 999px; z-index: 9999999; font-size: 13px;
            box-shadow: 0 12px 24px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(255,255,255,0.09); pointer-events: none;
            letter-spacing: 0.06em; text-transform: uppercase;
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

    // 工具函数：防抖
    const debounce = (fn, delay) => {
        let timer = null;
        return function(...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    // [v2.7.2] 3D 数码管渲染 Helper
    const render3DCounter = (titleEl, count, minGreenCount = 9, maxCount = 35, maxTotal = 0) => {
        let hue = 0;
        if (count >= minGreenCount) {
             const greenProgress = Math.min((count - minGreenCount) / (maxCount - minGreenCount), 1);
             hue = 60 + Math.floor(greenProgress * 60); // 60(黄) -> 120(绿)
        } else {
             hue = 0; // 红色
        }

        const color = `hsl(${hue}, 100%, 50%)`;
        const shadowColor = `hsla(${hue}, 100%, 50%, 0.6)`;

        let counter = titleEl.querySelector('.xhj-3d-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'xhj-3d-counter';
            // 3D 数码管样式
            counter.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 15px;
                padding: 0 12px;
                height: 28px;
                background: linear-gradient(140deg, rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.95), rgba(var(--xhj-header-bg-rgb, 22, 27, 34), 0.7));
                border-radius: 8px;
                border: 1px solid rgba(var(--xhj-active-bg-rgb, 189, 147, 249), 0.34);
                box-shadow: inset 0 2px 5px rgba(0,0,0,0.65), 0 6px 12px rgba(0,0,0,0.25);
                font-family: 'Courier New', Courier, monospace;
                font-size: 16px;
                font-weight: bold;
                letter-spacing: 1px;
                position: relative;
                top: -2px;
                transition: all 0.3s ease;
            `;
            const textSpan = document.createElement('span');
            textSpan.className = 'xhj-counter-text';
            textSpan.style.cssText = `
                text-shadow: 0 0 10px currentColor;
                transition: color 0.5s ease, text-shadow 0.5s ease;
            `;
            counter.appendChild(textSpan);
            titleEl.appendChild(counter);
        }

        const textSpan = counter.querySelector('.xhj-counter-text');
        if (textSpan) {
            let displayText = `已上传: ${count} 张`;
            if (maxTotal > 0) {
                displayText = `已上传: ${count} / ${maxTotal} 张`;
            }
            if (textSpan.textContent !== displayText) {
                 textSpan.textContent = displayText;
                 textSpan.style.color = color;
                 textSpan.style.textShadow = `0 0 8px ${shadowColor}, 0 0 15px ${shadowColor}`;
                 counter.style.borderColor = `hsla(${hue}, 50%, 40%, 0.5)`;
            }
        }
    };

    // [v2.7.2] 图片计数逻辑 (更新：支持房堪上传 + 新增全景图)
    const updateImageCounter = () => {
        const containers = [
            ...document.querySelectorAll('.layui-layer'),
            ...document.querySelectorAll('.el-dialog')
        ];
        if (containers.length === 0 && document.querySelector('#uploader-list')) {
            containers.push(document.body);
        }

        containers.forEach(container => {
            const titleEl = container.querySelector('.layui-layer-title') || container.querySelector('.el-dialog__title');
            const titleText = titleEl ? titleEl.textContent : '';
            
            // 1. 房堪上传 (Survey Upload)
            if (titleText.includes('新增房堪图') || titleText.includes('房堪上传') || titleText.includes('房勘')) {
                // [v2.7.5 优化] 添加性能优化标识类，解决滚动掉帧卡顿问题
                if (!container.classList.contains('xhj-perf-optimized')) {
                    container.classList.add('xhj-perf-optimized');
                }

                const iframe = container.querySelector('iframe');
                // 移除旧版文本计数
                const oldPattern = /(?:（|\()\s*已上传[:：]\s*\d+\s*张\s*(?:）|\))/g;
                if (oldPattern.test(titleEl.innerHTML)) titleEl.innerHTML = titleEl.innerHTML.replace(oldPattern, '');

                if (iframe && iframe.contentDocument) {
                    try {
                        const appNode = iframe.contentDocument.querySelector('#app');
                        if (appNode && appNode.__vue__) {
                            const vue = appNode.__vue__;
                            let totalImgs = 0;
                            if (vue.formuploads) {
                                if (vue.formuploads.imageUrls) totalImgs += vue.formuploads.imageUrls.length;
                                if (vue.formuploads.imageUrlx) totalImgs += vue.formuploads.imageUrlx.length;
                                if (vue.formuploads.shineiURL) totalImgs += vue.formuploads.shineiURL.length;
                            }
                            if (vue.houseDataList) {
                                vue.houseDataList.forEach(room => {
                                    if (room.hsImgList) totalImgs += room.hsImgList.length;
                                });
                            }
                            
                            // 移除多余的计数器
                            titleEl.querySelectorAll('.xhj-3d-counter').forEach((el, index) => {
                                if (index > 0) el.remove();
                            });
                            
                            render3DCounter(titleEl, totalImgs);
                            return; // 成功使用 Vue 实例数据后返回
                        }
                    } catch (e) {
                        // 忽略跨域等报错
                    }
                }

                const directImgs = container.querySelectorAll('.upimg.imgstyle img.imgstyle_img[data-original]');
                render3DCounter(titleEl, directImgs.length);
                
                // 清理旧残留
                container.querySelectorAll('.schoolTu_top .xhj-img-counter, .xhj-img-counter').forEach(el => el.remove());
            }
            // 2. 新增全景图 (Panorama Upload) - [v2.7.2 新增]
            else if (
                titleText.includes('新增全景图') ||
                titleText.includes('全景图上传') ||
                (container.querySelector('#uploader-list') && container.querySelector('label.layui-form-label'))
            ) {
                const hasIframe = !!container.querySelector('iframe');
                if (hasIframe && !container.querySelector('#uploader-list')) {
                    if (titleEl) {
                        titleEl.querySelectorAll('.xhj-3d-counter').forEach(el => el.remove());
                    }
                    return;
                }

                // --- 计算成功数和总数 ---
                const successBtns = Array.from(
                    container.querySelectorAll('#uploader-list .layui-upload-list a, #uploader-list .layui-upload-list .layui-btn, #uploader-list .layui-upload-list span')
                ).filter(el => {
                    const rawText = (el.innerText || el.textContent || '').replace(/\s+/g, '');
                    return rawText.includes('上传成功') || rawText.includes('上传完成');
                });

                let successCount = successBtns.length;
                if (successCount === 0) {
                    const uploaderList = container.querySelector('#uploader-list');
                    const fallbackText = uploaderList ? (uploaderList.innerText || '').replace(/\s+/g, '') : '';
                    const matches = fallbackText.match(/上传成功|上传完成/g);
                    successCount = matches ? matches.length : 0;
                }
                
                const uploadingBtns = Array.from(
                    container.querySelectorAll('#uploader-list .layui-btn-danger, #uploader-list .layui-upload-list a, #uploader-list .layui-upload-list .layui-btn')
                ).filter(el => {
                    const rawText = (el.innerText || el.textContent || '').replace(/\s+/g, '');
                    return rawText.includes('上传中') || rawText.includes('等待') || rawText.includes('准备');
                });
                
                // 标记长时间处于“上传中”的按钮为失败
                uploadingBtns.forEach(btn => {
                    if (!btn.dataset.xhjUploadStartTime) {
                        btn.dataset.xhjUploadStartTime = Date.now().toString();
                    } else {
                        const elapsed = Date.now() - parseInt(btn.dataset.xhjUploadStartTime);
                        // 如果超过 180 秒（180000 毫秒）仍未成功，强制视为失败
                        if (elapsed > 180000) {
                            btn.textContent = '上传失败';
                            btn.dataset.xhjUploadTimeout = 'true';
                        }
                    }
                });
                
                // --- 全景图上传失败一键重试功能 ---
                const failedBtns = Array.from(
                    container.querySelectorAll('#uploader-list .layui-upload-list a, #uploader-list .layui-upload-list .layui-btn')
                ).filter(el => {
                    const rawText = (el.innerText || el.textContent || '').replace(/\s+/g, '');
                    return rawText.includes('上传失败');
                });
                
                if (failedBtns.length > 0) {
                    if (titleEl && !titleEl.querySelector('.xhj-retry-btn')) {
                        const retryBtn = document.createElement('button');
                        retryBtn.className = 'xhj-retry-btn layui-btn layui-btn-sm layui-btn-danger';
                        retryBtn.textContent = `重试失败 (${failedBtns.length})`;
                        retryBtn.style.cssText = `
                            margin-left: 15px;
                            height: 28px;
                            line-height: 28px;
                            border-radius: 4px;
                            position: relative;
                            top: -2px;
                            z-index: 100;
                            box-shadow: 0 0 10px rgba(255, 82, 82, 0.5);
                        `;
                        retryBtn.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            failedBtns.forEach(btn => {
                                // 模拟点击原生上传失败的按钮
                                btn.click();
                            });
                            retryBtn.textContent = '正在重试...';
                            retryBtn.style.opacity = '0.7';
                            setTimeout(() => retryBtn.remove(), 1000);
                        };
                        titleEl.appendChild(retryBtn);
                    } else if (titleEl) {
                        const existingBtn = titleEl.querySelector('.xhj-retry-btn');
                        if (existingBtn && !existingBtn.textContent.includes('正在重试')) {
                            existingBtn.textContent = `重试失败 (${failedBtns.length})`;
                        }
                    }
                } else {
                    if (titleEl) {
                        const retryBtn = titleEl.querySelector('.xhj-retry-btn');
                        if (retryBtn) retryBtn.remove();
                    }
                }
                
                let uploadingCount = uploadingBtns.length;
                if (uploadingCount === 0) {
                    const uploaderList = container.querySelector('#uploader-list');
                    const fallbackText = uploaderList ? (uploaderList.innerText || '').replace(/\s+/g, '') : '';
                    const matches = fallbackText.match(/上传中|等待|准备/g);
                    uploadingCount = matches ? matches.length : 0;
                }
                
                let currentTotal = successCount + uploadingCount;
                const trElements = container.querySelectorAll('#uploader-list .layui-upload-list tr');
                if (trElements.length > 0) {
                    const headerCount = container.querySelectorAll('#uploader-list .layui-upload-list th').length > 0 ? 1 : 0;
                    const listTotal = Math.max(0, trElements.length - headerCount);
                    if (listTotal > currentTotal) {
                        currentTotal = listTotal;
                    }
                }
                
                let maxTotal = parseInt(container.dataset.xhjMaxTotal || '0', 10);
                if (currentTotal > maxTotal) {
                    maxTotal = currentTotal;
                    container.dataset.xhjMaxTotal = maxTotal;
                }
                
                if (currentTotal === 0 && successCount === 0 && (!trElements || trElements.length <= 1)) {
                    maxTotal = 0;
                    container.dataset.xhjMaxTotal = '0';
                }
                
                // [v2.7.3] 调整全景图计数器位置
                // 目标位置：单选框区域 (全景图/全景视频/3D模型) 的右侧
                // 通常结构：.layui-form-item > .layui-input-block > radio group
                
                // 1. 找到“类型”标签
                const formLabels = Array.from(container.querySelectorAll('.layui-form-label'));
                const typeLabel = formLabels.find(l => l.textContent.includes('类型'));
                
                let targetContainer = null;
                if (typeLabel) {
                    // 找到对应的 input-block
                    const inputBlock = typeLabel.nextElementSibling;
                    if (inputBlock && inputBlock.classList.contains('layui-input-block')) {
                        targetContainer = inputBlock;
                    }
                }
                
                if (targetContainer) {
                    if (titleEl) {
                        const staleTitleCounter = titleEl.querySelector('.xhj-3d-counter');
                        if (staleTitleCounter) staleTitleCounter.remove();
                    }
                    container.querySelectorAll('.xhj-3d-counter').forEach(counterEl => {
                        if (!targetContainer.contains(counterEl)) counterEl.remove();
                    });
                    // 渲染计数器到 targetContainer 末尾
                    // 需要确保 targetContainer 是相对定位，以便放置绝对定位的计数器，或者直接 append 进去
                    
                    // 检查是否已经存在计数器
                    let counter = targetContainer.querySelector('.xhj-3d-counter');
                    if (!counter) {
                        // 如果没有，创建一个新的容器来包裹计数器，或者直接插入
                        // 为了不破坏布局，我们可以创建一个 inline-block 的容器
                        
                        // 先渲染到 titleEl 获取 DOM 结构 (利用现有 helper)
                        // 但 helper 是往 titleEl 插入的，我们需要修改 helper 或手动移动
                        
                        // 手动调用 render3DCounter 但指定不同的父容器
                        // 为了复用 render3DCounter，我们稍作修改，让它支持传入 parentElement
                        
                        // 这里直接手动创建/更新，逻辑与 render3DCounter 类似但位置不同
                         const minGreenCount = 9;
                         const maxCount = 35;
                         let hue = 0;
                         if (successCount >= minGreenCount) {
                              const greenProgress = Math.min((successCount - minGreenCount) / (maxCount - minGreenCount), 1);
                              hue = 60 + Math.floor(greenProgress * 60); 
                         } else {
                              hue = 0; 
                         }
                
                         const color = `hsl(${hue}, 100%, 50%)`;
                         const shadowColor = `hsla(${hue}, 100%, 50%, 0.6)`;
                         
                         counter = document.createElement('div');
                         counter.className = 'xhj-3d-counter';
                         counter.style.cssText = `
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            margin-left: 30px; /* 与单选框保持距离 */
                            padding: 0 12px;
                            height: 28px;
                            background: #1a1a1a;
                            border-radius: 4px;
                            border: 1px solid #333;
                            box-shadow: inset 0 2px 5px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.1);
                            font-family: 'Courier New', Courier, monospace;
                            font-size: 16px;
                            font-weight: bold;
                            letter-spacing: 1px;
                            position: absolute; /* 绝对定位 */
                            right: 20px; /* 靠右显示 */
                            top: 50%;
                            transform: translateY(-50%);
                            transition: all 0.3s ease;
                            z-index: 10;
                        `;
                        
                        // 确保父容器相对定位
                        if (getComputedStyle(targetContainer).position === 'static') {
                            targetContainer.style.position = 'relative';
                        }
                        
                        const textSpan = document.createElement('span');
                        textSpan.className = 'xhj-counter-text';
                        textSpan.style.cssText = `
                            text-shadow: 0 0 10px currentColor;
                            transition: color 0.5s ease, text-shadow 0.5s ease;
                        `;
                        counter.appendChild(textSpan);
                        targetContainer.appendChild(counter);
                    }
                    
                    // 更新数据
                    const textSpan = counter.querySelector('.xhj-counter-text');
                    if (textSpan) {
                         // 重新计算颜色 (因为是局部变量)
                         const minGreenCount = 9;
                         const maxCount = 35;
                         let hue = 0;
                         if (successCount >= minGreenCount) {
                              const greenProgress = Math.min((successCount - minGreenCount) / (maxCount - minGreenCount), 1);
                              hue = 60 + Math.floor(greenProgress * 60); 
                         }
                         const color = `hsl(${hue}, 100%, 50%)`;
                        const shadowColor = `hsla(${hue}, 100%, 50%, 0.6)`;
                       
                       let displayText = `已上传: ${successCount} 张`;
                       if (maxTotal > 0) {
                           displayText = `已上传: ${successCount} / ${maxTotal} 张`;
                       }
                       if (textSpan.textContent !== displayText) {
                            textSpan.textContent = displayText;
                             textSpan.style.color = color;
                             textSpan.style.textShadow = `0 0 8px ${shadowColor}, 0 0 15px ${shadowColor}`;
                             counter.style.borderColor = `hsla(${hue}, 50%, 40%, 0.5)`;
                        }
                    }
                } else if (titleEl) {
                    render3DCounter(titleEl, successCount, 9, 35, maxTotal);
                }
            }
        });
    };

    // [v2.6 优化] 核心动态内容处理 (统一管理 DOM 变动响应)
    const handleDynamicContent = () => {
        requestAnimationFrame(() => {
            updateImageCounter(); // 6. 图片计数更新

            // 1. 识别表格类型 & 注入列宽样式
            const headers = document.querySelectorAll('.layui-table-header th');
            if (headers.length > 0) {
                const headerTexts = Array.from(headers).map(th => th.textContent.trim());
                const body = document.body;
                
                // 房堪列表
                if (headerTexts.some(t => t.includes('申请门店')) && (headerTexts.some(t => t.includes('房勘状态')) || headerTexts.some(t => t.includes('房堪状态')))) {
                    if (!body.classList.contains('xhj-table-survey')) {
                        body.classList.add('xhj-table-survey');
                        body.classList.remove('xhj-table-sales');
                    }
                } 
                // 售房全景
                else if (headerTexts.some(t => t.includes('全景状态')) && headerTexts.some(t => t.includes('户型图'))) {
                    if (!body.classList.contains('xhj-table-sales')) {
                        body.classList.add('xhj-table-sales');
                        body.classList.remove('xhj-table-survey');
                    }
                    
                    // 动态注入列样式 helper
                    const injectColStyle = (headerName, width, suffix, whiteSpace = 'normal') => {
                         const idx = headerTexts.findIndex(t => t.includes(headerName));
                         if (idx === -1) return;
                         const cssIdx = idx + 1;
                         const styleId = `xhj-sales-${suffix}-col`;
                         if (document.getElementById(styleId)) return;
                         
                         const style = document.createElement('style');
                         style.id = styleId;
                         style.textContent = `
                             body.xhj-table-sales .layui-table tr td:nth-child(${cssIdx}) .layui-table-cell,
                             body.xhj-table-sales .layui-table th:nth-child(${cssIdx}) .layui-table-cell {
                                 min-width: ${width}px !important; width: ${width}px !important;
                                 white-space: ${whiteSpace} !important;
                                 text-align: center !important;
                             }
                         `;
                         document.head.appendChild(style);
                    };

                    injectColStyle('全景状态', 84, 'status');
                    injectColStyle('设计师', 80, 'designer');
                    injectColStyle('上传人', 72, 'uploader');
                    injectColStyle('户型图', 80, 'floorplan');
                    injectColStyle('城市', 70, 'city');
                    injectColStyle('朝向', 60, 'orientation');
                    injectColStyle('卧室', 84, 'bedroom');
                    injectColStyle('全景时间', 90, 'pano-time', 'nowrap');
                    injectColStyle('同步时间', 90, 'sync-time', 'nowrap');
                    
                    // 操作列特殊处理
                    const actionIndex = headerTexts.findIndex(t => t === '操作');
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
                                     padding: 0 5px !important; height: 22px !important; line-height: 22px !important;
                                     font-size: 12px !important; margin: 2px !important; min-width: unset !important;
                                 }
                                 body.xhj-table-sales .layui-table tr td:nth-child(${cssIndex}) .layui-btn i {
                                     margin-right: 0 !important; font-size: 14px !important;
                                 }
                             `;
                             document.head.appendChild(style);
                        }
                    }

                    // 调整搜索和刷新按钮位置
                    const inputs = document.querySelectorAll('input[placeholder*="项目名称"], input[placeholder*="项目ID"]');
                    if (inputs.length > 0) {
                        const targetInput = inputs[0];
                        const inputContainer = targetInput.closest('.layui-inline');
                        
                        if (inputContainer && !inputContainer.closest('[data-xhj-wrapper="true"]')) {
                            const form = inputContainer.closest('.layui-form') || document.body;
                            const allBtns = Array.from(form.querySelectorAll('.layui-btn'));
                            const searchBtn = allBtns.find(b => b.textContent.includes('搜索') || b.querySelector('.layui-icon-search'));
                            const refreshBtn = allBtns.find(b => b.textContent.includes('刷新') || b.querySelector('.layui-icon-refresh'));
                            
                            if (searchBtn && refreshBtn) {
                                const wrapper = document.createElement('div');
                                wrapper.className = inputContainer.className;
                                wrapper.style.cssText = 'display: inline-block; vertical-align: top; margin-right: 10px;';
                                wrapper.setAttribute('data-xhj-wrapper', 'true');
                                
                                inputContainer.parentNode.insertBefore(wrapper, inputContainer);
                                wrapper.appendChild(inputContainer);
                                
                                inputContainer.style.cssText = 'display: block; margin-bottom: 4px; margin-top: 0; vertical-align: top;';
                                inputContainer.classList.remove('layui-inline');

                                const btnContainer = document.createElement('div');
                                btnContainer.className = 'xhj-btn-container';
                                btnContainer.appendChild(searchBtn);
                                btnContainer.appendChild(refreshBtn);
                                searchBtn.style.marginRight = '10px';
                                wrapper.appendChild(btnContainer);
                                
                                // 统一对齐
                                wrapper.parentNode.querySelectorAll('.layui-inline').forEach(sib => sib.style.verticalAlign = 'top');
                            }
                        }
                    }
                }
            }

            // 2. VR上传状态颜色区分
            // 扩展选择器以覆盖图二中的“上传中”、“上传成功”按钮/徽章
            const statusCells = document.querySelectorAll('.layui-table-cell, .layui-upload-list span, .status-text, td:not(:empty), .layui-btn, .layui-badge, span');
            statusCells.forEach(cell => {
                // 排除 script, style
                if (['SCRIPT', 'STYLE'].includes(cell.tagName)) return;
                
                // 排除包含大量子元素的容器，但允许包含少量内联元素（如 icon）的按钮
                if (cell.childElementCount > 2 && !cell.classList.contains('layui-btn')) return;

                const text = cell.textContent.trim();
                if (!text || text.length > 20) return;
                
                // 定义样式应用 helper
                const applyStyle = (color, shadowColor) => {
                    // 使用 !important 覆盖原有样式 (如 layui-btn 的默认白字/背景)
                    cell.style.setProperty('color', color, 'important');
                    cell.style.setProperty('font-weight', 'bold', 'important');
                    // 如果是按钮或徽章，可能需要调整背景色或边框，这里暂只调整文字和发光
                    if (cell.classList.contains('layui-btn') || cell.classList.contains('layui-badge') || cell.tagName === 'SPAN') {
                        cell.style.setProperty('text-shadow', `0 0 5px ${shadowColor}`, 'important');
                    }
                };

                if (text.includes('正在上传') || text.includes('上传中')) {
                    applyStyle('#f1c40f', 'rgba(241, 196, 15, 0.4)'); // 橙黄色
                } else if (text.includes('上传完成') || text.includes('上传成功')) {
                    applyStyle('#00ff9d', 'rgba(0, 255, 157, 0.4)'); // 荧光绿
                } else if (text.includes('上传失败')) {
                    applyStyle('#ff5252', 'rgba(255, 82, 82, 0.4)'); // 红色
                } else if (text === '上传') {
                    applyStyle('#3498db', 'rgba(52, 152, 219, 0.4)'); // 蓝色
                }
            });
            
            // 3. 修复“新增房堪图”弹窗高度 及 移动按钮
            document.querySelectorAll('.layui-layer-title').forEach(title => {
                if (title.textContent.includes('新增房堪图') || title.textContent.includes('房堪上传')) {
                    const layer = title.closest('.layui-layer');
                    if (layer && !layer.dataset.xhjResized) {
                        const h = parseInt(layer.style.height || 0);
                        const w = parseInt(layer.style.width || 0);
                        if (h) layer.style.height = (h + 60) + 'px';
                        if (w) {
                            layer.style.width = (w + 100) + 'px';
                            if (layer.style.left) layer.style.left = (parseInt(layer.style.left) - 50) + 'px';
                        }
                        const content = layer.querySelector('.layui-layer-content');
                        if (content && content.style.height) content.style.height = (parseInt(content.style.height) + 60) + 'px';
                        const iframe = layer.querySelector('iframe');
                        if (iframe && iframe.style.height) iframe.style.height = (parseInt(iframe.style.height) + 60) + 'px';
                        layer.dataset.xhjResized = 'true';
                    }
                    
                    // 移动 批量上传 和 确定 按钮到指定位置
                    if (layer && !layer.dataset.xhjBtnsMovedToRow) {
                        layer.dataset.xhjBtnsMovedToRow = 'true';
                        
                        const moveRealButtonsToRow = () => {
                            try {
                                const iframe = layer.querySelector('iframe');
                                if (!iframe || !iframe.contentDocument) return;
                                const doc = iframe.contentDocument;
                                
                                // 找到目标行：包含“申请人”字样的 el-row
                                const rows = Array.from(doc.querySelectorAll('.el-row.row-bg'));
                                const targetRow = rows.find(r => r.textContent.includes('申请人'));
                                
                                if (targetRow && !targetRow.dataset.xhjBtnsAdded) {
                                    targetRow.dataset.xhjBtnsAdded = 'true';
                                    targetRow.style.position = 'relative';
                                    
                                    const batchBtn = doc.querySelector('.uploadBtn');
                                    if (batchBtn && !batchBtn.dataset.xhjMoved) {
                                        batchBtn.dataset.xhjMoved = 'true';
                                        const adoptedBatch = document.adoptNode(batchBtn);
                                        adoptedBatch.style.cssText = `
                                            position: absolute !important;
                                            right: 150px !important;
                                            top: 50% !important;
                                            transform: translateY(-50%) !important;
                                            z-index: 100 !important;
                                            margin: 0 !important;
                                        `;
                                        targetRow.appendChild(adoptedBatch);
                                    }
                                    
                                    const confirmBtns = Array.from(doc.querySelectorAll('.dialog-footer .el-button'));
                                    const confirmBtn = confirmBtns.find(b => b.textContent.includes('确 定') || b.textContent.includes('确定'));
                                    if (confirmBtn && !confirmBtn.dataset.xhjMoved) {
                                        confirmBtn.dataset.xhjMoved = 'true';
                                        const adoptedConfirm = document.adoptNode(confirmBtn);
                                        adoptedConfirm.style.cssText = `
                                            position: absolute !important;
                                            right: 50px !important;
                                            top: 50% !important;
                                            transform: translateY(-50%) !important;
                                            z-index: 100 !important;
                                            height: 28px !important;
                                            line-height: 28px !important;
                                            padding: 0 15px !important;
                                        `;
                                        targetRow.appendChild(adoptedConfirm);
                                    }
                                }
                            } catch (e) {
                                console.warn('移动按钮失败:', e);
                            }
                        };
                        
                        // 轮询移动真实按钮
                        if (!layer.dataset.xhjBtnRowInterval) {
                            layer.dataset.xhjBtnRowInterval = setInterval(() => {
                                moveRealButtonsToRow();
                                // 检查是否已移动
                                const iframe = layer.querySelector('iframe');
                                if (iframe && iframe.contentDocument) {
                                    const hasBatch = iframe.contentDocument.querySelector('.boxFrom > .uploadBtn');
                                    const hasConfirm = Array.from(iframe.contentDocument.querySelectorAll('.dialog-footer .el-button')).some(b => b.textContent.includes('确 定'));
                                    if (!hasBatch && !hasConfirm) {
                                        clearInterval(layer.dataset.xhjBtnRowInterval);
                                    }
                                }
                            }, 500);
                        }
                    }
                }
            });
            
            // 4. 强力去白底 (仅针对模态框内容和 iframe)
            document.querySelectorAll('.layui-layer-content .layui-bg-white, .layui-layer-content [style*="background-color: white"]').forEach(el => {
                el.style.setProperty('background-color', 'transparent', 'important');
            });
            
            // 5. Iframe 背景强制
            if (window.top !== window.self && document.body) {
                document.body.style.setProperty('background-color', 'var(--xhj-bg)', 'important');
                document.querySelectorAll('.layui-fluid, .admin-main, #app').forEach(c => 
                    c.style.setProperty('background-color', 'transparent', 'important')
                );
            }
        });
    };

    const initThemeObserver = () => {
        // [v2.6] 使用防抖调用动态内容处理
        const debouncedHandleDynamic = debounce(handleDynamicContent, 200);

        // [v2.2 优化] MutationObserver 性能改进：仅处理新增节点，避免全局查询
        const observer = new MutationObserver((mutations) => {
            debouncedHandleDynamic(); // 触发动态内容检查

            const addedNodes = [];
            
            // 收集所有新增的元素节点
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // 仅处理 Element 节点
                            addedNodes.push(node);
                            // 如果添加的是容器，也收集其子元素（可选，视性能而定，这里暂只处理顶层和特定子级）
                        }
                    }
                }
            }

            if (addedNodes.length === 0) return;

            // 1. 处理新增的 iframe
            addedNodes.forEach(node => {
                if (node.tagName === 'IFRAME') {
                    applyThemeToIframe(node);
                } else if (node.querySelectorAll) {
                    // 检查容器内部是否有 iframe
                    const iframes = node.querySelectorAll('iframe');
                    iframes.forEach(applyThemeToIframe);
                }
            });

            // 2. 针对性去白底 (仅检查新增节点及其子树)
            // 避免 document.querySelectorAll 全局扫描
            addedNodes.forEach(node => {
                // 检查节点本身
                if (node.matches && (node.matches('.layui-bg-white') || node.style.backgroundColor === 'white' || node.style.backgroundColor === '#fff' || node.style.backgroundColor === 'rgb(255, 255, 255)')) {
                    node.style.setProperty('background-color', 'transparent', 'important');
                }
                
                // 仅在可能是弹窗或容器的元素内部查找
                if (node.classList && (node.classList.contains('layui-layer') || node.classList.contains('el-dialog') || node.classList.contains('layui-layer-content'))) {
                    const whiteElements = node.querySelectorAll('.layui-bg-white, [style*="background-color: white"], [style*="background-color: #fff"], [style*="background-color: rgb(255, 255, 255)"]');
                    whiteElements.forEach(el => el.style.setProperty('background-color', 'transparent', 'important'));
                }
            });
        });
        
        const config = { childList: true, subtree: true };
        if (document.body) {
            observer.observe(document.body, config);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, config);
            });
        }
    };



    const init = () => {
        initThemeObserver();

        // 1. 加载主题
        const currentTheme = localStorage.getItem(SKIN_STORAGE_KEY) || 'dracula';
        applyTheme(currentTheme);

        // 识别 iframe 并添加标识类 (用于 CSS 底部填充)
        if (window.top !== window.self) {
            document.body.classList.add('xhj-iframe-body');
        }
        
        // (已移除重复的全局点击特效事件，由 CSS 或上方统一处理)

        // 2. 动态内容处理 (核心优化)
        // 逻辑已移至 handleDynamicContent，此处仅做初始调用和定时检查（低频）
        handleDynamicContent();
        
        // 保留一个低频定时器作为兜底 (每 2 秒)，防止 MutationObserver 漏掉某些无 DOM 变动但样式需更新的情况
        setInterval(handleDynamicContent, 2000);

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

    // =============================================================================
    // AutoVerify Logic (v2.0 Integrated)
    // =============================================================================

    let avCharset = [];
    let avOrtSession = null;
    
    const avConfig = {
        delay: 1000,
        callCount: 0,
        MAX_CALLS: 50,
        userImageKeywords: [],
        userInputKeywords: [],
        userExcludedImageKeywords: [],
        defaultImageKeywords: /captcha|verify|code|auth|validate|seccode|check|yzm/i,
        defaultInputKeywords: /captcha|verify|code|auth|validate|seccode|vcode|imgcode|验证码|校验码|校驗碼|驗證|驗證碼|图形码|圖片驗證/i,
        defaultExcludedImageKeywords: /logo|icon|avatar|banner|qr|advert|loading|spinner|close|closebtn|search|flag|svg|images/i,
        visibilityRetryDelay: 500,
        timer: null
    };

    // --- Helpers ---

    function avIsInputVisible(input) {
        if (!input) return false;
        const style = window.getComputedStyle(input);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        const rect = input.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        if (input.offsetParent === null && style.position !== 'fixed' && style.position !== 'absolute') return false;
        return true;
    }

    function avIsCaptchaInputByName(input) {
        const name = (input.name || '').toLowerCase();
        const id = (input.id || '').toLowerCase();
        const placeholder = (input.placeholder || '').toLowerCase();
        return avConfig.defaultInputKeywords.test(name) || avConfig.defaultInputKeywords.test(id) || avConfig.defaultInputKeywords.test(placeholder);
    }

    function avIsPossibleCaptcha(img) {
        if (!img.src || img.offsetParent === null || img.naturalWidth === 0 || img.naturalHeight === 0) return false;
        const srcLower = img.src.toLowerCase();
        const altLower = img.alt?.toLowerCase() || '';
        const idLower = (img.id || '').toLowerCase();

        if (idLower === 'code_ids' || img.closest('#Vcod_icon')) return true;

        const isBase64Src = srcLower.startsWith('data:image/');
        if ((!isBase64Src && avConfig.defaultExcludedImageKeywords.test(srcLower)) || avConfig.defaultExcludedImageKeywords.test(altLower)) return false;

        const rect = img.getBoundingClientRect();
        const isSizeLikely = rect.width > 10 && rect.width < 300 && rect.height > 15 && rect.height < 100;
        const hasKeyword = avConfig.defaultImageKeywords.test(srcLower) || avConfig.defaultImageKeywords.test(altLower) || /码|校验|碼/.test(altLower);

        return (isSizeLikely && hasKeyword) || (rect.width > 60 && rect.width < 150 && rect.height > 15 && rect.height < 60);
    }

    async function avPreprocessImage(img) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const targetHeight = 64;
            const targetWidth = Math.floor((canvas.width * targetHeight) / canvas.height);
            
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = targetWidth;
            resizedCanvas.height = targetHeight;
            const resizedCtx = resizedCanvas.getContext('2d');
            resizedCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
            
            const imageData = resizedCtx.getImageData(0, 0, targetWidth, targetHeight);
            const data = imageData.data;
            const float32Data = new Float32Array(targetWidth * targetHeight);
            
            for (let i = 0, j = 0; i < data.length; i += 4, j++) {
                const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
                float32Data[j] = (gray / 255 - 0.5) / 0.5;
            }
            
            return new ort.Tensor('float32', float32Data, [1, 1, 64, targetWidth]);
        } catch (e) {
            console.error("[AutoVerify] Preprocess failed:", e);
            return null;
        }
    }

    async function avRunModel(inputTensor) {
        try {
             if (!avOrtSession) {
                 // [v2.2 优化] 直接使用 CDN URL，移除 @resource 避免脚本启动阻塞
                 const modelUrl = "https://cdn.jsdelivr.net/gh/Bjorne1/AutoVerify@main/js/model.bin";
                 ort.env.wasm.numThreads = 1;
                 ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/";
                 avOrtSession = await ort.InferenceSession.create(modelUrl);
             }
             const outputMap = await avOrtSession.run({ input1: inputTensor });
             const outputTensor = outputMap['output'];
             const result = [];
             let lastItem = 0;
             for (const item of outputTensor.data) {
                 if (item === lastItem) continue;
                 lastItem = item;
                 if (item !== 0 && avCharset[item]) result.push(avCharset[item]);
             }
             return result.join('');
        } catch (e) {
            console.error("[AutoVerify] Model run failed:", e);
            return null;
        }
    }

    async function avProcessCaptcha(img, input) {
        // 0. Check if it's a refresh (src changed)
        if (img.dataset.lastSrc && img.dataset.lastSrc !== img.src) {
            img.dataset.avProcessed = "false";
        }
        img.dataset.lastSrc = img.src;

        if (img.dataset.avProcessed === "true") return; 
        
        // 1. Add Status Indicator (UI)
        let statusEl = null;
        // 尝试查找现有的状态元素（可能在 input 旁或 img 旁）
        if (input.nextElementSibling && input.nextElementSibling.classList.contains('av-status')) {
             statusEl = input.nextElementSibling;
        } else if (img.nextElementSibling && img.nextElementSibling.classList.contains('av-status')) {
             statusEl = img.nextElementSibling;
        }

        if (!statusEl) {
            statusEl = document.createElement('span');
            statusEl.className = 'av-status';
            // [v2.2 优化] 状态提示显示在验证码图片右侧，不遮挡图片
            statusEl.style.cssText = 'margin-left: 10px; font-size: 12px; color: #aaa; vertical-align: middle; white-space: nowrap; display: inline-block;';
            
            // 优先插入到图片后面
            if (img.parentNode) {
                if (img.nextSibling) {
                    img.parentNode.insertBefore(statusEl, img.nextSibling);
                } else {
                    img.parentNode.appendChild(statusEl);
                }
            } else {
                // Fallback (unlikely)
                input.parentNode.appendChild(statusEl);
            }
        }
        statusEl.textContent = '识别中...';
        statusEl.style.color = '#e67e22';

        // 2. Add Click Listener for Manual Refresh (Once)
        if (!img.dataset.hasClickListener) {
            img.addEventListener('click', () => {
                console.log("[AutoVerify] Image clicked, resetting state...");
                img.dataset.avProcessed = "false";
                statusEl.textContent = '等待刷新...';
                // Reset call count to allow retries
                avConfig.callCount = 0;
            });
            img.dataset.hasClickListener = "true";
        }

        // Wait for image to load if needed
        if (!img.complete || img.naturalWidth === 0) {
            await new Promise(r => img.onload = r);
        }

        const inputTensor = await avPreprocessImage(img);
        if (!inputTensor) {
            statusEl.textContent = '预处理失败';
            statusEl.style.color = '#e74c3c';
            return;
        }

        const text = await avRunModel(inputTensor);
        if (text && text.length >= 4) {
             console.log(`[AutoVerify] Identified: ${text}`);
             input.value = text;
             input.dispatchEvent(new Event('input', { bubbles: true }));
             input.dispatchEvent(new Event('change', { bubbles: true }));
             img.dataset.avProcessed = "true";
             
             statusEl.textContent = `识别成功: ${text}`;
             statusEl.style.color = '#2ecc71';
        } else {
             statusEl.textContent = '识别失败';
             statusEl.style.color = '#e74c3c';
        }
    }

    function avFindAndProcessCode() {
        if (avConfig.callCount >= avConfig.MAX_CALLS) return;
        avConfig.callCount++;

        const inputs = Array.from(document.querySelectorAll("input[type='text'], input[type='tel'], input:not([type])"));
        const keywordInputs = inputs.filter(inp => avIsCaptchaInputByName(inp) && avIsInputVisible(inp) && !inp.disabled && !inp.readOnly);

        if (keywordInputs.length === 0) return;

        const imgs = Array.from(document.querySelectorAll('img')).filter(avIsPossibleCaptcha);
        if (imgs.length === 0) return;

        // Simple pairing strategy
        const pairCount = Math.min(keywordInputs.length, imgs.length);
        for (let i = 0; i < pairCount; i++) {
            avProcessCaptcha(imgs[i], keywordInputs[i]);
        }
    }

    function avLoadCharset() {
        return new Promise((resolve) => {
            const cached = GM_getValue('av_charset_v1');
            if (cached) {
                try {
                    avCharset = JSON.parse(cached);
                    if (Array.isArray(avCharset) && avCharset.length > 1000) {
                        resolve(true);
                        return;
                    }
                } catch(e) {}
            }
            
            console.log("[AutoVerify] Fetching charset...");
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://cdn.jsdelivr.net/gh/Bjorne1/AutoVerify@main/js/charset.js",
                onload: function(response) {
                    try {
                        const start = response.responseText.indexOf('[');
                        const end = response.responseText.lastIndexOf(']');
                        if (start > -1 && end > -1) {
                            const jsonStr = response.responseText.substring(start, end + 1);
                            const parsed = new Function("return " + jsonStr)();
                            avCharset = parsed;
                            GM_setValue('av_charset_v1', JSON.stringify(parsed));
                            resolve(true);
                        } else resolve(false);
                    } catch (e) { resolve(false); }
                },
                onerror: function() { resolve(false); }
            });
        });
    }

    // =============================================================================
    // Safari & Mobile Adaptation (v2.0)
    // =============================================================================

    function initSafariMobileAdaptation() {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isSafari || isMobile) {
            console.log("[XHJ v2.0] Activating Safari/Mobile Adaptation...");
            
            const css = `
                /* --- Safari & Mobile Optimizations --- */
                
                /* 1. iOS Smooth Scrolling */
                * {
                    -webkit-overflow-scrolling: touch;
                }
                
                /* 2. Enhanced Glassmorphism for Safari */
                .layui-layer, .layui-side, .glass-panel {
                    -webkit-backdrop-filter: none !important;
                    backdrop-filter: none !important;
                }
                
                /* 3. Mobile Layout Adjustments */
                @media screen and (max-width: 768px) {
                    /* Fix layout overflow */
                    .layui-layout-admin .layui-body {
                        left: 0 !important;
                        width: 100% !important;
                        overflow-x: hidden;
                    }
                    
                    /* Adjust sidebar for mobile (overlay mode) */
                    /* Note: This depends on specific site structure, safe defaults used */
                    
                    /* Increase Touch Targets */
                    .layui-nav-item a, .el-button, .layui-btn, button {
                        min-height: 44px; /* Apple Human Interface Guidelines */
                        display: flex;
                        align-items: center;
                    }
                    
                    /* Fix modal width on mobile */
                    .layui-layer {
                        max-width: 90% !important;
                        left: 5% !important;
                    }
                    
                    /* Hide non-essential desktop elements if needed */
                    .layui-layout-admin .layui-header .layui-layout-left {
                        left: 0 !important;
                    }
                }
                
                /* 4. Safe Area Insets (iPhone X+) */
                body {
                    padding-bottom: constant(safe-area-inset-bottom);
                    padding-bottom: env(safe-area-inset-bottom);
                    padding-left: constant(safe-area-inset-left);
                    padding-left: env(safe-area-inset-left);
                    padding-right: constant(safe-area-inset-right);
                    padding-right: env(safe-area-inset-right);
                }
                
                /* 5. Fix iOS Input Zoom on Focus */
                input[type="text"], input[type="password"], input[type="number"], select, textarea {
                    font-size: 16px !important; /* Prevents auto-zoom */
                }
            `;
            
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            document.head.appendChild(style);
        }
    }

    // [v2.2 优化] 动态加载 ONNX Runtime 库，避免阻塞脚本首屏执行 (Anti-Delay)
    async function loadOnnxLibrary() {
        if (typeof ort !== 'undefined') return true;
        
        return new Promise((resolve) => {
            console.log("[AutoVerify] Dynamically loading ONNX Runtime...");
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.min.js";
            script.crossOrigin = "anonymous";
            script.onload = () => {
                console.log("[AutoVerify] ONNX Library Loaded.");
                resolve(true);
            };
            script.onerror = () => {
                console.error("[AutoVerify] ONNX Library Load Failed.");
                resolve(false);
            };
            document.head.appendChild(script);
        });
    }

    async function initAutoVerify() {
        // 限制仅在登录页面运行
        if (!window.location.href.includes('houseadmin/login/index.html')) {
            return;
        }

        // 延迟一小会儿再加载库，确保 UI 先渲染
        await new Promise(r => setTimeout(r, 500));
        
        const loaded = await loadOnnxLibrary();
        if (!loaded) return;

        await avLoadCharset();
        if (!avCharset || avCharset.length === 0) {
            console.error("[AutoVerify] Charset not loaded");
            return;
        }
        console.log("[AutoVerify] Logic Ready v2.0");
        
        // Initial check
        setTimeout(avFindAndProcessCode, 1000);

        const observer = new MutationObserver(() => {
             clearTimeout(avConfig.timer);
             avConfig.timer = setTimeout(avFindAndProcessCode, 750);
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    }

    init();
    initAutoVerify();
    initSafariMobileAdaptation();

})();
