const assert = require('node:assert/strict');
const { runPanoramaBatch, panoramaImageConcurrency, panoramaHouseConcurrency } = require('../work/xiangshi-upload-api/panorama-batch');
const tick = () => new Promise(resolve => setTimeout(resolve, 1));
(async () => {
    assert.equal(panoramaImageConcurrency(undefined),20);
    assert.equal(panoramaHouseConcurrency(undefined),1);
    assert.equal(panoramaHouseConcurrency(21),1);
    assert.equal(panoramaHouseConcurrency(5),5);
    assert.equal(panoramaHouseConcurrency(6),1);
    let activeHouses=0, maxHouses=0, activeImages=0, maxImages=0;
    const result=await runPanoramaBatch([1,2,3],async(house,transfer)=>{
        activeHouses++;maxHouses=Math.max(maxHouses,activeHouses);
        await Promise.all(Array.from({length:25},()=>transfer(async()=>{
            activeImages++;maxImages=Math.max(maxImages,activeImages);await tick();activeImages--;
        })));
        activeHouses--;return house;
    },{houses:2,images:20});
    assert.equal(maxHouses,2);assert.equal(maxImages,20);
    assert.ok(result.every(r=>r.status==='fulfilled'));
    let laterStarted=false, completed=0;
    const stopped=await runPanoramaBatch([1,2,3],async(house,transfer)=>{
        if(house===3)laterStarted=true;
        await Promise.allSettled(Array.from({length:8},(_,i)=>transfer(async()=>{
            if(house===1&&i===0)throw Error('server failed');
            await tick();completed++;
        }))).then(outcomes=>{const fail=outcomes.find(x=>x.status==='rejected');if(fail)throw fail.reason;});
    },{houses:2,images:4});
    assert.equal(laterStarted,false);assert.equal(stopped[2].started,false);
    assert.equal(completed,3,'only already-active transfers may finish after the first error');
    assert.equal(activeImages,0);
    console.log('panorama multi-house shared budget and failure stop passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
