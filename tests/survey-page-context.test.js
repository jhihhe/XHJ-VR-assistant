const assert = require('node:assert/strict');
const { readSurveyPageContext } = require('../work/xiangshi-upload-api/page-context');
const source = `var arr = {
// id:999,
xiangShiToken:'test-fixture', account:1, housePhotographyId:2,
saleorrentid:3, hosuetype:1, housesourceid:4, diskSourceType:'1',
houseNo:'HS000000000001', lpid:5, inputType:1,
};`;
const result = readSurveyPageContext(source, 'HS000000000001', 2);
assert.equal(result.housePhotographyId, 2);
assert.equal(result.houseNo, 'HS000000000001');
assert.throws(() => readSurveyPageContext(source, 'HS000000000002', 2), /不匹配/);
assert.throws(() => readSurveyPageContext(source, 'HS000000000001', 3), /不匹配/);
assert.throws(() => readSurveyPageContext(source.replace('account:1,', ''), 'HS000000000001', 2), /缺少/);
console.log('survey page context passed');
