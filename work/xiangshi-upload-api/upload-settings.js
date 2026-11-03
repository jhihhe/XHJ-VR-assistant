// Author: @Jhih he
const surveyConcurrencyOptions = [4, 8, 12, 16, 20];
function surveyConcurrency(value) {
    return surveyConcurrencyOptions.includes(Number(value)) ? Number(value) : 8;
}
function surveyDailyDirectory(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date);
    const part = type => parts.find(item => item.type === type).value;
    return `/Users/mac/Pictures/工作/${part('year')}相片/${part('month')}月/${part('month')}${part('day')}贺志`;
}
function surveyFolderFields(name, number, direction) {
    const [before, after = ''] = name.split(number);
    const prefix = before.trim().match(/^(\d+)[.．、]\s*(.*)$/);
    const rest = after.trim().split(/\s+/).filter(Boolean);
    if (rest.at(-1) === direction) rest.pop();
    return { sequence: prefix?.[1] || '', person: prefix?.[2] || before.trim(),
        store: rest.length >= 3 ? rest[0] : '',
        property: rest.length >= 3 ? rest.slice(1, -1).join(' ') : rest.join(' '),
        unit: rest.length >= 3 ? rest.at(-1) : '' };
}
function surveyOrderDisplay(orders) {
    const eligible = orders.filter(order => [1, 3].includes(Number(order.state)));
    if (!eligible.length) return '无效 · 未找到可上传订单';
    if (eligible.length > 1) return '无效 · 对应多个可上传订单';
    return Number(eligible[0].state) === 1 ? '重拍可上传' : '已接单可上传';
}
if (typeof module !== 'undefined') module.exports = { surveyConcurrencyOptions, surveyConcurrency, surveyDailyDirectory, surveyFolderFields, surveyOrderDisplay };
