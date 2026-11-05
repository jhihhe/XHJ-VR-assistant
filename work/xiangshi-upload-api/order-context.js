// Author: @Jhih he
// JSON object property order is not part of the image content. Array order remains significant.
function surveyImageSnapshot(value) {
    function canonical(item) {
        if (Array.isArray(item)) return item.map(canonical);
        if (item && typeof item === 'object') return Object.fromEntries(Object.keys(item).sort().map(key => [key, canonical(item[key])]));
        return item;
    }
    return JSON.stringify(canonical(value ?? null));
}

async function loadSurveyContext(order, direction, request, parsePage) {
    const params = new URLSearchParams();
    const mapping = { id: 'surveyId', lpid: 'lpid', oid: 'id', saleOrRentid: 'saleOrRentid', housetype: 'housetype', housesourceid: 'housesourceid', houseSourceNumber: 'houseSourceNumber' };
    for (const [key, field] of Object.entries(mapping)) {
        if (key !== 'id' && order[field] == null) throw new Error(`订单缺少字段：${field}`);
        params.set(key, order[field] == null ? 'null' : String(order[field]));
    }
    const pageURL = `/houseadmin/house/add_fk_image.html?${params}`;
    const page = await request(pageURL, 'text');
    const fields = parsePage(page, order.houseSourceNumber, order.id);
    const detail = await request(`https://api.xhj.com/api/xhj-bms/houseSurveyApply/xiangshi/detail?id=${encodeURIComponent(order.id)}`, 'json');
    if (Number(detail?.code) !== 200 || !detail.data || Array.isArray(detail.data)) throw new Error('订单详情响应无效');
    const base = 'https://api.xhj.com/api/xhj-bms/houseSurveyImg/xiangshi/getSystemInfoBySid?sid=';
    const roomsResult = await request(base + '1091', 'json');
    const directionsResult = await request(base + '12', 'json');
    for (const result of [roomsResult, directionsResult]) {
        if (!result || Number(result.code) !== 200 || !Array.isArray(result.data)) throw new Error('房间或朝向字典响应无效');
    }
    const directions = directionsResult.data.filter(item => item.name === direction);
    if (directions.length !== 1 || directions[0].id == null) throw new Error('无法唯一匹配朝向');
    if (!roomsResult.data.some(item => item.name === '客厅' && item.id != null)) throw new Error('房间字典缺少客厅');
    return { ready: true, pageURL, fields, rooms: roomsResult.data, orientationId: directions[0].id, hxType: detail.data.hxType ?? null,
        originalImages: surveyImageSnapshot(detail.data.houseSurveyImgVO) };
}

if (typeof module !== 'undefined') module.exports = { loadSurveyContext, surveyImageSnapshot };
