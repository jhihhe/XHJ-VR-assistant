// Author: @Jhih he
function panoramaImageKey(floor, room) { return `${Number(floor)}\n${room}`; }
function panoramaManifest(plan) {
    return plan.floors.flatMap(floor => floor.images.map(image => ({ ...image, floor: floor.floor,
        key: panoramaImageKey(floor.floor, image.room) })));
}
function verifyPanoramaImages(expected, actual, receipt) {
    if (actual.length !== expected.length) throw new Error(`全景数量不符：本地${expected.length}张，服务器${actual.length}张`);
    for (const image of expected) {
        const matches = actual.filter(row => panoramaImageKey(row.storey, row.image_name) === image.key);
        const recorded = receipt.images[image.key];
        if (matches.length !== 1 || !recorded || String(matches[0].id) !== String(recorded.id) || matches[0].image_url !== recorded.url) throw new Error(`全景核对失败：${image.floor}层 ${image.room}`);
    }
}
function verifyPanoramaCoordinates(images) {
    const missing = images.filter(image => !image.point || image.point === '0' || (typeof image.point === 'string' && !image.point.trim()));
    if (!images.length || missing.length) throw new Error(`全景坐标未齐：${missing.length}/${images.length}张未获取${missing.length ? '（' + missing.map(image => `${image.storey}层 ${image.image_name}`).join('、') + '）' : ''}，未保存朝向`);
}
async function ensurePanoramaCoordinates(order, api, expected, receipt) {
    let images = await api.listImages(order);
    verifyPanoramaImages(expected, images, receipt);
    if (images.some(image => !image.point || image.point === '0' || (typeof image.point === 'string' && !image.point.trim()))) {
        await api.generateCoordinates(order);
        images = await api.listImages(order);
        verifyPanoramaImages(expected, images, receipt);
    }
    verifyPanoramaCoordinates(images);
}
async function runPanoramaUpload(plan, api, { concurrency = 20, onProgress = () => {}, receipt, persist = () => {}, allowRetake = false, transfer = operation => operation() } = {}) {
    let stage = '检查文件';
    const manifest = panoramaManifest(plan);
    const emit = (name, detail = '') => { stage = name; onProgress({ stage, detail }); };
    try {
        if (plan.errors.length) throw new Error(plan.errors.join('；'));
        if (new Set(manifest.map(x => x.key)).size !== manifest.length) throw new Error('同一楼层存在重复房间名称');
        // Validate the whole batch before changing any remote order.
        for (const image of manifest) {
            await api.validateImage(image.file);
            image.digest = await api.fingerprint(image.file);
        }
        emit('查询全景订单');
        const orders = await api.findOrders(plan.houseNumber, detail => onProgress({ stage: '查询全景订单', detail }));
        if (orders.length !== 1) throw new Error(orders.length ? '对应多个全景订单，请核对' : '未找到全景订单（已跨摄影师查询）');
        let order = orders[0];
        if (Number(order.status) === 5) {
            if (!allowRetake) throw Object.assign(new Error('需要重拍：将下架原VR和户型图后恢复未上传状态'), { requiresRetake: true });
            emit('转为重拍'); await api.retake(order);
            const updated = await api.findOrders(plan.houseNumber, detail => onProgress({ stage: '查询全景订单', detail }));
            if (updated.length !== 1 || String(updated[0].id) !== String(order.id) || Number(updated[0].status) !== 1) throw new Error('重拍后未确认上传权限，已停止');
            order = updated[0];
            receipt = undefined;
        }
        if (![1, 2].includes(Number(order.status))) throw new Error(`全景状态${order.status}不可上传`);
        if (!receipt || String(receipt.orderID) !== String(order.id)) receipt = { orderID: String(order.id), houseNumber: plan.houseNumber, images: {}, directionSubmitted: false };
        if (receipt.saveAttempted) throw new Error('此前已尝试保存朝向，请打开订单核对，避免重复派单');
        let actual = await api.listImages(order);
        for (const row of actual) {
            const key = panoramaImageKey(row.storey, row.image_name), record = receipt.images[key];
            if (!manifest.some(image => image.key === key) || !record || String(record.id) !== String(row.id) || record.url !== row.image_url) throw new Error('订单已有未经本次核对的全景图片，请先打开订单检查，未重复上传');
            if (record.digest !== manifest.find(image => image.key === key).digest) throw new Error('本地图片与已上传记录不同，请核对重拍，未跳过或覆盖图片');
        }
        // Keep only records which are still present; deleted photos can be uploaded again.
        for (const key of Object.keys(receipt.images)) if (!actual.some(row => String(row.id) === String(receipt.images[key].id))) delete receipt.images[key];
        persist(receipt);
        let completed = actual.length;
        for (const floor of plan.floors) {
            emit('上传全景', `${floor.floor}层 · ${completed}/${manifest.length}`);
            const pending = manifest.filter(image => image.floor === floor.floor && !receipt.images[image.key]);
            let offset = 0;
            const limit = [4, 8, 12, 16, 20].includes(Number(concurrency)) ? Number(concurrency) : 20;
            while (offset < pending.length) {
                const batch = pending.slice(offset, offset + limit);
                const outcomes = await Promise.allSettled(batch.map(image => transfer(async () => {
                    const url = await api.uploadFile(image.file);
                    await api.addImage(order, image, url, floor.floor);
                    const current = await api.listImages(order);
                    const rows = current.filter(row => panoramaImageKey(row.storey, row.image_name) === image.key);
                    if (rows.length !== 1) throw new Error(`关联后未确认唯一图片：${image.room}`);
                    receipt.images[image.key] = { id: String(rows[0].id), url: rows[0].image_url, digest: image.digest, name: image.file.name, size: image.file.size, modified: image.file.lastModified };
                    persist(receipt); completed++;
                    onProgress({ stage: '上传全景', detail: `${floor.floor}层 · ${completed}/${manifest.length}` });
                })));
                const failure = outcomes.find(result => result.status === 'rejected');
                if (failure) throw failure.reason;
                offset += batch.length;
            }
        }
        emit('核对全景图片'); actual = await api.listImages(order);
        verifyPanoramaImages(manifest, actual, receipt);
        emit('获取并核对全景坐标');
        await ensurePanoramaCoordinates(order, api, manifest, receipt);
        emit('图片及坐标已就绪 · 朝向未提交', `${manifest.length}张 · ${plan.floors.length}层`);
        return { order, receipt };
    } catch (error) {
        throw Object.assign(new Error(`${stage}：${error.message}。已停止，不会自动提交朝向或重试。`), {
            stage, needsLogin: Boolean(error.needsLogin), requiresRetake: Boolean(error.requiresRetake)
        });
    }
}
async function runPanoramaSave(plan, api, receipt, persist = () => {}, progress = () => {}) {
    progress('查询全景订单');
    if (!receipt || receipt.directionSubmitted || receipt.saveAttempted) throw new Error('没有待提交记录，或已尝试提交；请核对订单，避免重复派单');
    const orders = await api.findOrders(plan.houseNumber, progress);
    if (orders.length !== 1 || String(orders[0].id) !== String(receipt.orderID) || ![1, 2].includes(Number(orders[0].status))) throw new Error('订单状态变化，未提交朝向');
    const order = orders[0];
    const manifest = panoramaManifest(plan);
    for (const image of manifest) if (receipt.images[image.key]?.digest !== await api.fingerprint(image.file)) throw new Error('本地图片变化，未提交朝向');
    verifyPanoramaImages(manifest, await api.listImages(order), receipt);
    progress('获取并核对全部坐标');
    await ensurePanoramaCoordinates(order, api, manifest, receipt);
    const before = new Set((await api.readHistory(order)).map(row => String(row.id)));
    // Mark intent first. A lost response must never trigger an automatic repeat.
    progress('保存朝向 · 等待服务器');
    receipt.saveAttempted = true; persist(receipt);
    try {
        await api.saveDirection(order, plan.direction);
        receipt.directionSubmitted = true; persist(receipt);
        const after = await api.readHistory(order);
        if (!after.some(row => !before.has(String(row.id)) && String(row.title).includes('保存'))) throw new Error('接口已接受，但操作详情尚未确认新增保存记录');
        receipt.saveVerified = true; persist(receipt);
        return receipt;
    } catch (error) {
        throw Object.assign(new Error(`保存朝向结果待核实：${error.message}。请打开订单核对，不要重复提交。`), {
            needsLogin: Boolean(error.needsLogin), stage: '保存朝向'
        });
    }
}
if (typeof module !== 'undefined') module.exports = { verifyPanoramaCoordinates, ensurePanoramaCoordinates, panoramaImageKey, panoramaManifest, verifyPanoramaImages, runPanoramaUpload, runPanoramaSave };
