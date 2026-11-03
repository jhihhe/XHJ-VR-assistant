// Shared folder recognition for the survey uploader. No network or file writes.
function planFolder(name, files) {
    const ids = name.match(/HS\d{12}(?!\d)/gi) || [];
    if (!ids.length) return null;
    const errors = [];
    if (ids.length !== 1) errors.push('房源编号不唯一');
    const direction = name.trim().match(/(?:^|\s)(东|南|西|北)$/)?.[1] || null;
    if (!direction) errors.push('无法识别朝向');
    const images = files.filter(file => /\.jpe?g$/i.test(file.name) && !file.name.startsWith('._'))
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN', { numeric: true }));
    const cover = images.find(file => /^客厅[（(]/.test(file.name)) || null;
    if (!cover) errors.push('未找到客厅封面');
    if (!images.length) errors.push('没有 JPG 图片');
    return { name, houseNumber: ids[0].toUpperCase(), direction, cover, images, errors };
}

if (typeof module !== 'undefined') module.exports = { planFolder };
