const assert = require('node:assert/strict');
const { planFolder } = require('../work/xiangshi-upload-api/folder-plan');

assert.equal(planFolder('1', [{ name: '客厅(1)1.jpg' }]), null);
assert.equal(planFolder('某人 门店 小区 北', [{ name: '客厅(1)1.jpg' }]), null);
assert.equal(planFolder('HS1234567890123 北', [{ name: '客厅(1)1.jpg' }]), null);
const result = planFolder('1.某人 HS000000000001 楼盘 北', [
    { name: '客厅(1)10.jpg' }, { name: '卧室(1)1.jpg' },
    { name: '客厅(1)1.jpg' }, { name: '._客厅(1)2.jpg' }, { name: 'raw.dng' }
]);
assert.equal(result.houseNumber, 'HS000000000001');
assert.equal(result.direction, '北');
assert.equal(result.cover.name, '客厅(1)1.jpg');
assert.equal(result.images.length, 3);
assert.deepEqual(result.errors, []);
assert.ok(planFolder('HS000000000001 HS000000000002 北', []).errors.includes('房源编号不唯一'));
assert.ok(planFolder('HS000000000001 楼盘', [{ name: '卧室(1)1.jpg' }]).errors.includes('无法识别朝向'));
assert.ok(planFolder('HS000000000001 楼盘 北', [{ name: '卧室(1)1.jpg' }]).errors.includes('未找到客厅封面'));
console.log('survey folder recognition passed');
