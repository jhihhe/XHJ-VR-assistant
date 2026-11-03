// Same-origin request contract observed in the live Layui order page.
async function findSurveyOrders(houseNumber, request) {
    if (!/^HS\d{12}$/.test(houseNumber)) throw new Error('房源编号格式不正确');
    const rows = [];
    const seen = new Set();
    let total;
    for (let page = 1; ; page++) {
        const result = await request('/houseadmin/house/index.html', {
            flag: '1', key: houseNumber, status: '', page: String(page), limit: '90'
        });
        if (!result || Number(result.code) !== 0 || !Array.isArray(result.data)
            || !Number.isSafeInteger(Number(result.count)) || Number(result.count) < 0) {
            throw new Error('订单查询响应不完整');
        }
        if (total === undefined) total = Number(result.count);
        if (total !== Number(result.count)) throw new Error('查询期间订单列表变化，请重新查询');
        for (const row of result.data) {
            if (row.id == null || seen.has(String(row.id))) throw new Error('订单分页存在重复或缺少编号');
            seen.add(String(row.id));
            rows.push(row);
        }
        if (rows.length === total) return rows.filter(row => row.houseSourceNumber === houseNumber);
        if (rows.length > total || !result.data.length) throw new Error('订单分页不完整');
    }
}

if (typeof module !== 'undefined') module.exports = { findSurveyOrders };
