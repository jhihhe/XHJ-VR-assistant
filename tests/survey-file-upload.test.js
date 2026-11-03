const assert = require('node:assert/strict');
const { uploadSurveyImage } = require('../work/xiangshi-upload-api/file-upload');
(async () => {
    const file = new File(['image'], '客厅(1)1.jpg', { type: 'image/jpeg' });
    let calls = 0;
    const result = await uploadSurveyImage(file, async (url, options) => {
        calls++;
        assert.equal(url, 'https://files.xhj.com/oss/endpoint/put-file');
        assert.equal(options.method, 'POST');
        assert.equal(options.body.get('type'), '1');
        assert.equal(options.body.get('sysType'), '1');
        assert.equal(options.body.get('cityId'), '1');
        assert.equal(options.body.get('file').name, file.name);
        return { ok: true, json: async () => ({ data: { originalName: file.name, link: 'https://example.test/image.jpg' } }) };
    });
    assert.equal(result.originalName, file.name);
    assert.equal(calls, 1);
    await assert.rejects(uploadSurveyImage(file, async () => ({ ok: true, json: async () => ({ data: { originalName: 'other.jpg', link: 'https://example.test/image.jpg' } }) })), /不匹配/);
    await assert.rejects(uploadSurveyImage(file, async () => ({ ok: false })), /上传失败/);
    console.log('survey file upload passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
