function createSurveyBrowserAPI(request = fetch) {
    async function response(url, options = {}) {
        const result = await request(url, { credentials: url.startsWith('/') ? 'same-origin' : 'omit', ...options });
        if (result.redirected && /\/login\//.test(result.url || '')) {
            throw Object.assign(new Error('登录已失效，请在象视重新登录'), { needsLogin: true });
        }
        if (!result.ok || result.redirected) throw new Error(`接口请求失败：HTTP ${result.status || '未知'}${result.redirected ? '，发生跳转' : ''}`);
        return result;
    }
    async function read(url, type) {
        const result = await response(url);
        return type === 'text' ? result.text() : result.json();
    }
    function form(url, body) {
        return response(url, { method: 'POST', headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        }, body: new URLSearchParams(body) });
    }
    return {
        sessionUsername: async () => {
            const source = await read('/houseadmin/user/index.html', 'text');
            const match = source.match(/\bvar\s+info\s*=\s*(\{[^\r\n]*\})\s*;/);
            if (!match) throw Object.assign(new Error('无法确认登录状态'), { needsLogin: true });
            const username = JSON.parse(match[1]).username;
            if (typeof username !== 'string' || !username || username.length > 128) throw new Error('无法读取工号');
            return username;
        },
        findOrders: number => findSurveyOrders(number, async (url, body) => (await form(url, body)).json()),
        readOrder: (order, direction) => loadSurveyContext(order, direction, read, readSurveyPageContext),
        uploadImage: file => uploadSurveyImage(file, request),
        prepareSave: async (order, context, images) => {
            const detail = await read(`https://api.xhj.com/api/xhj-bms/houseSurveyApply/xiangshi/detail?id=${encodeURIComponent(order.id)}`, 'json');
            if (Number(detail.code) !== 200 || JSON.stringify(detail.data?.houseSurveyImgVO ?? null) !== context.originalImages) throw new Error('上传期间原订单图片变化，未保存新图，请核对订单');
            const now = new Date();
            const pad = value => String(value).padStart(2, '0');
            const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            return prepareSurveySave(context.fields, buildImagePayload(images, context.rooms, context.orientationId), date, context.hxType);
        },
        saveOrder: async payload => {
            if (typeof surveyRecordOutcome === 'function') surveyRecordOutcome(payload.houseNo, {
                orderID: payload.housePhotographyId, links: payload.houseSurveyImages.map(image => image.imagepath),
                orientationID: payload.houseSurveyImages[0]?.orientationId, stage: '保存订单', saved: false, error: ''
            });
            const result = await response('https://api.xhj.com/api/xhj-bms/houseSurveyImg/xiangshi/save', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            const body = await result.json();
            return { success: Number(body.code) === 200, reason: `保存接口拒绝：code=${String(body.code ?? '缺失')}，${String(body.msg ?? body.message ?? '无原因说明').replace(String(payload.xiangShiToken || '___no_token___'), '[已隐藏授权信息]').slice(0, 160)}` };
        },
        finalizeOrder: async (order, context) => {
            await form(context.pageURL, { house_nums: order.houseSourceNumber });
            return true;
        },
        verifyOrder: async (order, context, images) => {
            const result = await read(`https://api.xhj.com/api/xhj-bms/houseSurveyApply/xiangshi/detail?id=${encodeURIComponent(order.id)}`, 'json');
            if (Number(result.code) !== 200 || !result.data) throw new Error('无法读取保存后的订单详情');
            const groups = result.data.houseSurveyImgVO?.inDoorImgVoList;
            if (!Array.isArray(groups)) throw new Error('保存详情缺少房间图片列表');
            if (!groups.length || String(groups[0].orientationId) !== String(context.orientationId)) throw new Error('首个房间朝向与文件夹朝向不一致');
            if (groups.slice(1).some(group => group.orientationId != null && !['', '0'].includes(String(group.orientationId)))) throw new Error('后续房间含朝向，预期只填写首个房间');
            const actual = groups.flatMap(group => (group.hsImgList || []).map(image => ({ ...image, orientationId: group.orientationId })));
            if (actual.length !== images.length) throw new Error(`图片数量不符：预期${images.length}张，服务器${actual.length}张`);
            if (actual[0]?.imagepath !== images[0].link) throw new Error('服务器首张图片不是本次客厅封面');
            const links = actual.map(image => image.imagepath).sort();
            if (JSON.stringify(links) !== JSON.stringify(images.map(image => image.link).sort())) throw new Error('服务器图片链接与本次上传不一致');
            return true;
        }
    };
}
