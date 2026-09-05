'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const scriptNames = [
    'xhj_assistant.user.js',
    'xhj_assistant_534783.user.js',
    'xhj_assistant_563982.user.js',
    'xhj_assistant_563997.user.js'
];
const expectedNames = {
    'xhj_assistant.user.js': '象视平台助手（563997）',
    'xhj_assistant_534783.user.js': '象视平台助手（534783）',
    'xhj_assistant_563982.user.js': '象视平台助手（563982）',
    'xhj_assistant_563997.user.js': '象视平台助手（563997）'
};

const scripts = new Map(scriptNames.map(name => [name, fs.readFileSync(path.join(root, name), 'utf8')]));
const main = scripts.get('xhj_assistant.user.js');
const normalizeName = source => source.replace(/^\/\/ @name\s+.*$/m, '// @name         <distribution-name>');

for (const [name, source] of scripts) {
    assert.match(source, /^\/\/ @version\s+6\.0\.1-beta\.1$/m, `${name} must publish v6.0.1-beta.1`);
    assert.match(source, new RegExp(`^// @name\\s+${expectedNames[name].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'));
    assert.equal(normalizeName(source), normalizeName(main), `${name} drifted from the main distribution`);
}

const themeStart = main.indexOf('const themes = {');
const themeEnd = main.indexOf('// [v2.2 优化]', themeStart);
assert.ok(themeStart >= 0 && themeEnd > themeStart, 'theme registry boundaries must exist');
const themeKeys = [...main.slice(themeStart, themeEnd).matchAll(/^        '([^']+)': \{$/gm)].map(match => match[1]);
assert.deepEqual(themeKeys, [
    'bauhaus', 'default', 'star-wars-hud', 'dracula', 'solarized-dark',
    'monokai', 'github-dark', 'cyberpunk', 'glass-morphism', 'future-tech',
    'modern-dark', 'midnight-blue', 'synthwave-84', 'emerald-forest', 'macos-light'
]);

const preservedCapabilities = [
    "const SKIN_STORAGE_KEY = 'xhj_skin_theme'",
    "const AUTO_SCALE_STORAGE_KEY = 'xhj_auto_scale_enabled'",
    "const AUTO_SCALE_RATIO_KEY = 'xhj_auto_scale_ratio'",
    'function initSyncButtons()',
    'const injectTableHook = () =>',
    'const updateImageCounter = () =>',
    'function initSafariMobileAdaptation()',
    'async function initAutoVerify()',
    "const storageKey = 'xhj_table_cols_' + path"
];
for (const capability of preservedCapabilities) {
    assert.ok(main.includes(capability), `missing preserved capability: ${capability}`);
}

const livePageAdapters = [
    '/houseadmin/house/index.html',
    '/houseadmin/pano/index.html',
    '/houseadmin/pano/everybody.html',
    '/houseadmin/user/index.html',
    '/houseadmin/house/add_fk_image.html',
    '/houseadmin/pano/add_image.html',
    '/houseadmin/pano/image.html'
];
for (const route of livePageAdapters) assert.ok(main.includes(route), `missing live route adapter: ${route}`);

const accessibilityContracts = [
    "toggleBtn.setAttribute('aria-haspopup', 'dialog')",
    "menu.setAttribute('role', 'dialog')",
    "scaleBtn.setAttribute('role', 'switch')",
    "rangeInput.setAttribute('aria-label', '页面缩放比例')",
    '@media (prefers-reduced-motion: reduce)',
    '@media (forced-colors: active)'
];
for (const contract of accessibilityContracts) assert.ok(main.includes(contract), `missing accessibility contract: ${contract}`);

assert.ok(main.includes('Apple Light (Recommended)'), 'Apple Light must be the recommended theme');
assert.ok(main.includes("localStorage.getItem(SKIN_STORAGE_KEY) || 'macos-light'"), 'Apple Light must be the default theme');
assert.ok(!main.includes('fonts.googleapis.com'), 'the userscript must not depend on Google Fonts');
assert.ok(!main.includes("localStorage.getItem(SKIN_STORAGE_KEY) || 'dracula'"), 'legacy Dracula fallback must be removed');

console.log(`userscript static regression passed: ${scriptNames.length} distributions, ${themeKeys.length} themes`);
