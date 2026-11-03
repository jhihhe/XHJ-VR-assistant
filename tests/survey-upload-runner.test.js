const assert = require('node:assert/strict');
const { runSurveyUpload } = require('../work/xiangshi-upload-api/upload-runner');

(async () => {
    const cover = { name: '客厅(1)1.jpg' }, bedroom = { name: '卧室(1)1.jpg' };
    const plan = { houseNumber: 'HS000000000001', direction: '北', cover, images: [bedroom, cover], errors: [] };
    const calls = [];
    const api = {
        findOrders: async () => [{ id: 1, houseSourceNumber: plan.houseNumber, state: 1 }],
        readOrder: async (order, direction) => ({ ready: direction === '北' }),
        uploadImage: async file => { calls.push(file.name); return { link: file.name, originalName: file.name }; },
        prepareSave: async (_order, _context, images) => images,
        saveOrder: async () => { calls.push('save'); return { success: true }; },
        finalizeOrder: async () => { calls.push('finalize'); return true; },
        verifyOrder: async () => { calls.push('verify'); return true; }
    };
    await runSurveyUpload(plan, api);
    assert.deepEqual(calls, [cover.name, bedroom.name, 'save', 'finalize', 'verify']);
    let searches = 0;
    await runSurveyUpload(plan, { ...api, findOrders: async () => [
        { id: 2, houseSourceNumber: plan.houseNumber, state: 0 }, { id: 1, houseSourceNumber: plan.houseNumber, state: ++searches === 1 ? 3 : 1 }
    ] });
    calls.length = 0;
    await assert.rejects(runSurveyUpload(plan, { ...api, uploadImage: async () => { throw Error('network'); } }));
    assert.deepEqual(calls, []);
    await assert.rejects(runSurveyUpload(plan, { ...api, findOrders: async () => [
        { houseSourceNumber: plan.houseNumber, state: 1 }, { houseSourceNumber: plan.houseNumber, state: 3 }
    ] }), /多个订单/);
    calls.length = 0;
    await assert.rejects(runSurveyUpload(plan, { ...api, saveOrder: async () => { calls.push('save'); throw Error('timeout'); } }), error => error.summary === '保存未确认' && error.stage === '保存订单' && /timeout/.test(error.message));
    assert.equal(calls.filter(x => x === 'save').length, 1);
    assert.ok(!calls.includes('verify'));
    const extra = [{ name: 'a.jpg' }, { name: 'b.jpg' }, { name: 'c.jpg' }];
    const releases = new Map();
    let savedNames;
    const pending = runSurveyUpload({ ...plan, images: [cover, ...extra] }, {
        ...api,
        uploadImage: file => new Promise(resolve => releases.set(file.name, () => resolve({ link: file.name, originalName: file.name }))),
        prepareSave: async (_order, _context, images) => { savedNames = images.map(image => image.originalName); return images; }
    });
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual([...releases.keys()], [cover.name]);
    releases.get(cover.name)();
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual([...releases.keys()], [cover.name, ...extra.map(file => file.name)]);
    for (const file of [...extra].reverse()) releases.get(file.name)();
    await pending;
    assert.deepEqual(savedNames, [cover.name, ...extra.map(file => file.name)]);
    for (const concurrency of [4, 8, 12, 16, 20]) {
        const many = Array.from({ length: 24 }, (_, i) => ({ name: `${i}.jpg` }));
        const waiting = new Map();
        let stored;
        const run = runSurveyUpload({ ...plan, images: [cover, ...many] }, {
            ...api,
            uploadImage: file => new Promise(resolve => waiting.set(file.name, () => resolve({ link: file.name, originalName: file.name }))),
            prepareSave: async (_order, _context, images) => { stored = images.map(x => x.originalName); return images; }
        }, () => {}, concurrency);
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(waiting.size, 1);
        waiting.get(cover.name)();
        waiting.clear();
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(waiting.size, concurrency);
        let completed = 0;
        while (completed < many.length) {
            assert.ok(waiting.size <= concurrency);
            const batch = [...waiting.values()].reverse();
            waiting.clear();
            completed += batch.length;
            batch.forEach(release => release());
            await new Promise(resolve => setImmediate(resolve));
        }
        await run;
        assert.deepEqual(stored, [cover.name, ...many.map(x => x.name)]);
    }
    await assert.rejects(runSurveyUpload(plan, api, () => {}, 3), /并发数/);
    calls.length = 0;
    await assert.rejects(runSurveyUpload(plan, { ...api, finalizeOrder: async () => { calls.push('finalize'); throw Error('timeout'); } }), error => error.summary === '已保存 · 回写待核实' && error.saved === true && /timeout/.test(error.message));
    assert.equal(calls.filter(x => x === 'save').length, 1);
    assert.equal(calls.filter(x => x === 'finalize').length, 1);
    assert.ok(!calls.includes('verify'));
    console.log('survey upload runner passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
