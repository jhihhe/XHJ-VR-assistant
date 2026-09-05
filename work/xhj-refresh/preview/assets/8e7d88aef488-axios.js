const instance = axios.create({
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL
  baseURL: 'http://yushenchan.xhj.com:8111/api/',
  //超时时间：5s
  timeout: 5000,
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // config——配置对象，通过对config的处理进行请求时增强操作
    console.log(config);
    // // 如果请求中没有"?"，添加"?"，否则添加"&"
    // if (config.url.indexOf("?") == -1) {
    //     config.url += "?token=1234";
    // } else {
    //     config.url += "&token=1234";
    // }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // 可以代替catch
    if (response.status != 200) {
        alert("服务器错误");
    }
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});


// function getSystemInfoApi(id){
// 	return instance({
// 		url: `/xhj-commonservice/external/getSystemInfoBySid?sid=${id}`,
// 		method: "get"
// 	});
// }

// function gethuxingAp(lpId,imagetype){
// 	return instance({
// 		url: `/xhj-commonservice/external/houseSurveyImg/getLpImgByLpId?lpId=${lpId}&imagetype=${imagetype}`,
// 		method: "get"
// 	});
// }