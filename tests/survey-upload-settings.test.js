const assert = require('node:assert/strict');
const { surveyConcurrencyOptions, surveyConcurrency, surveyDailyDirectory, surveyFolderFields, surveyOrderDisplay } = require('../work/xiangshi-upload-api/upload-settings');
assert.deepEqual(surveyConcurrencyOptions, [4, 8, 12, 16, 20]);
for (const value of surveyConcurrencyOptions) assert.equal(surveyConcurrency(String(value)), value);
for (const value of [null, undefined, 0, 3, 24, 'oops']) assert.equal(surveyConcurrency(value), 8);
assert.equal(surveyDailyDirectory(new Date('2026-12-31T16:00:00Z')), '/Users/mac/Pictures/工作/2027相片/01月/0101贺志');
assert.equal(surveyDailyDirectory(new Date('2026-11-03T15:59:59Z')), '/Users/mac/Pictures/工作/2026相片/11月/1103贺志');
assert.equal(surveyDailyDirectory(new Date('2026-11-03T16:00:00Z')), '/Users/mac/Pictures/工作/2026相片/11月/1104贺志');
assert.deepEqual(surveyFolderFields('1.测试姓名 HS000000000001 测试门店 测试小区 13-402 北', 'HS000000000001', '北'), {
    sequence: '1', person: '测试姓名', store: '测试门店', property: '测试小区', unit: '13-402'
});
assert.equal(surveyFolderFields('HS000000000001 不规则信息 北', 'HS000000000001', '北').property, '不规则信息');
console.log('survey upload settings passed');
assert.equal(surveyOrderDisplay([{state:1},{state:0}]), '重拍可上传');
assert.equal(surveyOrderDisplay([{state:'3'}]), '已接单可上传');
assert.match(surveyOrderDisplay([{state:0}]), /^无效.*未找到/);
assert.match(surveyOrderDisplay([]), /^无效.*未找到/);
assert.match(surveyOrderDisplay([{state:1},{state:3}]), /^无效.*多个/);
