// Reads generated scalar fields without executing the platform's script.
function readSurveyPageContext(source, expectedNumber, expectedOrderID) {
    const start = source.indexOf('var arr = {');
    const end = source.indexOf('};', start);
    if (start < 0 || end < 0) throw new Error('无法识别当前页面保存参数');
    const block = source.slice(start, end).replace(/\/\/[^\n]*/g, '');
    function scalar(key) {
        const match = block.match(new RegExp('(?:^|[,{\\s])' + key + '\\s*:\\s*(?:[\"\']([^\"\']*)[\"\']|([0-9]+))\\s*[,}]'));
        if (!match) throw new Error(`页面缺少保存字段：${key}`);
        return match[1] === undefined ? Number(match[2]) : match[1];
    }
    const fields = {};
    for (const key of ['xiangShiToken', 'account', 'housePhotographyId', 'saleorrentid', 'hosuetype', 'housesourceid', 'diskSourceType', 'houseNo', 'lpid', 'inputType']) {
        fields[key] = scalar(key);
    }
    if (fields.houseNo !== expectedNumber || String(fields.housePhotographyId) !== String(expectedOrderID)) {
        throw new Error('上传页面与当前订单不匹配');
    }
    if (typeof fields.xiangShiToken !== 'string' || !fields.xiangShiToken) throw new Error('页面授权参数为空');
    return fields;
}

if (typeof module !== 'undefined') module.exports = { readSurveyPageContext };
