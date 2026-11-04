// Author: @Jhih he
function panoramaPhotographerIDs(html) {
    const select = html.match(/<select\b[^>]*\bid=["']uid["'][^>]*>([\s\S]*?)<\/select>/i)?.[1];
    if (!select) throw new Error('无法读取摄影师选项，未完成跨摄影师查询');
    return [...new Set([...select.matchAll(/<option\b[^>]*\bvalue=["'](\d+)["']/gi)].map(match => match[1]).filter(id => Number(id) > 0))];
}
function panoramaPhotographers(html) {
    const source = html.match(/<select\b[^>]*\bid=["']uid["'][^>]*>([\s\S]*?)<\/select>/i)?.[1] || '';
    const options = [...source.matchAll(/<option\b[^>]*\bvalue=["'](\d+)["'][^>]*>([^<]*)/gi)];
    return panoramaPhotographerIDs(html).map(id => ({ id, name: options.find(option => option[1] === id)?.[2].trim() || `摄影师#${id}` }));
}
function createPanoramaAPI(request = fetch, firstPhotographer = null) {
    async function response(url, options = {}) {
        const result = await request(url, { credentials: url.startsWith('/') ? 'same-origin' : 'omit',
            signal: AbortSignal.timeout(180000), ...options });
        if (result.redirected && /\/login\//.test(result.url || '')) throw Object.assign(new Error('登录已失效，请重新登录象视'), { needsLogin: true });
        if (!result.ok || result.redirected) throw new Error(`全景接口失败：HTTP ${result.status}`);
        return result;
    }
    async function form(url, body, options = {}) {
        return (await response(url, { method: 'POST', headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest'
        }, body: new URLSearchParams(body), ...options })).json();
    }
    function success(result, stage) {
        if (!(Number(result.code) > 0)) throw new Error(`${stage}失败：${String(result.msg || result.info || result.code).slice(0, 160)}`);
        return result;
    }
    async function rows(url, body) {
        const output = [], ids = new Set();
        let expected;
        for (let page = 1; ; page++) {
            const result = await form(url, { ...body, page, limit: 90 });
            const count = Number(result.count);
            if (Number(result.code) !== 0 || !Array.isArray(result.data) || !Number.isInteger(count) || count < 0) throw new Error('全景清单响应无效');
            if (expected !== undefined && count !== expected) throw new Error('全景清单正在变化，请重新查询');
            expected = count;
            for (const row of result.data) {
                if (!row.id || ids.has(String(row.id))) throw new Error('全景分页缺少编号或重复');
                ids.add(String(row.id)); output.push(row);
            }
            if (output.length === count) return output;
            if (!result.data.length || output.length > count) throw new Error('全景清单分页不完整');
        }
    }
    return {
        photographers: async () => panoramaPhotographers(await (await response('/houseadmin/pano/index.html')).text()),
        findOrders: async (number, progress = () => {}) => {
            if (!/^HS\d{12}$/.test(number)) throw new Error('房源编号无效');
            const found = new Map(), searched = new Set();
            async function search(uid, name = '当前工号', index = 0, total = 0) {
                uid = String(uid);
                if (found.size || searched.has(uid)) return;
                searched.add(uid);
                for (const type of [1, 2]) {
                    progress(`${index ? `跨摄影师 ${name}（${index}/${total}）` : name} · ${type === 1 ? '待处理' : '全部'}`);
                    const results = await rows('/houseadmin/pano/index.html', { key: number, type, status: 0, uid, fb_uid: 0, sc_uid: 0, city: 0, startTime: '', endTime: '', startTimes: '', endTimes: '' });
                    for (const row of results) if (row.house_nums === number) found.set(String(row.id), row);
                }
            }
            await search(0);
            if (firstPhotographer && /^\d+$/.test(firstPhotographer.id)) {
                await search(firstPhotographer.id, `首查摄影师 ${firstPhotographer.name}`);
            }
            let cached;
            const cacheKey = `xhj-panorama-photographer:${number}`;
            try { cached = JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch (_) {}
            if (cached && /^\d+$/.test(cached.id) && Number(cached.id) > 0) {
                progress(`优先检索上次摄影师 ${cached.name || '#' + cached.id}`);
                await search(cached.id, `上次摄影师 ${cached.name || '#' + cached.id}`);
                if (found.size) return [...found.values()];
            }
            await search(0);
            if (!found.size) {
                const html = await (await response('/houseadmin/pano/index.html')).text();
                const photographers = panoramaPhotographers(html).filter(person => !searched.has(person.id));
                for (const [index, { id: uid, name: label }] of photographers.entries()) {
                    await search(uid, label, index + 1, photographers.length);
                    if (found.size) {
                        try { localStorage.setItem(cacheKey, JSON.stringify({ id: uid, name: label })); } catch (_) {}
                        break;
                    }
                }
            }
            return [...found.values()];
        },
        listImages: order => rows('/houseadmin/pano/image.html', { order_id: order.id }),
        fingerprint: async file => [...new Uint8Array(await crypto.subtle.digest('SHA-256', await file.arrayBuffer()))].map(value => value.toString(16).padStart(2, '0')).join(''),
        validateImage: async file => {
            if (!file || !/\.jpe?g$/i.test(file.name) || file.size <= 0 || file.size > 50 * 1024 * 1024) throw new Error(`全景图片无效或超过50MB：${file?.name || ''}`);
            const bitmap = await createImageBitmap(file);
            try { if (bitmap.width !== bitmap.height * 2) throw new Error(`全景图必须为2:1：${file.name}`); } finally { bitmap.close(); }
        },
        uploadFile: async file => {
            const data = new FormData(); data.append('file', file, file.name);
            const result = success(await (await response('/houseadmin/up_files/image_upload.html', { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' }, body: data })).json(), '图片文件上传');
            if (result.info !== file.name.replace(/\.jpe?g$/i, '') || typeof result.url !== 'string' || !/^\/uploads\/[a-zA-Z0-9/_.-]+$/.test(result.url)) throw new Error('全景文件上传响应不匹配');
            return result.url;
        },
        addImage: async (order, image, url, floor) => success(await form(`/houseadmin/pano/add_image.html?order_id=${encodeURIComponent(order.id)}`, {
            order_id: order.id, image_name: image.room, image_url: url, image_nums: '', image_area: '', storey: floor
        }), '关联全景图片'),
        retake: async order => {
            if (Number(order.status) !== 5) throw new Error('当前全景状态不支持平台重拍入口');
            const html = await (await response(`/houseadmin/pano/invalid.html?id=${encodeURIComponent(order.id)}`)).text();
            const number = html.match(/const\s+house_nums\s*=\s*'([^']+)'/)?.[1];
            const token = html.match(/xiangShiToken\s*=\s*'([^']+)'/)?.[1];
            if (number !== order.house_nums || !token || !/title=["']重拍["']/.test(html)) throw new Error('重拍页面参数不匹配，未修改订单');
            const removed = await (await response('https://api.xhj.com/api/xhj-bms/houseSurveyImg/xiangshi/removedVr', {
                method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({ houseSourceNumber: number, xiangShiToken: token })
            })).json();
            if (Number(removed.code) !== 200) throw new Error('原VR下架失败，未提交重拍');
            success(await form(`/houseadmin/pano/invalid.html?id=${encodeURIComponent(order.id)}`, { id: order.id, flag: 2 }), '重拍转换');
        },
        generateCoordinates: async order => success(await form('/houseadmin/pano/add_image_point', { order_id: order.id }, { signal: AbortSignal.timeout(60000) }), '生成全景坐标'),
        generateImageCoordinates: async image => success(await form('/houseadmin/pano/add_image_points', { id: image.id }, { signal: AbortSignal.timeout(60000) }), '获取单张全景坐标'),
        saveDirection: async (order, direction) => {
            if (!['东', '南', '西', '北'].includes(direction)) throw new Error('朝向无效');
            return success(await form(`/houseadmin/pano/add_save.html?order_id=${encodeURIComponent(order.id)}`, {
                order_id: order.id, toward: direction, hxt: 1, remarks: ''
            }), '保存朝向');
        },
        readHistory: order => rows(`/houseadmin/pano/detail.html?id=${encodeURIComponent(order.id)}`, {})
    };
}
if (typeof module !== 'undefined') module.exports = { createPanoramaAPI, panoramaPhotographerIDs, panoramaPhotographers };
