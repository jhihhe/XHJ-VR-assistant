// Mirrors the observed page's room grouping and first-room orientation.
function buildImagePayload(images, rooms, orientationId) {
    if (!images.length || orientationId == null) throw new Error('缺少图片或朝向');
    const groups = [];
    for (const image of images) {
        if (!image.link || !image.originalName) throw new Error('图片响应不完整');
        const name = image.originalName.replace(/\.jpg$/i, '').replace(/\s/g, '').split('(')[0];
        const room = rooms.find(item => item.name === name) || rooms.find(item => item.name === '其他');
        if (!room || room.id == null) throw new Error('房间字典不完整');
        let group = groups.find(item => item.roomType === room.id);
        if (!group) {
            group = { roomType: room.id, images: [] };
            if (!groups.length) group.orientationId = orientationId;
            groups.push(group);
        }
        group.images.push({ imagepath: image.link, imagetype: 2 });
    }
    return groups.flatMap(group => group.images.map(image => ({
        ...image, roomType: group.roomType,
        ...(group.orientationId === undefined ? {} : { orientationId: group.orientationId }),
        windowType: '', length: '', width: '', high: '', size: ''
    })));
}

if (typeof module !== 'undefined') module.exports = { buildImagePayload };
