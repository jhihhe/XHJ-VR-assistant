
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>象视平台后台管理</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="format-detection" content="telephone=no">
    <link rel="stylesheet" href="/static/plugins/layui/css/layui.css" media="all" />
    <link rel="stylesheet" href="/static/admin/css/global.css" media="all">
    <link rel="stylesheet" href="/static/common/css/font.css" media="all">
</head>
<body class="skin-0">
<style type="text/css">
        .layui-form-item .layui-input-inline {
            width: 100px;
        }
</style>
<div class="admin-main layui-anim layui-anim-upbit" ng-app="hd" ng-controller="ctrl">
    
    <form class="layui-form layui-form-pane">
        <div class="layui-form-item">
            <label class="layui-form-label">类型</label>
            <div class="layui-input-block">
              <input type="radio" name="type" value="1" title="全景图" checked="">
              <input type="radio" name="type" value="2" title="全景视频">
              <input type="radio" name="type" value="3" title="3D模型">
            </div>
       </div>
        
        <div class="layui-form-item">
			<label class="layui-form-label">楼层</label>
			<div class="layui-input-block" style="width: 20%">
			  <select  name="storey"  >
				<option value="1" >1</option>
				<option value="2" >2</option>
				<option value="3" >3</option>
				<option value="4" >4</option>
				<option value="5" >5</option>
			</select>
			</div>
	   </div>
	   
        <div id="uploader-list">
            <!-- <div class="layui-form-item" >
                <div class="layui-input-inline">
                    <select  name="image_name'+nums+'"  >
                        <option value="" >位置</option>
                        <option value="客厅" >客厅</option>
                        <option value="餐厅" >餐厅</option>
                        <option value="主卧" >卧室</option>
                        <option value="走廊" >走廊</option>
                        <option value="厨房" >厨房</option>
                        <option value="书房" >书房</option>
                        <option value="卫生间" >卫生间</option>
                        <option value="阳台" >阳台</option>
                        <option value="其它" >其它</option>
                    </select>
                </div>
                <div class="layui-input-inline">
                    <select  name="image_nums'+nums+'"  >
                        <option value="" >序号</option>
                        <option value="1" >1</option>
                        <option value="2" >2</option>
                        <option value="3" >3</option>
                        <option value="4" >4</option>
                        <option value="5" >5</option>
                    </select>
                    
                </div>

                <div class="layui-input-inline">
                    <input type="text" name="image_area'+nums+'" placeholder="面积" class="layui-input">
                </div>

                <div style="margin-top: 18px;width: 120px;" class="layui-input-inline layui-progress" lay-showpercent="true">
                  <div class="layui-progress-bar" lay-filter="demo1" lay-percent="20%"></div>
                </div>

                <div class="layui-upload-list">
                    <img class="layui-upload-img" src='/uploads/20210918/3658cd06a1754781c57d65afd6976f84.jpg'>
                    <a class="layui-btn update" data-id="" style="margin-left:5px" >上传</a>
                </div>
            </div> -->
            
        </div>

       <div class="layui-form-item">
            <label class="layui-form-label">新增</label>
            
            <div class="layui-input-block">
                <div class="layui-upload">
                    <button type="button" class="layui-btn layui-btn-primary" id="test2"><i class="icon icon-upload3"></i>选择文件</button>

                </div>
            </div>
            <div class="layui-form-mid layui-word-aux">
                单次选择上限35张，图片格式：jpg，分辨率比例为2:1，图片文件大小限制50M以内
            </div>
        </div>  
   
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button type="button" class="layui-btn" lay-submit="" lay-filter="submit">关闭</button>
            </div>
        </div>
    </form>
</div>
<script type="text/javascript" src="/static/plugins/layui2.6/layui.js"></script>
<script src="/static/common/js/angular.min.js"></script>
<script>
    var m = angular.module('hd',[]);
    var nums = 0;
    var num = 0;
    var come = 0;
    var index_come = 0;
    m.controller('ctrl',['$scope',function($scope) {
        layui.use(['form', 'layer','upload','element'], function () {
            var form = layui.form, $ = layui.jquery, upload = layui.upload,element = layui.element;;
           
            form.on('submit(submit)', function (data) {
                parent.location.href = "/houseadmin/pano/image.html?order_id=412672";
            });
            //普通图片上传
            var uploadInst = upload.render({
                elem: '#adBtn'
                ,url: '/houseadmin/up_files/image_upload.html'
                ,accept: 'images' //允许上传的文件类型
                ,before: function(obj){
                    //预读本地文件示例，不支持ie8
                    obj.preview(function(index, file, result){
                        //console.log(result)
                       // $('#pic').val(result);
                        $('#adPic').attr('src', result); //图片链接（base64）
                    });
                },
                done: function(res){
                    if(res.code>0){
                        $('#pic').val(res.url);
                    }else{
                        //如果上传失败
                        return layer.msg(res.info);
                    }
                }
                ,error: function(){
                    //演示失败状态，并实现重传
                    var demoText = $('#demoText');
                    demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
                    demoText.find('.demo-reload').on('click', function(){
                        uploadInst.upload();
                    });
                }
            });

            //多图片上传
              upload.render({
                elem: '#test2'
                ,url: '/houseadmin/up_files/image_upload.html' //改成您自己的上传接口
                ,multiple: true
                ,number:20
                ,before: function(obj){
                  //预读本地文件示例，不支持ie8
                    obj.preview(function(index, file, result){
                        var img = file.name.substring(0,file.name.length-4);
                    //$('#demo2').append('<img src="'+ result +'" alt="'+ file.name +'" class="layui-upload-img">')
                        $('#uploader-list').append(
                            '<div class="layui-form-item" >'+
                                '<div class="layui-input-inline">'+
                                    '<select  name="image_name'+img+'"  >'+
                                        '<option value="'+img+'" >'+img+'</option>'+
                                        '<option value="客厅" >客厅</option>'+
                                        '<option value="餐厅" >餐厅</option>'+
                                        '<option value="主卧" >卧室</option>'+
                                        '<option value="走廊" >走廊</option>'+
                                        '<option value="厨房" >厨房</option>'+
                                        '<option value="书房" >书房</option>'+
                                        '<option value="卫生间" >卫生间</option>'+
                                        '<option value="阳台" >阳台</option>'+
                                        '<option value="外景" >外景</option>'+
                                        '<option value="其它" >其它</option>'+
                                    '</select>'+
                                '</div>'+
                                '<div class="layui-input-inline">'+
                                    '<select  name="image_nums'+img+'"  >'+
                                        '<option value="" >序号</option>'+
                                        '<option value="1" >1</option>'+
                                        '<option value="2" >2</option>'+
                                        '<option value="3" >3</option>'+
                                        '<option value="4" >4</option>'+
                                        '<option value="5" >5</option>'+
                                    '</select>'+
                                    
                                '</div>'+

                                '<div class="layui-input-inline">'+
                                    '<input type="text" name="image_area'+img+'" placeholder="面积" class="layui-input">'+
                                '</div>'+

                                '<div style="margin-top: 18px;width: 120px;" class="layui-input-inline layui-progress" lay-filter="demo'+nums+'" lay-showpercent="true">'+
                                  '<div class="layui-progress-bar demo'+nums+'"  lay-percent="100%"></div>'+
                                '</div>'+

                                '<div class="layui-upload-list">'+
                                    '<img class="layui-upload-img" src='+ result +'>'+
                                    '<a class="layui-btn update up'+img+'" data-id="'+img+'" data-name="'+img+'" style="margin-left:5px" >上传</a>'+
                                '</div>'+
                            '</div>'
                        );
                        nums = nums +1;
                        form.render('select');
                  });
                }
                ,progress: function(n, elem, res, index){
                    layui.use('element', function(){
                        var element = layui.element;
                         //进行动态绑
                        //第一次执行进度回调函数的时候，对进度条进行初始化
                        if(come == 0){
                            layui.element.init();
                            come ++;
                        }
                        var percent = n  //获取进度百分比

                        //算出已有子元素
                        if(index_come == 0){
                            index = index.substr(index.length-1,1)
                        }else{
                            index_come = $('.layui-progress').length
                            index = index.substr(index.length-1,1)
                            index =  Number(index) + Number(index_come) -1
                        }
                        //index_come = $('.layui-progress').length
                        //index = Number(index_come) - 1
                        element.progress('demo'+index, percent+'%');
                        $('.demo'+index).attr('lay-percent',percent);
                    });
                }
                ,done: function(res, index){
                    //index = index.substr(index.length-1,1)
                    if(res.code>0){
                        $('#uploader-list').append(
                            '<input type="hidden" name="image_url'+res.info+'"  lay-verify="required"  value="'+res.url+'">'
                        )
                        up_img(res.info)
                        //num = num +1;
                    }else{
                        //如果上传失败
                        return layer.msg('上传失败');
                    }
                }
                ,allDone: function(obj){ //当文件全部被提交后，才触发
                    layer.msg('成功'+obj.successful+'张，失败'+obj.aborted+'张', {time: 1800, icon: 1});
                    //console.log(obj.total); //得到总文件数
                    //console.log(obj.successful); //请求成功的文件数
                    //console.log(obj.aborted); //请求失败的文件数
                }
              });
              //上传图片
                $(document).on("click", ".update", function(event){

                    var doc = $(this)
                    var id = doc.attr('data-id');
                    var image_name = $("select[name='image_name"+id+"']").val()
                    var storey = $("select[name='storey']").val()
                    
                    if(image_name == ''){
                        return layer.msg('请选择房间位置');
                    }
                    var image_nums = $("select[name='image_nums"+id+"']").val()
                    var image_url = $("input[name='image_url"+id+"']").val()
                    if(!image_url){
                        return layer.msg('图片上传中...');
                    }
                    var image_area = $("input[name='image_area"+id+"']").val()
                    doc.text('上传中...')
                    doc.removeClass('update')
                    doc.addClass('layui-btn-danger')
                    $.post("",{'order_id':412672,'image_name':image_name,'image_url':image_url,'image_nums':image_nums,'image_area':image_area,'storey':storey}, function (res) {
                        if (res.code > 0) {
                            doc.removeClass('layui-btn-danger')
                            doc.text('上传成功')
                        } else {
                            doc.text('上传失败')
                            doc.addClass('update')
                        }
                    });

                });

                function up_img(name){
                    var doc = $('.up'+name)
                    if(name == ''){
                        return layer.msg('请选择房间位置');
                    }
                    var image_nums = $("select[name='image_nums"+name+"']").val()
                    var image_url = $("input[name='image_url"+name+"']").val()
                    var storey = $("select[name='storey']").val()
                    if(!image_url){
                        return layer.msg('图片上传中...');
                    }
                    var image_area = $("input[name='image_area"+name+"']").val()
                    doc.text('上传中...')
                    doc.removeClass('update')
                    doc.addClass('layui-btn-danger')
                    $.post("",{'order_id':412672,'image_name':name,'image_url':image_url,'image_nums':image_nums,'image_area':image_area,'storey':storey}, function (res) {
                        if (res.code > 0) {
                            doc.removeClass('layui-btn-danger')
                            doc.text('上传成功')
                        } else {
                            doc.text('上传失败')
                            doc.addClass('update')
                        }
                    });
                }

                function up_imgs(id){
                    var doc = $('.up'+id)
                    var image_name = $("select[name='image_name"+id+"']").val()
                    if(image_name == ''){
                        return layer.msg('请选择房间位置');
                    }
                    var image_nums = $("select[name='image_nums"+id+"']").val()
                    var image_url = $("input[name='image_url"+id+"']").val()
                    if(!image_url){
                        return layer.msg('图片上传中...');
                    }
                    var image_area = $("input[name='image_area"+id+"']").val()
                    doc.text('上传中...')
                    doc.removeClass('update')
                    doc.addClass('layui-btn-danger')
                    $.post("",{'order_id':412672,'image_name':image_name,'image_url':image_url,'image_nums':image_nums,'image_area':image_area}, function (res) {
                        if (res.code > 0) {
                            doc.removeClass('layui-btn-danger')
                            doc.text('上传成功')
                        } else {
                            doc.text('上传失败')
                            doc.addClass('update')
                        }
                    });
                }
                $(document).on("mouseenter mouseleave", ".file-iteme", function(event){
                    if(event.type === "mouseenter"){
                        //鼠标悬浮
                        $(this).children(".info").fadeIn("fast");
                        $(this).children(".handle").fadeIn("fast");
                    }else if(event.type === "mouseleave") {
                        //鼠标离开
                        $(this).children(".info").hide();
                        $(this).children(".handle").hide();
                    }
                });

              // 删除图片
                $(document).on("click", ".file-iteme .handle", function(event){
                    $(this).parent().remove();  
                });

        });
    }]);
</script>