const assert = require('node:assert/strict');
const { loadSurveyContext } = require('../work/xiangshi-upload-api/order-context');
(async () => {
    const order = { id: 2, lpid: 3, saleOrRentid: 4, housetype: 1, housesourceid: 5, houseSourceNumber: 'HS000000000001' };
    const request = async (url, type) => type === 'text' ? 'fixture' : url.includes('/detail?') ? { code: 200, data: { hxType: 7 } } : { code: 200, data: [{ name: url.endsWith('1091') ? '客厅' : '北', id: 9 }] };
    const context = await loadSurveyContext(order, '北', request, (source, number, id) => {
        assert.equal(source, 'fixture'); assert.equal(number, order.houseSourceNumber); assert.equal(id, order.id); return {};
    });
    assert.equal(context.orientationId, 9);
    assert.equal(new URL(context.pageURL, 'https://vr.xhj.com').searchParams.get('oid'), '2');
    await assert.rejects(loadSurveyContext(order, '南', request, () => ({})), /朝向/);
    await assert.rejects(loadSurveyContext({ ...order, lpid: null }, '北', request, () => ({})), /缺少字段/);
    console.log('survey order context passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
