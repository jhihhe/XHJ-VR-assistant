const assert = require('node:assert/strict');
const { panoramaDailyDirectory, planPanoramaFolder } = require('../work/xiangshi-upload-api/panorama-plan');
assert.equal(panoramaDailyDirectory(new Date('2026-11-03T16:01:00Z')), '/Users/mac/Pictures/工作/2026VR/11月/1104');
assert.equal(planPanoramaFolder('1', []), null);
assert.equal(planPanoramaFolder('HS1234567890123 北', []), null);
const plan = planPanoramaFolder('1.示例 HS000000000001 门店 小区 1-101 北', [
    { name: '餐厅.jpg' }, { name: '卧室.jpg', relativePath: '2/卧室.jpg' },
    { name: '._餐厅.jpg' }, { name: '原图.dng' }
]);
assert.deepEqual(plan.errors, []);
assert.equal(plan.count, 2);
assert.deepEqual(plan.floors.map(x => [x.floor, x.images.map(y => y.room)]), [[1, ['餐厅']], [2, ['卧室']]]);
assert.ok(planPanoramaFolder('HS000000000001 北', [{ relativePath: '3/客厅.jpg' }]).errors.some(x => x.includes('不支持')));
assert.ok(planPanoramaFolder('HS000000000001 北', [{ name: '客厅.jpg', size: 50 * 1024 * 1024 + 1 }]).errors.some(x => x.includes('50MB')));
assert.ok(planPanoramaFolder('HS000000000001 北', [{ relativePath: '2/卧室.jpg' }]).errors.includes('一层没有 JPG 全景图片'));
console.log('panorama folder planning passed');
