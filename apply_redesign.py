import re
import os

with open('xhj_assistant.user.js', 'r', encoding='utf-8') as f:
    content = f.read()

design_system_css = """
            /* =========================================================================
               [v5.0.41] UI/UX Pro Max - Unified Design System & High-Performance Motion
               ========================================================================= */
            :root {
                /* Spacing System (8pt Grid) */
                --xhj-space-1: 4px;
                --xhj-space-2: 8px;
                --xhj-space-3: 12px;
                --xhj-space-4: 16px;
                --xhj-space-6: 24px;
                --xhj-space-8: 32px;

                /* Motion System (60fps optimized) */
                --xhj-ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
                --xhj-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
                --xhj-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
                
                --xhj-duration-fast: 150ms;
                --xhj-duration-normal: 250ms;
                --xhj-duration-slow: 400ms;

                /* Elevation System */
                --xhj-elevation-1: 0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12);
                --xhj-elevation-2: 0 6px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08);
                --xhj-elevation-3: 0 16px 32px rgba(0,0,0,0.16), 0 4px 8px rgba(0,0,0,0.08);
            }

            /* 1. Global Motion Enablement */
            .layui-btn, .el-button, .layui-card, .el-card, .layui-input, .layui-select, .xhj-theme-option, .layui-layer {
                transition: background-color var(--xhj-duration-fast) var(--xhj-ease-out),
                            border-color var(--xhj-duration-fast) var(--xhj-ease-out),
                            box-shadow var(--xhj-duration-normal) var(--xhj-ease-out),
                            transform var(--xhj-duration-fast) var(--xhj-ease-out),
                            opacity var(--xhj-duration-fast) var(--xhj-ease-out),
                            filter var(--xhj-duration-fast) var(--xhj-ease-out) !important;
                will-change: transform, opacity, box-shadow, filter;
            }

            /* 2. Advanced Component Interaction (Hover & Active States) */
            /* Buttons */
            .layui-btn:not(.layui-btn-disabled):hover, .el-button:not(.is-disabled):hover, .xhj-theme-option:hover {
                transform: translateY(-1.5px) !important;
                box-shadow: 0 6px 16px rgba(var(--xhj-active-bg-rgb), 0.25), var(--xhj-elevation-2) !important;
                filter: brightness(1.05) saturate(1.05);
                z-index: 10;
            }
            .layui-btn:not(.layui-btn-disabled):active, .el-button:not(.is-disabled):active, .xhj-theme-option:active {
                transform: scale(0.96) translateY(0) !important;
                box-shadow: var(--xhj-elevation-1) !important;
                filter: brightness(0.95);
            }

            /* Cards */
            .layui-card, .el-card {
                box-shadow: var(--xhj-elevation-1) !important;
            }
            .layui-card:hover, .el-card:hover {
                transform: translateY(-2px) !important;
                box-shadow: var(--xhj-elevation-3), 0 0 0 1px rgba(var(--xhj-active-bg-rgb), 0.1) !important;
            }

            /* Inputs */
            .layui-input:focus, .el-input__inner:focus, .layui-textarea:focus {
                transform: translateY(-1px) !important;
                box-shadow: 0 0 0 3px rgba(var(--xhj-active-bg-rgb), 0.15), var(--xhj-elevation-1) !important;
                border-color: var(--xhj-active-bg) !important;
            }

            /* Table Rows */
            .layui-table tbody tr {
                transition: background-color var(--xhj-duration-fast) var(--xhj-ease-out), box-shadow var(--xhj-duration-fast) var(--xhj-ease-out) !important;
            }
            .layui-table tbody tr:hover, .el-table__body tr:hover > td {
                background-color: var(--xhj-hover-bg) !important;
                box-shadow: inset 3px 0 0 var(--xhj-active-bg) !important;
            }

            /* 3. Loading State (Shimmer Animation) */
            .layui-table-init, .layui-layer-loading .layui-layer-content {
                position: relative;
                overflow: hidden;
            }
            .layui-table-init::after, .layui-layer-loading .layui-layer-content::after {
                content: "";
                position: absolute;
                top: 0; left: -150%; width: 150%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(var(--xhj-active-bg-rgb), 0.1), transparent);
                animation: xhj-shimmer 1.5s infinite var(--xhj-ease-in-out);
                pointer-events: none;
            }
            @keyframes xhj-shimmer {
                100% { left: 100%; }
            }

            /* 4. Global Typography & Readability Tuning */
            body, .layui-table, .layui-input, .layui-btn, .layui-layer-title {
                font-variant-numeric: tabular-nums;
            }
"""

content = re.sub(r'(return `[\s\S]*?)(`;\n    })', r'\1' + design_system_css + r'\2', content)

ripple_js = """
    const initClickAnimation = () => {
        if (!ENABLE_ADVANCED_CLICK_ANIMATION) return;
        const style = document.createElement('style');
        style.textContent = `
            .xhj-ripple-container {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                overflow: hidden;
                border-radius: inherit;
                pointer-events: none;
                z-index: 0;
            }
            .xhj-ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.35);
                transform: scale(0);
                animation: xhj-ripple-anim 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                pointer-events: none;
            }
            .xhj-ripple-effect.dark-ripple {
                background: rgba(0, 0, 0, 0.2);
            }
            @keyframes xhj-ripple-anim {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.addEventListener('mousedown', (e) => {
            const target = e.target.closest('.layui-btn, .el-button, .xhj-theme-option');
            if (!target) return;
            
            const compStyle = window.getComputedStyle(target);
            if (compStyle.position === 'static') {
                target.style.position = 'relative';
            }

            let container = target.querySelector('.xhj-ripple-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'xhj-ripple-container';
                target.appendChild(container);
            }

            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.className = 'xhj-ripple-effect';
            
            const rgb = compStyle.backgroundColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                if (brightness > 200) {
                    ripple.classList.add('dark-ripple');
                }
            }

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            container.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) ripple.remove();
            }, 500);
        });
    };
"""

content = re.sub(r'const initClickAnimation = \(\) => \{[\s\S]*?\}\;\n', lambda m: ripple_js, content)

content = re.sub(r'// @version      5\.0\.\d+', '// @version      5.0.41', content)
content = re.sub(r'// @description  .*?\n', '// @description  象视平台综合辅助工具：包含多款皮肤切换（MacOS Light/Dracula/Midnight/Synthwave/Bauhaus等）、UI 深度美化 (Pro级配色/3D立体视效)、iframe 样式同步、以及自动化同步操作功能。v5.0.41: 引入 ui-ux-pro-max 设计系统重写全局排版与动效引擎 (60fps)。\n', content)

with open('xhj_assistant.user.js', 'w', encoding='utf-8') as f:
    f.write(content)
