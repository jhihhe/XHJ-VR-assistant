// Author: @Jhih he
(function () {
    if (location.pathname !== '/houseadmin/house/index.html') return;
    function mount() {
        const host = document.querySelector('.demoTable');
        if (!host || document.getElementById('xhj-survey-folders')) return;
        const panel = document.createElement('details');
        panel.id = 'xhj-survey-folders';
        panel.dataset.surveyVersion = '0.6.1';
        const style = document.createElement('style');
        style.textContent = `
            #xhj-survey-folders{box-sizing:border-box;width:100%;min-width:0;flex-basis:100%;margin:20px 0 0!important;padding:12px 18px;border-radius:20px;background:var(--xhj-surface,#eef0f3)!important;color:var(--xhj-text,#283342)!important;box-shadow:var(--xhj-soft-out,0 3px 12px #0001);color-scheme:var(--xhj-scheme,light);font:14px/1.5 -apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",Arial,sans-serif!important}
            #xhj-survey-folders *{box-sizing:border-box;font-family:inherit!important;text-shadow:none!important}
            #xhj-survey-folders :is(p,span,label,output){color:var(--xhj-text,#283342)!important}
            #xhj-survey-folders summary{display:flex!important;align-items:center;justify-content:flex-start;gap:8px;list-style:none;font-size:16px!important;font-weight:600;cursor:pointer;color:var(--xhj-accent-text,inherit)!important;margin:0!important;padding:4px 0!important;text-align:left}
            #xhj-survey-folders summary::-webkit-details-marker{display:none}
            #xhj-survey-folders summary::before{content:'▸'}
            #xhj-survey-folders[open] summary::before{content:'▾'}
            #xhj-survey-folders .survey-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:12px 0}
            #xhj-survey-folders :is(.survey-source,.survey-actions,.survey-setting,.survey-selection){display:flex;align-items:center;gap:10px}
            #xhj-survey-folders .survey-source{justify-content:flex-start;min-width:0;flex:1 1 180px}
            #xhj-survey-folders .survey-actions{justify-content:flex-end;margin-left:auto;flex:0 0 auto}
            #xhj-survey-folders .survey-selection{justify-content:flex-start;margin:0;flex:0 0 auto}
            #xhj-survey-folders .survey-selected-directory{min-width:0;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
            #xhj-survey-folders button{width:auto!important;min-width:68px;height:38px!important;min-height:38px;padding:8px 12px!important;font-size:14px!important;font-weight:500;line-height:22px!important;text-align:center!important;margin:0!important;white-space:nowrap;cursor:pointer}
            #xhj-survey-folders select{display:inline-block!important;width:68px;height:38px;padding:0 10px;appearance:auto;text-align:center;font:inherit}
            #xhj-survey-folders .survey-path{margin:14px 0 0;text-align:center;overflow-wrap:anywhere;line-height:1.7;font-size:12px;color:var(--xhj-muted,var(--xhj-text,inherit))!important}
            #xhj-survey-folders input[type="checkbox"]{display:inline-block!important;visibility:visible!important;opacity:1!important;position:static!important;width:17px!important;height:17px!important;appearance:auto!important;margin:0!important;vertical-align:middle;accent-color:var(--xhj-accent-text,#3671a6)}
            #xhj-survey-folders .survey-scroll{overflow:auto;max-height:600px;margin:0 auto 14px;width:100%}
            #xhj-survey-folders table{width:100%;min-width:760px;table-layout:fixed;border-collapse:separate;border-spacing:0 4px;color:inherit;font-size:13px}
            #xhj-survey-folders th,#xhj-survey-folders td{text-align:center!important;padding:8px 6px;vertical-align:middle!important;line-height:1.5;white-space:normal;overflow-wrap:anywhere;background:var(--xhj-surface,#eef0f3)!important;color:var(--xhj-text,inherit)!important}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table :is(th,td)[data-xhj-column]{background:var(--xhj-surface,#eef0f3)!important;border-radius:0!important}
            #xhj-survey-folders th{height:40px;padding:8px 4px;white-space:nowrap!important;position:sticky;top:0;z-index:1;color:var(--xhj-accent-text,inherit)!important;font-weight:600}
            #xhj-survey-folders td{height:44px;border-bottom:1px solid var(--xhj-border,#8883)}
            #xhj-survey-folders :is(th,td):first-child{border-radius:6px 0 0 6px}
            #xhj-survey-folders :is(th,td):last-child{border-radius:0 6px 6px 0}
            #xhj-survey-folders td:nth-child(4),#xhj-survey-folders td:nth-child(7),#xhj-survey-folders td:nth-child(10){white-space:nowrap;overflow-wrap:normal}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table td[data-xhj-column="1"]{--xhj-column-text:light-dark(#075a89,#8fd3ff);color:var(--xhj-column-text)!important}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table td[data-xhj-column="2"]{--xhj-column-text:light-dark(#903552,#f8b6cb);color:var(--xhj-column-text)!important}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table td[data-xhj-column="3"]{--xhj-column-text:light-dark(#376b25,#b8e6a1);color:var(--xhj-column-text)!important}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table td[data-xhj-column="4"]{--xhj-column-text:light-dark(#673b88,#e1bdff);color:var(--xhj-column-text)!important}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table td[data-xhj-column="5"]{--xhj-column-text:light-dark(#8a4b08,#ffce92);color:var(--xhj-column-text)!important}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table td[data-xhj-column="6"]{--xhj-column-text:light-dark(#006b64,#a5e2dc);color:var(--xhj-column-text)!important}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table td[data-xhj-column="7"]{--xhj-column-text:light-dark(#6c5900,#e9d68f);color:var(--xhj-column-text)!important}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table td[data-xhj-column="8"]{--xhj-column-text:light-dark(#394d98,#c3caff);color:var(--xhj-column-text)!important}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table td[data-xhj-column="9"]{--xhj-column-text:light-dark(#993f2e,#ffb6a5);color:var(--xhj-column-text)!important}
            html[data-xhj-theme] #xhj-survey-folders .survey-scroll table td[data-xhj-column="10"]{--xhj-column-text:light-dark(#146c5b,#a9ded0);color:var(--xhj-column-text)!important}
            #xhj-survey-folders td[data-xhj-column] output{color:var(--xhj-column-text,var(--xhj-text))!important}
            #xhj-survey-folders output{display:block;line-height:1.5;text-align:center}
            #xhj-survey-folders td[data-xhj-column] output[data-tone="success"]{color:light-dark(#16733b,#75df91)!important}
            #xhj-survey-folders td[data-xhj-column] output[data-tone="error"]{color:light-dark(#b32828,#ff9292)!important}
            #xhj-survey-folders td[data-xhj-column] output[data-tone="warning"]{color:light-dark(#885800,#f2ca70)!important}
            #xhj-survey-folders output[data-detail]{cursor:pointer;text-decoration:underline dotted;text-underline-offset:4px}
            #xhj-survey-folders .survey-login{text-align:right;margin:0 0 0 auto!important;font-size:12px!important;font-weight:500;white-space:nowrap}
            #xhj-survey-folders dialog{max-width:min(560px,90vw);border:1px solid var(--xhj-border,#8884);border-radius:16px;padding:24px;background:var(--xhj-surface,#eef0f3);color:var(--xhj-text,#283342)}
            #xhj-survey-folders dialog::backdrop{background:#0005}
            #xhj-survey-folders dialog pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;line-height:1.8;color:inherit}
            #xhj-survey-folders .survey-status{margin:0;text-align:center;font-size:12px;line-height:1.7;color:var(--xhj-muted,var(--xhj-text,inherit))!important}
            #xhj-survey-folders button:hover{box-shadow:var(--xhj-soft-hover)!important}
            #xhj-survey-folders button:active{box-shadow:var(--xhj-soft-in)!important}
            #xhj-survey-folders :is(button,select):disabled{opacity:.5;cursor:not-allowed}
            @media(max-width:760px){#xhj-survey-folders{padding:12px}#xhj-survey-folders .survey-toolbar{gap:10px}#xhj-survey-folders .survey-source{flex-basis:100%}#xhj-survey-folders .survey-login{white-space:normal;line-height:1.3;text-align:right}}
        `;
        panel.append(style);
        const title = document.createElement('summary');
        title.textContent = '上传房堪';
        panel.append(title);
        const loginState = document.createElement('span');
        loginState.className = 'survey-login';
        loginState.textContent = '正在验证登录…';
        title.append(loginState);
        const detailDialog = document.createElement('dialog');
        detailDialog.setAttribute('aria-label', '上传状态详情');
        const detailText = document.createElement('pre');
        const closeDetail = document.createElement('button');
        closeDetail.type = 'button';
        closeDetail.textContent = '关闭';
        closeDetail.addEventListener('click', () => detailDialog.close());
        detailDialog.append(detailText, closeDetail);
        panel.append(detailDialog);
        function setOutput(output, text, detail = '') {
            output.textContent = text;
            output.dataset.tone = surveyStatusTone(text);
            if (detail) {
                output.dataset.detail = detail;
                output.title = '点击查看详情';
                output.tabIndex = 0;
                output.setAttribute('role', 'button');
            } else {
                delete output.dataset.detail;
                output.removeAttribute('title');
                output.removeAttribute('tabindex');
                output.removeAttribute('role');
            }
        }
        function showDetail(output) {
            if (!output.dataset.detail) return;
            detailText.textContent = output.dataset.detail;
            detailDialog.showModal();
        }
        panel.addEventListener('click', event => { if (event.target.matches('output[data-detail]')) showDetail(event.target); });
        panel.addEventListener('keydown', event => {
            if (['Enter', ' '].includes(event.key) && event.target.matches('output[data-detail]')) { event.preventDefault(); showDetail(event.target); }
        });
        function sessionError(error) {
            if (error.needsLogin) loginState.textContent = '登录已失效 · 请在象视重新登录';
        }
        createSurveyBrowserAPI().sessionUsername().then(username => {
            loginState.textContent = `工号 ${username} · 已登录`;
        }).catch(error => { loginState.textContent = error.needsLogin ? '登录已失效 · 请在象视重新登录' : '登录验证暂未完成'; });
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.setAttribute('webkitdirectory', '');
        input.setAttribute('aria-label', '选择每日拍摄目录');
        input.hidden = true;
        const choose = document.createElement('button');
        choose.type = 'button';
        choose.className = 'layui-btn';
        choose.textContent = '选择文件夹';
        choose.addEventListener('click', () => input.click());
        const selection = document.createElement('span');
        selection.className = 'survey-selected-directory';
        selection.textContent = '尚未选择文件夹';
        const updateDirectory = () => {
            const path = surveyDailyDirectory();
            choose.title = `今日推荐目录：${path}（浏览器需手动选择）`;
            selection.title = choose.title;
            if (!input.files.length) selection.textContent = path.split('/').pop();
        };
        updateDirectory();
        setInterval(updateDirectory, 60000);
        const concurrencyLabel = document.createElement('label');
        concurrencyLabel.className = 'survey-setting';
        concurrencyLabel.textContent = '并发数';
        const concurrency = document.createElement('select');
        concurrency.className = 'layui-select';
        concurrency.setAttribute('lay-ignore', '');
        concurrency.setAttribute('aria-label', '上传并发数');
        let storedConcurrency;
        try { storedConcurrency = localStorage.getItem('xhj-survey-concurrency'); } catch (_) {}
        for (const value of surveyConcurrencyOptions) {
            const option = document.createElement('option');
            option.value = String(value);
            option.textContent = String(value);
            concurrency.append(option);
        }
        concurrency.value = String(surveyConcurrency(storedConcurrency));
        concurrency.addEventListener('change', () => {
            try { localStorage.setItem('xhj-survey-concurrency', concurrency.value); } catch (_) {}
        });
        concurrencyLabel.append(concurrency);
        const rows = document.createElement('div');
        const plans = new Map();
        const start = document.createElement('button');
        start.type = 'button';
        start.className = 'layui-btn';
        start.textContent = '开始上传';
        start.addEventListener('click', async () => {
            const selected = [...rows.querySelectorAll('input:checked:not(:disabled)')];
            if (!selected.length) return;
            const repeat = selected.filter(box => plans.get(box).requiresConfirmation);
            if (repeat.length && !window.confirm(`以下房源上次已完成或结果待核实：\n${repeat.map(box => plans.get(box).houseNumber).join('、')}\n请先核对原订单。确认后会重新上传完整图片并替换保存，不会提前清除旧图。是否继续？`)) return;
            start.disabled = true;
            query.disabled = true;
            input.disabled = true;
            choose.disabled = true;
            concurrency.disabled = true;
            const uploadConcurrency = surveyConcurrency(concurrency.value);
            const api = createSurveyBrowserAPI();
            try {
                for (const box of selected) {
                    const output = box.closest('tr').querySelector('output');
                    try {
                        await runSurveyUpload(plans.get(box), api, event => { setOutput(output, `${event.stage}${event.detail ? ' ' + event.detail : ''}`); try { surveyRecordOutcome(plans.get(box).houseNumber, { stage: event.stage, saved: ['完成订单回写', '核实订单', '完成'].includes(event.stage) }); } catch (_) {} }, uploadConcurrency);
                        plans.get(box).requiresConfirmation = true;
                        setOutput(output, '完成', `${plans.get(box).houseNumber}\n已核实${plans.get(box).images.length}张图片、客厅封面、首个房间朝向及原订单有效状态。`);
                        box.checked = false;
                    } catch (error) {
                        setOutput(output, error.summary || '上传未完成', `${plans.get(box).houseNumber}\n${error.message}`);
                        plans.get(box).requiresConfirmation = true;
                        try { surveyRecordOutcome(plans.get(box).houseNumber, { stage: error.stage, saved: error.saved, error: error.message }); } catch (_) {}
                        sessionError(error);
                        box.checked = false;
                        // A save failure may have committed remotely. Stop the batch for inspection.
                        break;
                    }
                }
            } finally { start.disabled = false; query.disabled = false; input.disabled = false; choose.disabled = false; concurrency.disabled = false; }
        });
        const query = document.createElement('button');
        query.type = 'button';
        query.className = 'layui-btn';
        query.textContent = '查询所选订单';
        query.addEventListener('click', async () => {
            query.disabled = true;
            start.disabled = true;
            input.disabled = true;
            choose.disabled = true;
            concurrency.disabled = true;
            try {
                for (const box of rows.querySelectorAll('input:checked:not(:disabled)')) {
                    const plan = plans.get(box);
                    try {
                        const results = await createSurveyBrowserAPI().findOrders(plan.houseNumber);
                        const detail = surveyOrderDisplay(results);
                        setOutput(box.closest('tr').querySelector('output'), detail);
                    } catch (error) {
                        sessionError(error);
                        setOutput(box.closest('tr').querySelector('output'), '查询失败', error.message);
                    }
                }
            } finally { query.disabled = false; start.disabled = false; input.disabled = false; choose.disabled = false; concurrency.disabled = false; }
        });
        const status = document.createElement('p');
        status.className = 'survey-status';
        status.textContent = '封面先传，余图按所选并发数上传；全部完成后保存并核实订单。';
        const toolbar = document.createElement('div');
        toolbar.className = 'survey-toolbar';
        const source = document.createElement('div');
        source.className = 'survey-source';
        source.append(choose, selection);
        const actions = document.createElement('div');
        actions.className = 'survey-actions';
        actions.append(query, start);
        const controls = document.createElement('div');
        for (const [label, checked] of [['全选', true], ['取消全选', false]]) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'layui-btn';
            button.textContent = label;
            button.addEventListener('click', () => rows.querySelectorAll('input:not(:disabled)').forEach(box => { box.checked = checked; }));
            controls.append(button);
        }
        controls.className = 'survey-selection';
        toolbar.append(source, controls, concurrencyLabel, actions);
        panel.append(input, toolbar, rows, status);
        input.addEventListener('change', () => {
            rows.replaceChildren();
            plans.clear();
            selection.textContent = input.files[0]?.webkitRelativePath.split('/')[0] || '尚未选择文件夹';
            const folders = new Map();
            for (const file of input.files) {
                const parts = file.webkitRelativePath.split('/');
                if (parts.length !== 3) continue;
                const name = parts[1];
                if (!/HS\d{12}(?!\d)/i.test(name)) continue;
                if (!folders.has(name)) folders.set(name, []);
                folders.get(name).push(file);
            }
            let count = 0;
            const recognized = [...folders].map(([name, files]) => planFolder(name, files)).filter(Boolean);
            const numbers = new Map();
            for (const plan of recognized) numbers.set(plan.houseNumber, (numbers.get(plan.houseNumber) || 0) + 1);
            const scroll = document.createElement('div');
            scroll.className = 'survey-scroll';
            const table = document.createElement('table');
            const widths = [4, 4, 6, 14, 13, 18, 9, 4, 5, 13, 10];
            const columns = document.createElement('colgroup');
            for (const width of widths) {
                const column = document.createElement('col');
                column.style.width = `${width}%`;
                columns.append(column);
            }
            table.append(columns);
            const header = table.createTHead().insertRow();
            for (const title of ['选择', '序号', '姓名', '房源编号', '门店', '小区 / 其他信息', '楼栋房号', '朝向', '图片', '封面', '状态']) {
                const cell = document.createElement('th');
                cell.textContent = title;
                cell.scope = 'col';
                cell.dataset.xhjColumn = String(header.cells.length);
                header.append(cell);
            }
            const body = table.createTBody();
            scroll.append(table);
            rows.append(scroll);
            for (const plan of recognized.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN', { numeric: true }))) {
                const name = plan.name;
                if (numbers.get(plan.houseNumber) > 1) plan.errors.push('同日目录中房源编号重复');
                count++;
                const row = body.insertRow();
                const box = document.createElement('input');
                box.type = 'checkbox';
                box.checked = !plan.errors.length;
                box.disabled = !!plan.errors.length;
                box.setAttribute('aria-label', `选择 ${plan.houseNumber}`);
                row.insertCell().append(box);
                const fields = surveyFolderFields(name, plan.houseNumber, plan.direction);
                for (const value of [fields.sequence, fields.person, plan.houseNumber, fields.store, fields.property, fields.unit, plan.direction || '朝向待确认', `${plan.images.length} 张`, plan.cover?.name || '无封面']) row.insertCell().textContent = value || '—';
                plans.set(box, plan);
                const output = document.createElement('output');
                setOutput(output, plan.errors.length ? '无效' : '尚未查询', plan.errors.join('；'));
                row.insertCell().append(output);
                [...row.cells].forEach((cell, index) => { cell.dataset.xhjColumn = String(index); });
            }
            status.textContent = `共 ${count} 个房源 · 封面先传，新图齐全后保存；失败或结果不明确时停止，请核对订单后再操作。`;
        });
        host.append(panel);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
    else mount();
})();
