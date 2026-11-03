// Author: @Jhih he
function surveyUploadFailure(stage, saved, error) {
    const reason = error?.message || String(error);
    const summary = saved ? (stage === '完成订单回写' ? '已保存 · 回写待核实' : '已保存 · 核对未通过')
        : stage === '保存订单' ? '保存未确认' : '上传未完成';
    const failure = new Error(`步骤：${stage}\n原因：${reason}\n${saved ? '服务器已确认图片保存成功，后续步骤未完成核实。' : '尚未取得图片保存成功的确认。'}\n已停止，不会自动重复提交。请先核对订单。`);
    Object.assign(failure, { summary, stage, saved, needsLogin: !!error?.needsLogin });
    return failure;
}

function surveyStatusTone(text) {
    if (['重拍可上传', '已接单可上传', '完成'].includes(text)) return 'success';
    if (text.startsWith('无效') || /失败|未通过|未完成/.test(text)) return 'error';
    if (/未确认|待核实/.test(text)) return 'warning';
    return 'neutral';
}

function surveyRecordOutcome(number, fields) {
    if (!/^HS\d{12}$/.test(number) || typeof localStorage === 'undefined') return;
    const key = `xhj-survey-receipt:${number}`;
    let previous = {};
    try { previous = JSON.parse(localStorage.getItem(key) || '{}'); } catch (_) {}
    const allowed = ['orderID', 'links', 'orientationID', 'stage', 'saved', 'error'];
    const safe = Object.fromEntries(Object.entries(fields).filter(([key]) => allowed.includes(key)));
    localStorage.setItem(key, JSON.stringify({ ...previous, ...safe, updated: new Date().toISOString() }));
}

if (typeof module !== 'undefined') module.exports = { surveyUploadFailure, surveyStatusTone, surveyRecordOutcome };
