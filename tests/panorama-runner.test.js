const assert = require('node:assert/strict');
const { runPanoramaUpload, runPanoramaSave } = require('../work/xiangshi-upload-api/panorama-runner');
const { createPanoramaAPI, panoramaPhotographerIDs } = require('../work/xiangshi-upload-api/panorama-api');
function fixture() {
    let rows = [], calls = [], counter = 0, status = 1;
    const plan = { houseNumber: 'HS000000000001', errors: [], floors: [1,2].map(floor=>({floor,images:[{file:{name:`room${floor}.JPG`,size:100},room:'客厅'}]})) };
    const api = { validateImage: async()=>{}, fingerprint: async file=>file.name,
        findOrders: async()=>[{id:1,status,house_nums:plan.houseNumber}], listImages:async()=>rows.map(x=>({...x})),
        uploadFile:async file=>{calls.push(file.name);return '/uploads/image.JPG';},
        addImage:async(order,image,url,floor)=>{rows.push({id:++counter,image_name:image.room,storey:floor,image_url:`https://example.test/${counter}.jpg`});},
        generateCoordinates:async()=>{for (const row of rows) row.point='fixture-coordinate';},
        retake:async()=>{rows=[];status=1;calls.push('retake');}, saveDirection:async()=>{throw Error('must not save');} };
    return { plan,api,calls,setStatus:s=>status=s,addRow:r=>rows.push(r) };
}
(async()=>{
    const missing=fixture(); let missingReceipt;
    missing.api.generateCoordinates=async()=>{};
    await assert.rejects(runPanoramaUpload(missing.plan,missing.api,{persist:r=>missingReceipt=structuredClone(r)}),/坐标未齐/);
    missing.plan.direction='北'; let forbiddenSaves=0;
    missing.api.saveDirection=async()=>{forbiddenSaves++;};
    await assert.rejects(runPanoramaSave(missing.plan,missing.api,missingReceipt),/坐标未齐/);
    assert.equal(forbiddenSaves,0); assert.equal(missingReceipt.saveAttempted,undefined);
    let f=fixture(), receipt;
    await runPanoramaUpload(f.plan,f.api,{persist:r=>receipt=structuredClone(r)});
    assert.deepEqual(f.calls,['room1.JPG','room2.JPG']);
    await runPanoramaUpload(f.plan,f.api,{receipt});
    assert.equal(f.calls.length,2,'resume must not duplicate');
    let saves=0;f.plan.direction='北';f.api.readHistory=async()=>saves?[{id:1,title:'保存'}]:[];
    f.api.saveDirection=async()=>{saves++;};
    await runPanoramaSave(f.plan,f.api,receipt);
    assert.equal(saves,1);assert.equal(receipt.saveVerified,true);
    await assert.rejects(runPanoramaSave(f.plan,f.api,receipt),/避免重复派单/);
    assert.equal(saves,1);
    const expired=fixture();let expiredReceipt;
    await runPanoramaUpload(expired.plan,expired.api,{persist:r=>expiredReceipt=structuredClone(r)});
    expired.plan.direction='北';expired.api.readHistory=async()=>[];
    expired.api.saveDirection=async()=>{throw Object.assign(Error('登录已失效'),{needsLogin:true});};
    await assert.rejects(runPanoramaSave(expired.plan,expired.api,expiredReceipt),e=>e.needsLogin===true&&e.stage==='保存朝向');
    assert.equal(expiredReceipt.saveAttempted,true);
    await assert.rejects(runPanoramaSave(expired.plan,expired.api,expiredReceipt),/避免重复派单/);
    receipt.saveAttempted=false;receipt.directionSubmitted=false;
    f.plan.floors[0].images[0].file.name='changed.JPG';
    await assert.rejects(runPanoramaUpload(f.plan,f.api,{receipt}),/本地图片/);
    f=fixture(); f.addRow({id:7,storey:1,image_name:'客厅',image_url:'unknown'});
    await assert.rejects(runPanoramaUpload(f.plan,f.api),/未经本次核对/);
    assert.equal(f.calls.length,0);
    f=fixture();f.setStatus(5);
    await assert.rejects(runPanoramaUpload(f.plan,f.api),error=>error.requiresRetake===true);
    assert.equal(f.calls.length,0);
    await runPanoramaUpload(f.plan,f.api,{allowRetake:true});
    assert.deepEqual(f.calls,['retake','room1.JPG','room2.JPG']);
    f=fixture();f.api.addImage=async()=>{throw Error('lost response');};
    await assert.rejects(runPanoramaUpload(f.plan,f.api),/lost response/);
    assert.deepEqual(f.calls,['room1.JPG'],'floor 2 must not start after floor 1 failure');
    const requests=[];
    const api=createPanoramaAPI(async(url,options)=>{requests.push([url,options]);return {ok:true,json:async()=>({code:0,count:1,data:[{id:1,house_nums:'HS000000000001',status:1}]})};});
    await api.findOrders('HS000000000001');
    const body=new URLSearchParams(requests[0][1].body);
    assert.equal(body.get('type'),'1'); assert.equal(body.get('uid'),'0');
    assert.equal(new URLSearchParams(requests[1][1].body).get('type'),'2');
    assert.deepEqual(panoramaPhotographerIDs('<select id="uid" name="fb_uid"><option value="0">摄影师</option><option value="14">示例</option><option value="14">重复</option></select>'),['14']);
    const searched=[];
    const fallback=createPanoramaAPI(async(url,options)=>{
        if(!options.method)return {ok:true,text:async()=>'<select id="uid"><option value="14">示例</option></select>'};
        const fields=new URLSearchParams(options.body);searched.push(fields.get('uid'));
        const data=fields.get('uid')==='14'?[{id:1,house_nums:'HS000000000001',status:1}]:[];
        return {ok:true,json:async()=>({code:0,count:data.length,data})};
    });
    const stored=new Map();
    global.localStorage={getItem:key=>stored.get(key),setItem:(key,value)=>stored.set(key,value)};
    const progress=[];
    assert.equal((await fallback.findOrders('HS000000000001',text=>progress.push(text))).length,1);
    assert.ok(progress.some(text=>text.includes('示例（1/1）')&&text.includes('待处理')));
    assert.ok(progress.some(text=>text.includes('示例（1/1）')&&text.includes('全部')));
    assert.deepEqual(searched,['0','0','14','14']);
    const { File }=require('node:buffer');
    searched.length=0;progress.length=0;
    assert.equal((await fallback.findOrders('HS000000000001',text=>progress.push(text))).length,1);
    assert.deepEqual(searched,['0','0','14','14']);
    assert.ok(progress.some(text=>text.includes('上次摄影师 示例')));
    stored.clear(); searched.length=0;
    const preferred=createPanoramaAPI(async(url,options)=>{
        if(!options.method)return {ok:true,text:async()=>'<select id="uid"><option value="99">首选</option><option value="14">其他</option></select>'};
        const fields=new URLSearchParams(options.body);searched.push(fields.get('uid'));
        const data=fields.get('uid')==='14'?[{id:1,house_nums:'HS000000000001',status:1}]:[];
        return {ok:true,json:async()=>({code:0,count:data.length,data})};
    },{id:'99',name:'首选'});
    await preferred.findOrders('HS000000000001');
    assert.deepEqual(searched,['0','0','99','99','14','14'],'chosen photographer first, then fallback without repeating');
    searched.length=0;
    await preferred.findOrders('HS000000000001');
    assert.deepEqual(searched,['0','0','99','99','14','14'],'chosen photographer takes precedence over cached photographer');
    const selectedHit=[];
    const direct=createPanoramaAPI(async(url,options)=>{
        selectedHit.push(new URLSearchParams(options.body).get('uid'));
        const data=new URLSearchParams(options.body).get('uid')==='88'?[{id:1,house_nums:'HS000000000001',status:1}]:[];
        return {ok:true,json:async()=>({code:0,count:data.length,data})};
    },{id:'88',name:'指定摄影师'});
    await direct.findOrders('HS000000000001');
    assert.deepEqual(selectedHit,['0','0','88','88'],'selected match must not query other photographers');
    const currentCalls=[];
    const currentFirst=createPanoramaAPI(async(url,options)=>{
        currentCalls.push(new URLSearchParams(options.body).get('uid'));
        return {ok:true,json:async()=>({code:0,count:1,data:[{id:1,house_nums:'HS000000000001',status:1}]})};
    },{id:'99',name:'首选'});
    await currentFirst.findOrders('HS000000000001');
    assert.deepEqual(currentCalls,['0','0'],'current account must precede manual choice and cache');
    delete global.localStorage;
    const upload=createPanoramaAPI(async(url,options)=>{
        assert.equal(options.headers['X-Requested-With'],'XMLHttpRequest');
        assert.equal(options.credentials,'same-origin');
        assert.equal(options.body.get('file').name,'客厅.JPG');
        return {ok:true,json:async()=>({code:1,info:'客厅',url:'/uploads/demo.JPG'})};
    });
    assert.equal(await upload.uploadFile(new File(['fixture'],'客厅.JPG')),'/uploads/demo.JPG');
    const retakeCalls=[];
    const retake=createPanoramaAPI(async(url,options)=>{
        retakeCalls.push([url,options]);
        if(!options.method)return {ok:true,text:async()=>`const house_nums = 'HS000000000001'; xiangShiToken = 'fixture-token'; <input title="重拍">`};
        return {ok:true,json:async()=>({code:url.includes('removedVr')?200:1})};
    });
    await retake.retake({id:1,house_nums:'HS000000000001',status:5});
    assert.equal(retakeCalls.length,3);
    assert.ok(retakeCalls[1][0].endsWith('/removedVr'));
    assert.equal(new URLSearchParams(retakeCalls[2][1].body).get('flag'),'2');
    console.log('panorama runner and query contracts passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
