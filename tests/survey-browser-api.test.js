const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

(async () => {
    const scope = vm.createContext({ URL, URLSearchParams, FormData, File, Date, AbortSignal });
    for (const name of ['folder-plan', 'order-query', 'file-upload', 'image-payload', 'page-context', 'save-payload', 'order-context', 'browser-api', 'upload-outcome', 'upload-runner']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '../work/xiangshi-upload-api', `${name}.js`), 'utf8'), scope);
    }
    const number = 'HS000000000001';
    const order = { id: 2, houseSourceNumber: number, state: 3, lpid: 3, saleOrRentid: 4, housetype: 1, housesourceid: 5 };
    const source = `var arr = { xiangShiToken:'fixture', account:1, housePhotographyId:2, saleorrentid:4, hosuetype:1, housesourceid:5, diskSourceType:'1', houseNo:'${number}', lpid:3, inputType:1, };`;
    const calls = [];
    let saved;
    let wrongDirection = false;
    const request = async (url, options = {}) => {
        calls.push([url, options.method || 'GET']);
        const ok = body => ({ ok: true, redirected: false, json: async () => body, text: async () => body });
        if (url === '/houseadmin/house/index.html') return ok({ code: 0, count: 1, data: [{ ...order, state: saved ? 1 : order.state }] });
        if (url.startsWith('/houseadmin/house/add_fk_image.html')) return ok(options.method === 'POST' ? '' : source);
        if (url.includes('getSystemInfoBySid')) return ok({ code: 200, data: url.endsWith('1091') ? [{ name: '客厅', id: 1 }, { name: '卧室', id: 2 }] : [{ name: '北', id: 9 }] });
        if (url.includes('put-file')) {
            const file = options.body.get('file');
            return ok({ data: { originalName: file.name, link: `https://example.test/${encodeURIComponent(file.name)}` } });
        }
        if (url.endsWith('/save')) { saved = JSON.parse(options.body); return ok({ code: 200 }); }
        if (url.includes('/detail?') && !saved) return ok({ code: 200, data: { hxType: 7 } });
        if (url.includes('/detail?')) return ok({ code: 200, data: { houseSurveyImgVO: { inDoorImgVoList: saved.houseSurveyImages.map((image, index) => ({ orientationId: index > 0 ? (wrongDirection ? 9 : 0) : image.orientationId, hsImgList: [image] })) } } });
        throw Error(`Unexpected request ${url}`);
    };
    scope.request = request;
    scope.files = [new File(['bedroom'], '卧室(1)1.jpg'), new File(['cover'], '客厅(1)1.jpg')];
    const result = await vm.runInContext(`runSurveyUpload(planFolder('HS000000000001 楼盘 北', files), createSurveyBrowserAPI(request))`, scope);
    assert.equal(result.uploaded, 2);
    assert.equal(saved.houseSurveyImages[0].roomType, 1);
    assert.equal(saved.houseSurveyImages[0].orientationId, 9);
    assert.equal(saved.hxType, 7);
    assert.equal(Object.hasOwn(saved.houseSurveyImages[1], 'orientationId'), false);
    const saveIndex = calls.findIndex(([url]) => url.endsWith('/save'));
    assert.equal(calls[saveIndex + 1][1], 'POST');
    assert.ok(calls[saveIndex + 2][0].includes('/detail?'));
    assert.equal(calls.filter(([url]) => url.endsWith('/save')).length, 1);
    wrongDirection = true;
    saved = undefined;
    await assert.rejects(vm.runInContext(`runSurveyUpload(planFolder('HS000000000001 楼盘 北', files), createSurveyBrowserAPI(request))`, scope), /后续房间含朝向/);
    order.state = 1;
    wrongDirection = false;
    saved = undefined;
    calls.length = 0;
    await vm.runInContext(`runSurveyUpload(planFolder('HS000000000001 楼盘 北', files), createSurveyBrowserAPI(request))`, scope);
    assert.equal(calls.filter(([url]) => url.endsWith('/save')).length, 1);
    assert.ok(!calls.some(([url]) => /clear|reset|delete/.test(url)));
    saved = undefined;
    calls.length = 0;
    let reads = 0;
    scope.request = async (url, options) => {
        if (url.includes('/detail?') && ++reads === 2) return { ok: true, redirected: false, json: async () => ({ code: 200, data: { houseSurveyImgVO: { changed: true } } }) };
        return request(url, options);
    };
    await assert.rejects(vm.runInContext(`runSurveyUpload(planFolder('HS000000000001 楼盘 北', files), createSurveyBrowserAPI(request))`, scope), /原订单图片变化/);
    assert.equal(calls.filter(([url]) => url.endsWith('/save')).length, 0);
    console.log('survey browser API simulated workflow passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
