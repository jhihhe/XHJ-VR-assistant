// Author: @Jhih he
(function () {
    if (location.pathname !== '/houseadmin/pano/index.html') return;
    function mount() {
        const host = document.querySelector('.demoTable');
        if (!host || document.getElementById('xhj-panorama-folders')) return;
        const panel = document.createElement('details'); panel.id = 'xhj-panorama-folders'; panel.open = true;
        panel.dataset.panoramaVersion = '0.2.4';
        const style = document.createElement('style');
        style.textContent = `
        #xhj-panorama-folders{box-sizing:border-box;flex-basis:100%;width:100%;min-width:0;margin:16px 0;padding:12px 18px;border-radius:20px;background:var(--xhj-surface,#eef0f3)!important;color:var(--xhj-text,#283342)!important;box-shadow:var(--xhj-soft-out,0 3px 12px #0001);color-scheme:var(--xhj-scheme,light);font:14px/1.5 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}
        #xhj-panorama-folders *{box-sizing:border-box;font-family:inherit!important;-webkit-text-fill-color:currentColor!important;text-shadow:none!important}
        #xhj-panorama-folders summary{display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:16px;padding:4px 0;color:var(--xhj-accent-text,inherit)!important}
        #xhj-panorama-folders summary span{margin-left:auto;font-size:12px;font-weight:400}
        #xhj-panorama-folders .pano-tools{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:10px 0}
        #xhj-panorama-folders .pano-actions{display:flex;gap:10px;margin-left:auto;flex-wrap:wrap}
        #xhj-panorama-folders .pano-source{margin-right:auto;display:flex;align-items:center;gap:10px}
        #xhj-panorama-folders .pano-source span{max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        #xhj-panorama-folders button,#xhj-panorama-folders select{height:38px;min-width:64px;padding:0 14px;border:0;border-radius:12px;color:var(--xhj-accent-text,#23678c)!important;background:var(--xhj-surface,#eef0f3)!important;box-shadow:var(--xhj-soft-out,0 2px 8px #0002);font:inherit;cursor:pointer}
        #xhj-panorama-folders button:disabled{opacity:.5;cursor:not-allowed}
        #xhj-panorama-folders .pano-scroll{overflow:auto;max-height:540px}
        #xhj-panorama-folders table{table-layout:fixed;width:100%;min-width:900px;border-collapse:collapse;font-size:13px;line-height:1.5}
        #xhj-panorama-folders input[type=checkbox]{display:inline-block!important;appearance:auto!important;width:16px;height:16px;margin:0;vertical-align:middle;accent-color:var(--xhj-accent-text,#3671a6)}
        #xhj-panorama-folders th,#xhj-panorama-folders td{height:40px;padding:6px;text-align:center!important;vertical-align:middle!important;overflow-wrap:anywhere;border-bottom:1px solid var(--xhj-border,#8883);background:var(--xhj-surface,#eef0f3)!important;color:var(--xhj-text,inherit)!important}
        #xhj-panorama-folders th{position:sticky;top:0;z-index:1;font-size:12px;color:var(--xhj-muted,inherit)!important}
        #xhj-panorama-folders td:nth-child(4){color:light-dark(#376b25,#b8e6a1)!important}
        #xhj-panorama-folders td:nth-child(3){color:light-dark(#903552,#f8b6cb)!important}
        #xhj-panorama-folders td:nth-child(5){color:light-dark(#673b88,#e1bdff)!important}
        #xhj-panorama-folders td:nth-child(6){color:light-dark(#8a4b08,#ffce92)!important}
        #xhj-panorama-folders td:nth-child(7){color:light-dark(#006b64,#a5e2dc)!important}
        #xhj-panorama-folders td:nth-child(8){color:light-dark(#6c5900,#e9d68f)!important}
        #xhj-panorama-folders :is(span,label,p,output){color:var(--xhj-text,#283342)!important;background:transparent!important}
        #xhj-panorama-folders output{cursor:pointer;display:block}
        #xhj-panorama-folders output[data-tone=success]{color:light-dark(#16733b,#75df91)!important}
        #xhj-panorama-folders output[data-tone=error]{color:light-dark(#b32828,#ff9292)!important}
        #xhj-panorama-folders output[data-tone=warning]{color:light-dark(#885800,#f2ca70)!important}
        #xhj-panorama-folders p{margin:8px 0 0;font-size:12px;color:var(--xhj-muted,inherit)}
        #xhj-panorama-folders dialog{max-width:min(650px,90vw);border:1px solid var(--xhj-border,#8884);border-radius:16px;padding:24px;background:var(--xhj-surface,#eef0f3)!important;color:var(--xhj-text,#283342)}
        #xhj-panorama-folders dialog::backdrop{background:#0005}
        #xhj-panorama-folders pre{white-space:pre-wrap;font:inherit;line-height:1.8}
        `;
        panel.append(style);
        const summary = document.createElement('summary'); summary.textContent = '上传售房全景';
        const login = document.createElement('span'); login.textContent = '正在验证登录…'; summary.append(login); panel.append(summary);
        createSurveyBrowserAPI().sessionUsername().then(name => { login.textContent = `工号 ${name} · 已登录`; }).catch(() => { login.textContent = '登录未确认 · 请检查象视会话'; });
        const input = document.createElement('input'); input.type = 'file'; input.multiple = true; input.hidden = true; input.setAttribute('webkitdirectory',''); input.setAttribute('aria-label','选择全景每日文件夹');
        const toolbar = document.createElement('div'); toolbar.className = 'pano-tools';
        function button(text, action) { const el = document.createElement('button'); el.type='button';el.textContent=text;el.addEventListener('click',action);return el; }
        const choose = button('选择文件夹',()=>{input.value='';input.click();});
        const directory = document.createElement('span');let hasDirectory=false;
        const updateDate = () => { choose.title=`今日全景目录：${panoramaDailyDirectory()}（浏览器需手动选择）`;if (!hasDirectory) directory.textContent=panoramaDailyDirectory().split('/').pop(); };
        updateDate();setInterval(updateDate,60000);
        const source = document.createElement('div');source.className='pano-source';source.append(choose,directory);
        const selectAll = button('全选',()=>checks().forEach(box=>{box.checked=true;}));
        const selectNone = button('取消全选',()=>checks().forEach(box=>{box.checked=false;}));
        const concurrency = document.createElement('select');concurrency.setAttribute('lay-ignore','');concurrency.setAttribute('aria-label','全景图片并发数');
        for(const value of surveyConcurrencyOptions){const option=document.createElement('option');option.value=value;option.textContent=value;concurrency.append(option);}
        const houseConcurrency=document.createElement('select');houseConcurrency.setAttribute('lay-ignore','');houseConcurrency.setAttribute('aria-label','同时上传房源');
        for(let value=1;value<=5;value++){const option=document.createElement('option');option.value=value;option.textContent=`${value}套`;houseConcurrency.append(option);}
        concurrency.value='20';houseConcurrency.value='1';
        try{
            if(localStorage.getItem('xhj-panorama-defaults')!=='20-global'){
                localStorage.setItem('xhj-panorama-concurrency','20');localStorage.setItem('xhj-panorama-houses','1');localStorage.setItem('xhj-panorama-defaults','20-global');
            }
            concurrency.value=String(panoramaImageConcurrency(localStorage.getItem('xhj-panorama-concurrency')));
            houseConcurrency.value=String(panoramaHouseConcurrency(localStorage.getItem('xhj-panorama-houses')));
        }catch(_){}
        concurrency.addEventListener('change',()=>{try{localStorage.setItem('xhj-panorama-concurrency',concurrency.value);}catch(_){}});
        houseConcurrency.addEventListener('change',()=>{try{localStorage.setItem('xhj-panorama-houses',houseConcurrency.value);}catch(_){}});
        const firstPhotographer=document.createElement('select');firstPhotographer.setAttribute('lay-ignore','');firstPhotographer.setAttribute('aria-label','跨摄影师首查');firstPhotographer.style.maxWidth='180px';
        const addPhotographer=(id,name)=>{const option=document.createElement('option');option.value=id;option.textContent=name;firstPhotographer.append(option);};
        addPhotographer('','自动（上次匹配优先）');
        const photographerSetting=document.createElement('label');photographerSetting.textContent='跨摄影师首查 ';photographerSetting.append(firstPhotographer);
        const api=()=>createPanoramaAPI(fetch,firstPhotographer.value===''?null:{id:firstPhotographer.value,name:firstPhotographer.selectedOptions[0].textContent});
        createPanoramaAPI().photographers().then(people=>{
            for(const person of people)addPhotographer(person.id,person.name);
            try{const saved=localStorage.getItem('xhj-panorama-first-photographer');if([...firstPhotographer.options].some(option=>option.value===saved))firstPhotographer.value=saved;}catch(_){}
        }).catch(error=>{firstPhotographer.title=`摄影师列表未加载：${error.message}；自动查询仍可用`;});
        firstPhotographer.addEventListener('change',()=>{try{localStorage.setItem('xhj-panorama-first-photographer',firstPhotographer.value);}catch(_){}});
        const setting=document.createElement('label');setting.textContent='图片并发 ';setting.title='所有房源共享此上限，最高20张';setting.append(concurrency);
        const housesSetting=document.createElement('label');housesSetting.textContent='同时房源 ';housesSetting.append(houseConcurrency);
        const rows=document.createElement('div');rows.className='pano-scroll';const plans=new Map();
        const notice=document.createElement('p');notice.textContent='默认同时1套，图片并发20张；多套共享图片上限。保存朝向单独提交并派单。';
        const dialog=document.createElement('dialog');dialog.setAttribute('aria-label','全景状态详情');const detail=document.createElement('pre');dialog.append(detail,button('关闭',()=>dialog.close()));
        function output(box,text,reason=''){const el=box.closest('tr').querySelector('output');el.textContent=text;el.dataset.detail=reason||text;el.dataset.tone=/失败|无效/.test(text)?'error':/未提交|待核实|重拍/.test(text)?'warning':/可上传|已完成/.test(text)?'success':'';}
        function checks(){return [...rows.querySelectorAll('input[type=checkbox]:not(:disabled)')];}
        function selected(){return [...rows.querySelectorAll('input[type=checkbox]:checked')].filter(box=>!plans.get(box).errors.length);}
        function key(plan){return `xhj-panorama-receipt:${plan.houseNumber}`;}
        function load(plan){try{return JSON.parse(localStorage.getItem(key(plan))||'null');}catch(_){return null;}}
        function persist(plan,receipt){localStorage.setItem(key(plan),JSON.stringify(receipt));}
        const query=button('查询所选订单',()=>perform(async()=>{const boxes=selected();for(const box of boxes)output(box,'排队等待');let completed=0;for(const box of boxes){const plan=plans.get(box);notice.textContent=`查询进度 ${completed}/${boxes.length} · 当前 ${plan.houseNumber}`;try{const orders=await api().findOrders(plan.houseNumber,text=>output(box,text));output(box,orders.length!==1?'无效 · 订单不唯一':Number(orders[0].status)===5?'重拍后可上传':[1,2].includes(Number(orders[0].status))?'全景可上传':'无效 · 当前状态不可上传');}catch(e){failed(box,e);}completed++;notice.textContent=`查询完成 ${completed}/${boxes.length}`;}}));
        const start=button('开始上传',()=>perform(async()=>{
            const boxes=selected();if(!boxes.length)return;
            const retakes=[];
            for(const box of boxes){
                try{const orders=await api().findOrders(plans.get(box).houseNumber,text=>output(box,text));if(orders.length===1&&Number(orders[0].status)===5)retakes.push(box);}
                catch(error){failed(box,error);return;}
            }
            if(retakes.length&&!window.confirm(`${retakes.map(box=>plans.get(box).houseNumber).join('、')}\n重拍会下架原全景及户型图，恢复未上传状态。确认按当前所选文件夹重新上传？`))return;
            const outcomes=await runPanoramaBatch(boxes,async(box,transfer)=>{
                const plan=plans.get(box);
                return runPanoramaUpload(plan,api(),{
                    concurrency:Number(concurrency.value),transfer,receipt:load(plan),persist:r=>persist(plan,r),allowRetake:retakes.includes(box),
                    onProgress:e=>output(box,e.detail?`${e.stage} ${e.detail}`:e.stage,e.detail)
                });
            },{houses:Number(houseConcurrency.value),images:Number(concurrency.value)});
            for(const result of outcomes){
                const box=result.item,plan=plans.get(box);
                if(result.status==='fulfilled'){
                    output(box,'图片及坐标已就绪 · 朝向未提交',`${plan.count}张，${plan.floors.map(f=>`${f.floor}层${f.images.length}张`).join('；')}。未分配设计师。`);box.checked=false;
                }else if(result.started){failed(box,result.reason);}
                else output(box,'未开始 · 本批已停止',result.reason.message);
            }
        }));
        const save=button('保存所选朝向',()=>{
            const boxes=selected();if(!boxes.length)return;
            if(!window.confirm(`以下房源图片和全部坐标核对通过后，将保存朝向并分配设计师制作户型图：\n${boxes.map(box=>`${plans.get(box).houseNumber} · ${plans.get(box).direction}`).join('\n')}\n确认提交？`))return;
            perform(async()=>{for(const box of boxes){const plan=plans.get(box);try{await runPanoramaSave(plan,api(),load(plan),r=>persist(plan,r),text=>output(box,text));output(box,'已完成 · 保存记录已核实');box.checked=false;}catch(e){failed(box,e);break;}}});
        });
        const controls=[choose,selectAll,selectNone,concurrency,houseConcurrency,firstPhotographer,query,start,save];let busy=false;
        function failed(box,e){output(box,e.stage?'上传未完成':'操作失败',e.message);if(e.needsLogin)login.textContent='登录已失效 · 请重新登录';}
        async function perform(action){if(busy)return;busy=true;controls.forEach(el=>{el.disabled=true;});input.disabled=true;const boxes=checks();boxes.forEach(el=>{el.disabled=true;});try{await action();}finally{controls.forEach(el=>{el.disabled=false;});input.disabled=false;boxes.forEach(el=>{el.disabled=false;});busy=false;}}
        const actions=document.createElement('div');actions.className='pano-actions';actions.append(query,start,save);
        toolbar.append(source,selectAll,selectNone,photographerSetting,housesSetting,setting,actions);panel.append(input,toolbar,rows,notice,dialog);host.append(panel);
        input.addEventListener('change',()=>{
            rows.replaceChildren();plans.clear();hasDirectory=input.files.length>0;const groups=new Map();
            for(const file of input.files){const parts=file.webkitRelativePath.split('/');const index=parts.findIndex(part=>/HS\d{12}(?!\d)/i.test(part));if(index<0||index===parts.length-1)continue;const name=parts[index];if(!groups.has(name))groups.set(name,[]);groups.get(name).push({file,relativePath:parts.slice(index+1).join('/')});}
            const rootName=input.files[0]?.webkitRelativePath.split('/')[0]||'';
            directory.textContent=/HS\d{12}(?!\d)/i.test(rootName)?'单个房源文件夹':rootName||'未选择';
            const recognized=[...groups].map(([name,entries])=>planPanoramaFolder(name,entries)).filter(Boolean);
            const table=document.createElement('table'),head=table.createTHead().insertRow();
            for(const title of ['选择','序号','姓名','房源编号','门店','小区 / 其他信息','楼栋房号','朝向','楼层 / 图片','状态']){const cell=document.createElement('th');cell.textContent=title;head.append(cell);}
            const colgroup=document.createElement('colgroup');for(const width of [4,4,7,15,13,17,9,4,12,15]){const col=document.createElement('col');col.style.width=`${width}%`;colgroup.append(col);}table.prepend(colgroup);const body=table.createTBody();rows.append(table);
            for(const plan of recognized.sort((a,b)=>a.name.localeCompare(b.name,'zh-CN',{numeric:true}))){
                if(recognized.filter(p=>p.houseNumber===plan.houseNumber).length>1)plan.errors.push('同日房源编号重复');
                const row=body.insertRow(),box=document.createElement('input');box.type='checkbox';box.checked=!plan.errors.length;box.disabled=!!plan.errors.length;box.setAttribute('aria-label',`选择 ${plan.houseNumber}`);row.insertCell().append(box);plans.set(box,plan);
                const fields=surveyFolderFields(plan.name,plan.houseNumber,plan.direction);
                for(const value of [fields.sequence,fields.person,plan.houseNumber,fields.store,fields.property,fields.unit,plan.direction,plan.floors.map(f=>`${f.floor}层 ${f.images.length}张`).join(' / ')])row.insertCell().textContent=value||'—';
                const state=document.createElement('output');state.tabIndex=0;state.setAttribute('role','button');const show=()=>{detail.textContent=`${plan.houseNumber}\n${state.dataset.detail}`;dialog.showModal();};state.addEventListener('click',show);state.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}});row.insertCell().append(state);output(box,plan.errors.length?'无效':'尚未查询',plan.errors.join('；'));
            }
            notice.textContent=`共${recognized.length}个房源 · 按楼层上传；“保存所选朝向”会派单，请核对后单独提交。`;
        });
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
