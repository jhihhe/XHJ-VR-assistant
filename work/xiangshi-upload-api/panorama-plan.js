// Author: @Jhih he
function panoramaDailyDirectory(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date);
    const part = type => parts.find(item => item.type === type).value;
    return `/Users/mac/Pictures/工作/${part('year')}VR/${part('month')}月/${part('month')}${part('day')}`;
}

// Entries carry paths relative to one house folder, never the selected daily root.
function planPanoramaFolder(name, entries) {
    const ids = name.match(/HS\d{12}(?!\d)/gi) || [];
    if (!ids.length) return null;
    const errors = [];
    if (ids.length !== 1) errors.push('房源编号不唯一');
    const direction = name.trim().match(/(?:^|\s)(东|南|西|北)$/)?.[1] || null;
    if (!direction) errors.push('无法识别朝向');
    const floors = new Map([[1, []]]);
    for (const entry of entries) {
        const path = entry.relativePath || entry.name;
        const parts = path.split('/');
        if (parts.some(part => part.startsWith('.')) || !/\.jpe?g$/i.test(parts.at(-1))) continue;
        if (parts.length > 2 || (parts.length === 2 && parts[0] !== '2')) {
            errors.push(`不支持的图片子目录：${parts.slice(0, -1).join('/')}`);
            continue;
        }
        const floor = parts.length === 1 ? 1 : 2;
        if (!floors.has(floor)) floors.set(floor, []);
        const file = entry.file || entry;
        if (file.size > 50 * 1024 * 1024) errors.push(`图片超过50MB：${parts.at(-1)}`);
        floors.get(floor).push({ file, relativePath: path, room: parts.at(-1).replace(/\.jpe?g$/i, '') });
    }
    if (!floors.get(1).length) errors.push('一层没有 JPG 全景图片');
    const result = [...floors].sort(([a], [b]) => a - b).map(([floor, images]) => ({
        floor, images: images.sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'zh-CN', { numeric: true }))
    }));
    return { name, houseNumber: ids[0].toUpperCase(), direction, floors: result,
        count: result.reduce((sum, floor) => sum + floor.images.length, 0), errors: [...new Set(errors)] };
}

if (typeof module !== 'undefined') module.exports = { panoramaDailyDirectory, planPanoramaFolder };
