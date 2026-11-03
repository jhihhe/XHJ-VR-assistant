function prepareSurveySave(fields, images, surveyDate, hxType = null) {
    if (!/^HS\d{12}$/.test(fields.houseNo) || !fields.housePhotographyId || !images.length) {
        throw new Error('保存信息不完整');
    }
    const links = new Set();
    for (const image of images) {
        if (!image || typeof image.imagepath !== 'string' || !image.imagepath || image.roomType == null || image.imagetype !== 2 || links.has(image.imagepath)) {
            throw new Error('保存图片列表无效或存在重复');
        }
        links.add(image.imagepath);
    }
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(surveyDate)) throw new Error('拍摄时间格式不正确');
    return {
        ...fields,
        // Initial/reset state in the observed upload page.
        url: '', urlZq: '', isSync: 0,
        surveydate: surveyDate,
        houseSurveyImages: images,
        hxType
    };
}

if (typeof module !== 'undefined') module.exports = { prepareSurveySave };
