const assert = require('node:assert/strict');
const { findSurveyOrders } = require('../work/xiangshi-upload-api/order-query');
(async () => {
    const number = 'HS000000000001';
    const pages = [];
    const result = await findSurveyOrders(number, async (url, body) => {
        assert.equal(url, '/houseadmin/house/index.html');
        pages.push(body.page);
        return { code: 0, count: 2, data: [{ id: body.page, houseSourceNumber: body.page === '1' ? number : `${number}1` }] };
    });
    assert.deepEqual(pages, ['1', '2']);
    assert.equal(result.length, 1);
    await assert.rejects(findSurveyOrders(number, async () => ({ code: 0, count: 2, data: [] })), /分页不完整/);
    await assert.rejects(findSurveyOrders(number, async () => ({ code: 0, count: 2, data: [{ id: 1 }] })), /重复/);
    await assert.rejects(findSurveyOrders(number, async () => ({ code: 0, data: [] })), /响应不完整/);
    console.log('survey order query passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
