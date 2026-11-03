// Network operations are supplied by the application adapter.
async function runSurveyUpload(plan, api, report = () => {}, concurrency = 8) {
    if (![4, 8, 12, 16, 20].includes(concurrency)) throw new Error('并发数必须为 4、8、12、16 或 20');
    let currentStage = '检查房源';
    let saved = false;
    const set = (stage, detail = '') => { currentStage = stage; report({ stage, detail }); };
    try {
    if (!plan || plan.errors.length || !plan.cover) throw new Error('房源信息不完整');
    set('查找订单');
    const orders = await api.findOrders(plan.houseNumber);
    if (!Array.isArray(orders)) throw new Error('订单查询结果不完整');
    const matches = orders.filter(order => order.houseSourceNumber === plan.houseNumber && [1, 3].includes(Number(order.state)));
    if (matches.length !== 1) throw new Error(matches.length ? '房源对应多个订单' : '未找到对应订单');
    const order = matches[0];
    if (![1, 3].includes(Number(order.state))) throw new Error('订单状态不可上传');
    set('读取订单');
    const context = await api.readOrder(order, plan.direction);
    if (!context || !context.ready) throw new Error('订单或朝向信息不完整');
    const uploaded = [];
    const files = [plan.cover, ...plan.images.filter(file => file !== plan.cover)];
    for (let offset = 0; offset < files.length;) {
        const batch = files.slice(offset, offset + (offset === 0 ? 1 : concurrency));
        set('上传图片', `${uploaded.length + 1}–${uploaded.length + batch.length}/${files.length}`);
        const results = await Promise.allSettled(batch.map(file => api.uploadImage(file)));
        const failure = results.find(result => result.status === 'rejected');
        if (failure) throw failure.reason;
        for (let index = 0; index < results.length; index++) {
            const image = results[index].value;
            if (!image || !image.link || !image.originalName) throw new Error(`图片上传结果不完整：${batch[index].name}`);
            uploaded.push(image);
        }
        offset += batch.length;
    }
    set('保存前核对');
    const payload = await api.prepareSave(order, context, uploaded);
    if (!payload) throw new Error('无法构造保存数据');
    set('保存订单');
    const result = await api.saveOrder(payload);
    if (!result || result.success !== true) throw new Error(result?.reason || '保存未确认成功');
    saved = true;
    set('完成订单回写');
    if (await api.finalizeOrder(order, context) !== true) throw new Error('订单回写未确认');
    set('核实订单');
    if (await api.verifyOrder(order, context, uploaded) !== true) throw new Error('保存后结果不一致');
    const refreshed = await api.findOrders(plan.houseNumber);
    const same = Array.isArray(refreshed) ? refreshed.filter(item => String(item.id) === String(order.id) && item.houseSourceNumber === plan.houseNumber) : [];
    if (same.length !== 1 || Number(same[0].state) !== 1) throw new Error('图片已提交，但订单有效状态未核实，请检查订单');
    set('完成');
    return { order, uploaded: uploaded.length };
    } catch (error) {
        const makeFailure = typeof surveyUploadFailure === 'function' ? surveyUploadFailure : require('./upload-outcome').surveyUploadFailure;
        throw makeFailure(currentStage, saved, error);
    }
}

if (typeof module !== 'undefined') module.exports = { runSurveyUpload };
