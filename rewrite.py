import re
import os

with open('xhj_assistant.user.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Rewrite getCssTemplate
# We want to find: const getCssTemplate = (vars) => { ... return `...`; }
# We'll use a regex to capture it.
css_template_pattern = re.compile(r'(const getCssTemplate = \(vars\) => \{)(.*?)(return `)(.*?)(`;\n    })', re.DOTALL)

def replace_css(match):
    prefix = match.group(1)
    logic = match.group(2)
    return_backtick = match.group(3)
    css_content = match.group(4)
    suffix = match.group(5)

    # We will inject our new Motion and Design system tokens into the css_content
    # Let's completely rewrite the CSS content while keeping the interpolations.
    
    new_css_content = """
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            ${extraCss}
            
            /* =========================================================
               1. 统一设计系统 (Design System) & 动画标记 (Motion Tokens)
               ========================================================= */
            :root {
                ${varDeclarations}
                --xhj-header-bg-rgb: ${headerBgRgb};
                --xhj-active-bg-rgb: ${activeBgRgb};
                
                /* Motion Tokens */
                --xhj-transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                --xhj-transition-normal: 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
                --xhj-transition-spring: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                
                /* Elevation Tokens */
                --xhj-shadow-sm: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
                --xhj-shadow-md: 0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06);
                --xhj-shadow-lg: 0 12px 32px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.08);
            }
            
            /* =========================================================
               2. 全局排版跃升 (Premium Typography)
               ========================================================= */
            html, body, .layui-table, .layui-btn, .layui-input, .layui-form-label, .layui-layer-title, .el-dialog__title {
                font-family: ${vars['--xhj-special-font'] || "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"} !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
                text-rendering: optimizeLegibility !important;
                font-variant-numeric: tabular-nums;
            }

            html, body {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
                /* Subtle background gradient to avoid flat look */
                background-image:
                    linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0) 18%),
                    repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 2px, rgba(var(--xhj-active-bg-rgb), 0.03) 2px 3px),
                    linear-gradient(180deg, rgba(var(--xhj-active-bg-rgb), 0.04), transparent 34%);
            }

            /* =========================================================
               3. 交互节点动效 (Interaction Motion) & 组件覆写
               ========================================================= */
            /* 卡片与容器 */
            .layui-card, .el-card, .layui-layer, .el-dialog {
                background-color: var(--xhj-input-bg) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
                border-radius: var(--xhj-unified-radius, 12px) !important;
                box-shadow: var(--xhj-shadow-sm) !important;
                transition: transform var(--xhj-transition-spring), box-shadow var(--xhj-transition-normal) !important;
            }
            .layui-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--xhj-shadow-md) !important;
            }
            .layui-layer {
                box-shadow: var(--xhj-shadow-lg) !important;
            }

            /* 按钮高阶交互 */
            .layui-btn, .el-button, .layui-layer-btn a {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
                border: 1px solid transparent !important;
                border-radius: 6px !important;
                font-weight: 600 !important;
                letter-spacing: 0.03em;
                position: relative;
                overflow: hidden;
                transition: all var(--xhj-transition-fast) !important;
                box-shadow: 0 2px 4px rgba(var(--xhj-active-bg-rgb), 0.2) !important;
                cursor: pointer !important;
            }
            .layui-btn:hover, .el-button:hover {
                filter: brightness(1.1);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(var(--xhj-active-bg-rgb), 0.3) !important;
            }
            .layui-btn:active, .el-button:active {
                transform: scale(0.96) !important;
                box-shadow: 0 1px 2px rgba(var(--xhj-active-bg-rgb), 0.1) !important;
            }
            .layui-btn-primary, .layui-btn-primary:hover {
                background-color: transparent !important;
                border-color: var(--xhj-border) !important;
                color: var(--xhj-fg) !important;
                box-shadow: none !important;
            }

            /* 表单输入框 */
            .layui-input, .layui-select, .layui-textarea, .el-input__inner, .el-textarea__inner, input[type="text"], input[type="password"], input[type="number"] {
                background-color: rgba(0,0,0,0.1) !important;
                color: var(--xhj-fg) !important;
                border: 1px solid var(--xhj-border) !important;
                border-radius: 6px !important;
                transition: all var(--xhj-transition-fast) !important;
            }
            .layui-input:focus, .layui-textarea:focus, .el-input__inner:focus {
                border-color: var(--xhj-active-bg) !important;
                box-shadow: 0 0 0 3px rgba(var(--xhj-active-bg-rgb), 0.15) !important;
                background-color: rgba(var(--xhj-active-bg-rgb), 0.05) !important;
            }
            
            /* 表格增强 */
            .layui-table, .el-table {
                background-color: transparent !important;
                color: var(--xhj-fg) !important;
            }
            .layui-table th, .layui-table-header {
                background-color: var(--xhj-table-head) !important;
                color: var(--xhj-fg) !important;
                font-weight: 600;
                border-color: var(--xhj-border) !important;
            }
            .layui-table td, .layui-table-cell {
                border-color: var(--xhj-border) !important;
            }
            .layui-table tbody tr {
                transition: background-color var(--xhj-transition-fast) !important;
            }
            .layui-table tbody tr:hover, .layui-table-hover {
                background-color: var(--xhj-hover-bg) !important;
            }
            
            /* 导航与顶部栏 */
            .layui-header {
                background: var(--xhj-header-bg) !important;
                border-bottom: 1px solid var(--xhj-border) !important;
                box-shadow: var(--xhj-shadow-md) !important;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
            }
            .layui-side, .layui-nav-tree {
                background-color: var(--xhj-side-bg) !important;
                border-right: 1px solid var(--xhj-border) !important;
            }
            .layui-nav .layui-nav-item a {
                color: var(--xhj-fg) !important;
                transition: color var(--xhj-transition-fast), background-color var(--xhj-transition-fast) !important;
            }
            .layui-nav-tree .layui-nav-item a:hover {
                background-color: var(--xhj-hover-bg) !important;
            }
            .layui-nav .layui-this > a {
                background-color: var(--xhj-active-bg) !important;
                color: var(--xhj-active-fg) !important;
            }
            
            /* 弹层标题 */
            .layui-layer-title {
                background-color: var(--xhj-table-head) !important;
                border-bottom: 1px solid var(--xhj-border) !important;
                font-weight: 700 !important;
                letter-spacing: 0.05em;
            }

            /* 分页组件 */
            .layui-laypage a, .layui-laypage span {
                background-color: transparent !important;
                color: var(--xhj-fg) !important;
                border-color: var(--xhj-border) !important;
                border-radius: 4px !important;
                margin: 0 2px !important;
                transition: all var(--xhj-transition-fast) !important;
            }
            .layui-laypage a:hover {
                background-color: var(--xhj-hover-bg) !important;
                color: var(--xhj-active-bg) !important;
            }
            .layui-laypage .layui-laypage-curr .layui-laypage-em {
                background-color: var(--xhj-active-bg) !important;
                border-radius: 4px !important;
            }

            /* =========================================================
               4. 特殊场景适配与加载动效 (Loading & Layout Fixes)
               ========================================================= */
            /* Iframe 内边距修正 */
            body.xhj-iframe-body { padding-bottom: 0px !important; }
            html.xhj-admin-top-root, body.xhj-admin-top-body { height: 100% !important; overflow: hidden !important; }
            body.xhj-admin-top-body .layui-layout-admin { height: 100vh !important; overflow: hidden !important; }
            body.xhj-admin-top-body .layui-layout-admin .layui-body { overflow: auto !important; -webkit-overflow-scrolling: touch !important; }
            
            /* 去除广告 */
            [class*="gwd-"], [id*="gwd"], [class*="bjg-"] { display: none !important; }

            /* 滚动条 */
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: var(--xhj-border); border-radius: 4px; border: 2px solid var(--xhj-bg); }
            ::-webkit-scrollbar-thumb:hover { background: var(--xhj-active-bg); }

            /* 加载动画 (Shimmer Effect) */
            .layui-table-init, .layui-layer-loading .layui-layer-content {
                background-color: var(--xhj-bg) !important;
                color: var(--xhj-fg) !important;
                position: relative;
                overflow: hidden;
            }
            .layui-table-init::after {
                content: "";
                position: absolute;
                top: 0; left: -100%; width: 50%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(var(--xhj-active-bg-rgb), 0.1), transparent);
                animation: shimmer 1.5s infinite;
            }
            @keyframes shimmer {
                100% { left: 100%; }
            }
            .layui-table-init .layui-icon {
                color: var(--xhj-active-bg) !important;
            }

            /* 登录页 Logo 特效 */
            .admin-login-box .logo span {
                background: linear-gradient(135deg, var(--xhj-active-bg) 0%, var(--xhj-fg) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 800;
                filter: drop-shadow(0 0 8px rgba(var(--xhj-active-bg-rgb), 0.4));
            }
"""
    return prefix + logic + return_backtick + new_css_content + suffix

new_content = css_template_pattern.sub(replace_css, content)

# 2. Rewrite initClickAnimation
# We want to replace the whole initClickAnimation function with a Material-like internal ripple effect.
# The user wants "符合用户体验逻辑的动效" and "避免出现卡顿 (60fps)".
# A modern CSS ripple is cleaner than JS DOM creation. We can inject a global style for button active state 
# instead of complex JS, or use a very light JS that appends a span inside the button.

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
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: xhj-ripple-anim 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                pointer-events: none;
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
            
            // Ensure target is relative for absolute children
            if (window.getComputedStyle(target).position === 'static') {
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
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            container.appendChild(ripple);

            // Cleanup
            setTimeout(() => {
                if (ripple.parentNode) ripple.remove();
            }, 600);
        });
    };
"""

content_with_ripple = re.sub(r'const initClickAnimation = \(\) => \{.*?\};\n', ripple_js, new_content, flags=re.DOTALL)

with open('xhj_assistant.user.js', 'w', encoding='utf-8') as f:
    f.write(content_with_ripple)

print('Rewrite complete!')
