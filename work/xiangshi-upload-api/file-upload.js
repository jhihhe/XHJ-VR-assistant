// Form fields and response shape observed in the site's Element UI uploader.
async function uploadSurveyImage(file, request = fetch) {
    if (!file || !/\.jpg$/i.test(file.name) || file.size <= 0) throw new Error('图片文件无效');
    const form = new FormData();
    form.append('type', '1');
    form.append('sysType', '1');
    form.append('cityId', '1');
    form.append('file', file, file.name);
    const response = await request('https://files.xhj.com/oss/endpoint/put-file', {
        method: 'POST', body: form, signal: AbortSignal.timeout(60000)
    });
    if (!response.ok) throw new Error(`图片上传失败：${file.name}`);
    const result = await response.json();
    const image = result && result.data;
    if (!image || image.originalName !== file.name || typeof image.link !== 'string') {
        throw new Error(`图片上传响应不匹配：${file.name}`);
    }
    let url;
    try { url = new URL(image.link); } catch (_) { throw new Error('图片地址无效'); }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('图片地址无效');
    return { originalName: image.originalName, link: image.link };
}

if (typeof module !== 'undefined') module.exports = { uploadSurveyImage };
