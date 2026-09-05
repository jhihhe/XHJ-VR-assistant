'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'xhj_assistant_260905.user.js'), 'utf8');
const baseline = fs.readFileSync(path.join(root, 'xhj_assistant_260904.user.js'), 'utf8');
const start = source.indexOf('const PAGE_PROFILES =');
const end = source.indexOf('    const parseColorChannels', start);
const runProfile = (url, active, first) => {
    const context = {
        URL,
        window: { location: new URL(url) },
        document: {
            querySelector: selector => selector.includes('.layui-show') ? active : first
        }
    };
    return vm.runInNewContext(source.slice(start, end) + '\ngetActivePageProfile().id', context);
};
const host = 'https://vr.xhj.com';
const profile = { src: host + '/houseadmin/user/index.html' };
assert.equal(runProfile(host + '/houseadmin/index', {src: host + '/houseadmin/house/index.html'}, profile), 'house-list');
assert.equal(runProfile(host + '/houseadmin/index', {src: host + '/houseadmin/pano/index.html'}, profile), 'pano-list');
assert.equal(runProfile(host + '/houseadmin/index', null, profile), 'profile');
assert.equal(runProfile(host + '/houseadmin/index', null, null), 'shell');
assert.equal(runProfile(host + '/houseadmin/house/add_fk_image.html', null, profile), 'house-upload');
// Theme registry and business entry points remain available.
const themeStart = source.indexOf('const themes = {');
const themeEnd = source.indexOf('// [v2.2 优化]', themeStart);
assert.ok(themeStart >= 0 && themeEnd > themeStart);
for (const key of ['bauhaus','default','dracula','macos-light']) assert.ok(source.includes(`'${key}'`));
for (const capability of ['function initSyncButtons()', 'const updateImageCounter = () =>', 'async function initAutoVerify()']) {
    assert.ok(source.includes(capability));
    assert.ok(baseline.includes(capability));
}
console.log('Passed: active iframe selection, fallback routes, unchanged themes and business modules.');
