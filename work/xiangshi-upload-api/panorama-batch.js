// Author: @Jhih he
function panoramaImageConcurrency(value) {
    return [4, 8, 12, 16, 20].includes(Number(value)) ? Number(value) : 20;
}
function panoramaHouseConcurrency(value) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 1 && number <= 5 ? number : 1;
}
// One pool is shared by all houses; a slot includes file upload, association and readback.
function createPanoramaTaskPool(limit) {
    let active = 0, stopped;
    const queue = [];
    function stop(error) {
        if (stopped) return;
        stopped = Object.assign(new Error('本批已因其他房源或图片任务失败停止，请先核对失败项'), {
            needsLogin: Boolean(error.needsLogin), batchStopped: true
        });
        for (const task of queue.splice(0)) task.reject(stopped);
    }
    function drain() {
        while (!stopped && active < limit && queue.length) {
            const task = queue.shift(); active++;
            Promise.resolve().then(task.operation).then(task.resolve, error => {
                stop(error); task.reject(error);
            }).finally(() => { active--; drain(); });
        }
    }
    return {
        run: operation => new Promise((resolve, reject) => {
            if (stopped) { reject(stopped); return; }
            queue.push({ operation, resolve, reject }); drain();
        }),
        stop
    };
}
async function runPanoramaBatch(items, operation, { houses = 1, images = 20, finish = async (_, value) => value } = {}) {
    const housePool = createPanoramaTaskPool(panoramaHouseConcurrency(houses));
    const imagePool = createPanoramaTaskPool(panoramaImageConcurrency(images));
    const started = new Set();
    const results = await Promise.allSettled(items.map(async item => {
        const uploaded = await housePool.run(async () => {
            started.add(item);
            try { return await operation(item, imagePool.run); }
            catch (error) { imagePool.stop(error); throw error; }
        });
        // Coordinate work has no house/upload slot and cannot stop unrelated uploads.
        return finish(item, uploaded);
    }));
    return results.map((result, index) => ({ ...result, item: items[index], started: started.has(items[index]) }));
}
if (typeof module !== 'undefined') module.exports = { panoramaImageConcurrency, panoramaHouseConcurrency, createPanoramaTaskPool, runPanoramaBatch };
