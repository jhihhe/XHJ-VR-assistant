
    layui.use(['form', 'layer','upload'], function () {
        var form = layui.form, layer = layui.layer,$= layui.jquery,upload = layui.upload;
        var info = {"admin_id":100,"username":"221105371","group_id":5,"email":null,"realname":"\u8d3a\u5fd7","tel":null,"ip":"222.247.20.138","add_time":1716190044,"mdemail":"0","is_open":1,"avatar":"\/uploads\/20260319\/9fccb82206d6678e0ad19e63a9d51b0b.jpeg","true_name":"0","card":"0","openid":"0","set_name":null,"set_time":null,"set_nums":0,"city":"\u957f\u6c99","cookie_id":1788599587,"sys_id":"0"};
        form.val("form", info);
        if(info){
            $('#adPic').attr('src',info.avatar);
        }
        form.render();
        form.on('submit(submit)', function (data) {
            loading =layer.load(1, {shade: [0.1,'#fff']});
            $.post("", data.field, function (res) {
                layer.close(loading);
                if (res.code > 0) {
                    layer.msg(res.msg, {time: 1800, icon: 1}, function () {
                        location.href = res.url;
                    });
                } else {
                    layer.msg(res.msg, {time: 1800, icon: 2});
                }
            });
        });
        //普通图片上传
        var uploadInst = upload.render({
            elem: '#adBtn'
            ,url: '/houseadmin/up_files/upload.html'
            ,before: function(obj){
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result){
                    $('#adPic').attr('src', result); //图片链接（base64）
                });
            },
            done: function(res){
                if(res.code>0){
                    $('#avatar').val(res.url);
                }else{
                    //如果上传失败
                    return layer.msg('上传失败');
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
    });
