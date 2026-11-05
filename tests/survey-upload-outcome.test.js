// Author: @Jhih he
const assert = require('node:assert/strict');
const { surveyUploadFailure, surveyStatusTone, surveyRecordOutcome } = require('../work/xiangshi-upload-api/upload-outcome');
const failure = surveyUploadFailure('完成订单回写', true, Object.assign(Error('登录已失效'), { needsLogin: true }));
assert.equal(failure.summary, '已保存 · 回写待核实');
assert.equal(failure.saved, true);
assert.equal(failure.needsLogin, true);
assert.match(failure.message, /步骤：完成订单回写/);
assert.match(failure.message, /原因：登录已失效/);
assert.equal(surveyUploadFailure('保存订单', false, Error('timeout')).summary, '保存未确认');
for (const state of ['重拍可上传', '已接单可上传']) assert.equal(surveyStatusTone(state), 'success');
assert.equal(surveyStatusTone('无效 · 未找到可上传订单'), 'error');
const values = new Map();
global.localStorage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
surveyRecordOutcome('HS000000000001', { orderID: 1, links: ['https://example.test/a'], stage: '保存订单', xiangShiToken: 'must-not-persist', password: 'must-not-persist' });
surveyRecordOutcome('HS000000000001', { saved: true, stage: '完成' });
const receipt = JSON.parse([...values.values()][0]);
assert.deepEqual(receipt.links, ['https://example.test/a']);
assert.equal(receipt.saved, true);
assert.equal(receipt.stage, '完成');
assert.ok(!Object.hasOwn(receipt, 'xiangShiToken'));
assert.ok(!Object.hasOwn(receipt, 'password'));
delete global.localStorage;
console.log('survey detailed outcomes and receipt privacy passed');

const preSave = surveyUploadFailure('保存前核对', false, Error('fixture'));
assert.equal(preSave.summary, '未保存 · 核对失败');
assert.match(preSave.message, /保存请求尚未发送/);
