# 🎨 Xiangshi Platform Assistant (v1.48)

![Platform](https://img.shields.io/badge/Platform-Xiangshi%20Admin-blue)
![Environment](https://img.shields.io/badge/Environment-Tampermonkey-orange)
![Type](https://img.shields.io/badge/Type-UserScript-blueviolet)
![Language](https://img.shields.io/badge/Language-JavaScript-yellow)
![License](https://img.shields.io/badge/License-MIT-green)
![Copyright](https://img.shields.io/badge/Copyright-%C2%A9%202026%20Xiangshi-lightgrey)
![Version](https://img.shields.io/badge/Version-v2.5.3-brightgreen)

[中文](README.md) | [English](README-EN.md) | [GitHub Homepage](https://github.com/jhihhe/XHJ-VR-assistant)

**Providing the ultimate macOS-style dark mode, intelligent layout optimization, and efficient automation tools for the Xiangshi Platform backend management system.**

This is a Tampermonkey script developed specifically for the [Xiangshi Platform Backend](https://vr.xhj.com/houseadmin/). It's not just a simple skin change; it's a comprehensive upgrade for the backend management system. We have perfectly blended **ultimate UI beautification** with **automatic synchronization functions** to create a comprehensive assistant that combines visual enjoyment with efficient office work.

## ✨ Core Features

### 1. 🖥️ Ultimate macOS Style UI
*   **Glassmorphism**: Sidebar, modals, and cards feature advanced background blur and semi-transparent effects.
*   **Light and Shadow Aesthetics**: Carefully tuned Shadow and Glow effects give interface elements distinct layers, rejecting flat design.
*   **Fluid Animations**: Micro-interactions like button ripples, menu rebound, and hover scaling provide a silky smooth user experience.
*   **Rounded Design**: Rounded corners applied throughout the site for a softer and more comfortable visual appearance.
*   **Auto Scale**: (v1.33+) Intelligent full-screen adaptation, defaulting to 120% of screen width to solve small screen display issues, with a one-click toggle.
*   **UI/UX Deep Optimization (v1.44)**: Upgraded all themes to Pro standards (Monokai Pro/Dracula Official/Solarized Pro), refining every pixel.

### 2.  Intelligent Auto-Sync (New in v1.16)
*   **One-Click Sync**: Integrated "Auto-Sync" function allows batch processing of housing survey/panorama data synchronization tasks with a single click.
*   **Smart Tracking**: Real-time display of sync progress and status, automatically skipping synced items for efficiency and peace of mind.
*   **Seamless Integration**: Sync buttons and control panels perfectly adapt to the current dark theme, saying goodbye to jarring style conflicts.

### 3. 📊 Intelligent List Layout Engine
*   **Code Block Style Fields**: Table content adopts a "code block" style design, with each field having an independent background color and border for clear readability.
*   **Smart Color Coding**: Uses `nth-child` selectors to automatically assign differentiated colors to different columns, preventing visual fatigue.
*   **Single-Line Full Display Optimization**: Forces column width stretching to ensure long text (such as property names, time) is fully displayed in one line, eliminating line break issues.
*   **Multi-Business Adaptation**:
    *   **Housing Survey List**: Retains the classic compact layout.
    *   **Sales Panorama**: Automatically recognizes and enables an exclusive wide-screen layout, perfectly adapting to special columns like "Floor Plan" and "Panorama Status".

### 4. 🎨 Selected Themes
Built-in classic color schemes loved by programmers, switch with one click:
*   🧛🏻‍♂️ **Dracula (Official)** (Official Color Palette - More Precise Vampire Style)
*   🍭 **Monokai Pro** (Spectrum Style - Modern Grey with High Saturation Accents)
*   ☀️ **Solarized Dark (Pro)** (Professional Eye-care - Enhanced Contrast & Cyan Vibrancy)
*   🍎 **MacOS Light** (New in v1.43 - Apple Clean White Style)
*   🔮 **Cyberpunk 2077** (Edgerunner Style - Intense Blue/Red Contrast & Neon Glitch)
*   🎸 **Synthwave '84** (Retrowave Style - Dreamy Purple & Laser Pink)
*   🌲 **Emerald Forest** (New in v1.42 - Aurora Green)
*   🧊 **Glass Morphism** (Frost Style - Ultimate Blur & Translucency)
*   🤖 **Future Tech** (Grid Style - Dynamic Grid & Tech Blue)
*   🗿 **Modern Dark** (Stone Style - Warm Graphite Dark)
*   🌊 **Midnight Blue** (Deep Ocean Style - Immersive Deep Sea)
*   🐱 **GitHub Dark** (GitHub Official Dark)
*   🔙 **Default** (One-click restore to official original style)

### 5. 🛠️ Deep Layui Adaptation & Fixes
*   **Perfect Alignment**: Fixed the pixel-level misalignment issue between Layui table headers and content.
*   **De-whitening**: Thoroughly removed intrusive white backgrounds remaining in Tab bars, paginators, button groups, etc.
*   **Site-wide Sync**: Supports real-time seamless style synchronization between the main page and iframe sub-pages, effective immediately upon refresh.

### 6. 🤖 Intelligent CAPTCHA Recognition (New in v2.0)
*   **AutoVerify Engine**: Integrated lightweight ONNX Runtime for efficient local recognition of login CAPTCHAs.
*   **Privacy & Security**: No image upload to third-party servers; all processing is done locally.
*   **Zero Configuration**: Out-of-the-box usage, no need to apply for API Keys or complex configurations.

### 7. 🔐 Login Page Beautification (v2.5.3)
*   **Full Theme Adaptation**: The background, cards, and controls of the login page (`/houseadmin/login/index.html`) fully adapt to the current theme, saying goodbye to the jarring default white background.
*   **Frosted Glass Effect**: The login box features advanced Glassmorphism effects, paired with dynamic lighting and breathing interactions, enhancing the first impression of the system.
*   **Refined Details**: Preserves original particle animations while optimizing their opacity to ensure readability under dark themes.

### 8. 🔢 Smart Counter & Interaction (v2.5)
*   **Precise Penetration Counting**: Uses a "child-push" mechanism to perfectly solve the housing survey image counting loss issue caused by Layui iframe nesting, achieving 100% accurate real-time statistics.
*   **Distraction-Free Layout**: Intelligently removes redundant parent-level counters from the modal header, keeping only the real-time statistics in the content area for a cleaner and more focused interface.

## 🚀 How to Use

1.  Install the browser extension **Tampermonkey** (Chrome/Edge/Firefox).
2.  **Install Script**: Install `xhj_assistant.user.js` into Tampermonkey.
3.  Open the Xiangshi Platform backend management page.
4.  **Change Skin**: Click the **🎨 Floating Ball** in the bottom right corner of the page and select your favorite theme.
5.  **Sync**: On supported list pages (such as Housing Survey List), click the **🔄 Auto Sync** button at the top to start working.

## 📝 Changelog

### v2.5.3 (2025-02-09)
- **Login Page Beautification**: Added theme adaptation for the login page (`/houseadmin/login/index.html`). Background images, login boxes, and controls now automatically switch with the current theme, supporting frosted glass effects.

### v2.5.2 (2025-02-09)
- **Counter Optimization**: Removed duplicate parent-level counter in the "New Housing Survey" modal header, keeping only the more accurate child-level counter in the content area for a cleaner interface.

### v2.5.1 (2025-02-09)
- **Logic Refactoring**: Housing survey upload counter now uses a "child-push" mechanism, fixing issues where iframe internal counter disappeared or parent count showed 0.

### v2.5 (2025-02-09)
- **Bug Fix**: Fixed the issue of duplicate image counters appearing in the housing survey upload modal.

### v2.0 (2025-02-09)
- **Major Update**: Fully integrated **AutoVerify** intelligent CAPTCHA recognition engine, supporting automatic recognition and filling of login CAPTCHAs (running locally via ONNX Runtime, no external API needed).
- **Safari/iOS Deep Adaptation**: Added exclusive optimizations for Safari (macOS) and iPhone/iPad, fixing Glassmorphism rendering issues and improving touch scrolling/mobile layout.
- **Experience Optimization**: Introduced MutationObserver mechanism to completely resolve the theme application delay issue for new windows/popups, achieving "instant opening and instant changing".
- **Refactoring**: Introduced dynamic resource loading mechanism, significantly improving script loading speed and stability.

### v1.48 (2025-02-08)
- **Project Homepage Integration**: Added `homepageURL` and `supportURL` to script metadata for easier access to updates and feedback on GitHub.
- **Documentation Update**: Added GitHub project link to README and synced version number.

### v1.47 (2025-02-08)
- **Toast Notification Redesign**: Replaced the legacy square Layui alerts with MacOS-style "Capsule" notifications.
- **Global Glassmorphism**: All dialogs and layers now feature authentic Frosted Glass effects (Blur + Translucency), perfectly matching the MacOS Light theme.
- **Refined Details**: Optimized icon positioning and typography for a cleaner look.

### v1.46 (2025-02-08)
- **Pure MacOS Mode**: Specifically optimized for "MacOS Light" theme to achieve pixel-perfect system restoration.
- **Sidebar De-Black**: Removed forced black backgrounds in Layui sidebar, applying authentic translucent frosted glass effect.
- **System Color Palette**: Neutralized vivid Layui buttons (Blue/Red/Orange) to standard Apple System Colors (San Francisco Blue, Sunset Orange, etc.).
- **Visual Softening**: Reduced overall contrast and shadow hardness for a cleaner, flatter, yet deep aesthetic.

### v1.45 (2025-02-08)
- **Visual Upgrade**: Enhanced 3D depth and vividness across all themes
- **3D Effects**: Added sophisticated layered shadows and subtle glow gradients to cards and buttons
- **Detail Refinements**:
  - Buttons now feature inner shadows and ripple effects
  - More natural levitation animation for card hover states
  - Enhanced texture feel for sidebar and top navigation
- **Theme Adaptation**: All 12 themes fully adapted to the new lighting/shadow system
- **Deep Integration**: Added full support for Element UI components (Dialogs, Forms, Buttons) and original platform custom widgets (.topbox, .isAction), ensuring a unified style across the backend management system.

### v1.44 (2025-02-08)
*   **UI/UX Deep Optimization**: Upgraded all themes to Pro standards (Monokai Pro/Dracula Official/Solarized Pro), refining every pixel.

### v1.40
*   **Panorama Upload Page DPI Fix**: Automatically detects and **disables Auto Scale** for the panorama upload page (popup or standalone). This resolves abnormal DPI display issues (such as blurred text or misaligned controls) caused by auto-scaling in the upload window, ensuring precise operation.

### v1.39
*   **Search Bar Alignment Deep Fix**:
    *   **Forced Top Alignment**: Addressed vertical misalignment issues in the Layui layout (where input boxes, dropdowns, and date pickers were not on the same horizontal line). Now, the search bar and all sibling form elements in the same row (including dropdowns and date pickers) are forcibly set to top alignment (`vertical-align: top`).
    *   **Container Optimization**: Refactored the search bar wrapper to fully inherit original Layui class names and cleared internal element margins, ensuring perfect integration with native components.

### v1.38
*   **Search Bar Layout Fix**: Improved the container layout of the search bar (switched from flex to inline-block) to fix misalignment issues with the right-side filter boxes on certain screen sizes, enhancing layout stability.
*   **Auto Scale Adjustment**: Rolled back the minimum scale limit and adjusted the default auto-scale ratio to **120%** (previously 125%) based on user feedback, providing a more optimal viewing experience.

### v1.37
*   **Search Bar Layout Refinement**: Further optimized the layout of the search bar on the "Sales Panorama" page. The input box and search buttons are now grouped together without forcing a line break, allowing the filter dropdowns on the right to flow automatically, reducing white space and creating a more compact visual effect.
*   **Auto Scale Optimization**: Adjusted the auto-scaling logic by adding a **minimum scale limit (1.0)**. This means that when the window is resized smaller (e.g., 3/4 of the screen), the web content will not shrink excessively and will remain clear and readable.

### v1.36
*   **Search Bar Layout Optimization**: In the "Sales Panorama" management page, the "Search" and "Refresh" buttons have been moved below the "Project Name or Project ID" input box, and their sizes have been adjusted to match the "Pending/All" buttons, making the operation area more compact and reasonable.

### v1.35
*   **Auto Scale Enabled by Default**: In response to user requests, the Auto Scale feature is now **enabled by default**. New users or those who clear their cache will automatically experience the 125% full-screen adaptive layout without manual setup.

### v1.34
*   **Auto Scale Logic Optimization**: The baseline for auto-scaling has been adjusted from a fixed 1920px to **125% of the current screen resolution width**. This means that in full-screen mode, page content will default to 125% zoom, making it more suitable for high-DPI screens or scenarios requiring larger text, while maintaining responsiveness to window size changes.

### v1.33
*   **Auto Scale**: Added full-screen adaptive feature. Based on 1920px standard, when the browser window size changes, the page content automatically scales to maintain the optimal layout ratio, solving the problem of incomplete content display on small screens. You can toggle this feature at any time in the UI floating menu.

### v1.32
*   **Status Indication Enhancement**: Further expanded the recognition range of status texts, adding color distinction for "Uploading...", "Upload Success", and "Upload" (Button), fully covering the status display of the entire upload process.
*   **Compatibility Optimization**: Expanded the detection range of status texts (supporting `div`, `span`, and button texts) to ensure correct coloring under different page structures.

### v1.31
*   **Polish Style UI Upgrade**: Deeply replicated the V2EX Polish style, introducing large rounded corners (18px), SF Pro Rounded font stack, and subtle shadow effects, making the interface more rounded and modern while preserving the original color schemes of each theme.
*   **Adaptive Theme Optimization**: The UI floating ball and menu now automatically adapt to the currently selected theme colors (supporting custom Glow and gradients), achieving a truly immersive full-theme experience.
*   **VR Upload Status Visualization**: In Housing Survey/Panorama list pages, distinct colors and dynamic lighting effects have been added for status texts like "Uploading" (Orange-Yellow + Breathing Blink), "Upload Completed" (Fluorescent Green + Highlight), and "Upload Failed" (Red Warning) to instantly grasp task progress.

### v1.30
*   **New Theme: Future Tech**: Added "Future Tech (Neon)" theme, featuring a deep blue-black background with high-saturation neon effects and a built-in dynamic grid background for an ultimate cyberpunk experience.
*   **Global Ripple Effect**: Added click ripple effect interaction; every click is accompanied by a colorful spreading animation, maximizing operational feedback.
*   **UI Interaction Overhaul**:
    *   **Floating Ball Evolution**: Upgraded to a gradient light ball, supporting hover rotation and breathing halo effects.
    *   **Glassmorphism Menu**: The theme menu now uses a more refined Glassmorphism effect, with silky zoom animations for expanding/collapsing.
    *   **Polished Details**: Menu items now have sliding highlight and edge glow effects on hover.

### v1.18
*   **Smart Modal Expansion**: Forced expansion for modals like "Add Housing Survey Map" (Height +300px, Width +100px), thoroughly resolving the issue of bottom buttons not being fully displayed, eliminating the need to manually adjust window size.
*   **Layout Auto-Correction**: Automatically recalculates modal position during expansion to ensure it remains vertically/horizontally centered, preventing top overflow.
*   **Fine-grained Column Width Adjustment**: Increased column widths for "Operation", "Panorama Status", and "Bedroom" in Sales Panorama to 1.4x, improving information readability.
*   **Loading Interface Adaptation**: Fixed the white background issue of the loading box, perfectly adapting to the dark theme.

### v1.17
*   **Deep Modal Fix**: Deep adaptation for complex form modals like "Add Housing Survey Map", forcing white background coverage and fixing color issues for labels, input boxes, and upload areas.
*   **Full Element UI Adaptation**: Added exclusive dark style support for Vue/Element UI components, perfectly adapting to `el-dialog`, `el-input`, `el-select`, etc.
*   **Smart Column Width Reduction**: In response to user demand, significantly reduced the width of the "Operation" column and other redundant columns in Sales Panorama, improving space utilization.
*   **Refined Layout Control**: Introduced dynamic column index recognition technology to customize pixel-level widths for 7+ core columns like "Designer", "Panorama Status", and "Time"; forced single-line display for the time column, increasing space utilization by 40%.
*   **Enhanced Domain Adaptation**: Extended script scope to all `*.xhj.com` subdomains, ensuring cross-domain modals (iframe/Layer) also correctly load themes.

### v1.16 (Milestone Version)
*   **Feature Merger**: Perfectly integrated the original "Xiangshi Auto Sync" script, achieving a "Skin + Sync" two-in-one solution.
*   **Brand Upgrade**: Script officially renamed to "Xiangshi Platform Assistant".
*   **Modal Fixes**: Thoroughly fixed white background issues for modals like "Add Housing Survey Map", achieving full-domain dark mode.
*   **UI Unification**: Auto-sync buttons and panels deeply adapted to themes like Dracula for a more unified visual experience.

### v1.15
*   **Modal Adaptation**: Deep adaptation for business modals, fixing glaring white background issues.
*   **Component Optimization**: Beautified the file upload component (Upload Drag) to blend into the dark theme.

### v1.14
*   **Multi-Business List Adaptation**: Smartly recognizes "Housing Survey List" and "Sales Panorama", automatically applying different column width strategies.
*   **Style Rollback**: In response to user feedback, restored "Housing Survey List" to the classic style of v1.12.
*   **Bug Fixes**: Fixed the "Double Text Box" display issue in the status and image columns of "Sales Panorama".

### v1.10 - v1.13
*   **Single-Line Display Optimization**: Significantly adjusted table CSS to force long fields not to wrap, improving reading efficiency.
*   **UI Refactoring**: Introduced macOS style lighting and shadows, enhancing the three-dimensionality of buttons and cards.

### v1.0 - v1.09
*   Initial release, implementing basic skin changing, iframe sync, and Dracula theme.

---

> **Note**: This script only changes the local interface style and simulates click operations. It does not modify any backend core data structures. Please use with confidence.
