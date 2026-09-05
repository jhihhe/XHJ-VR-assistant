
            {{# if(d.status==1){ }}
                <div class="layui-table-cell laytable-cell-1-type" style="">未上传</div>
            {{# }else if(d.status==2){ }}
                <div class="layui-table-cell laytable-cell-1-type" style="color:green;">已上传</div>
            {{# }else if(d.status==3){ }}
                <div class="layui-table-cell laytable-cell-1-type" style="color:#009688;">已发布</div>
            {{# }else if(d.status==4){ }}
                <div class="layui-table-cell laytable-cell-1-type" style="color:red;">已下架</div>
            {{# }else{  }}
                <div class="layui-table-cell laytable-cell-1-type" style="color:#009688;">已同步</div>    
            {{# } }}


            {{# if(d.hxt_tb==1){ }}
                <div class="layui-table-cell laytable-cell-1-type" >同步</div>
            {{# }else{  }}
                <div class="layui-table-cell laytable-cell-1-type" >不同步</div>    
            {{# } }}


    {{# if(d.status==1){ }}
        <a href="/houseadmin/pano/image.html?order_id={{d.id}}" class="layui-btn layui-btn-xs" >上传</a>
        <!-- <a href="javascript:void(0)"  class="layui-btn layui-btn-warm layui-btn-xs" lay-event="del_order" >删除</a>  -->
    {{# }else if(d.status==2){ }}
        <a href="/houseadmin/pano/image.html?order_id={{d.id}}" class="layui-btn layui-btn-xs" >上传</a>
          
            {{# if(d.mark==1){ }}
                <a href="javascript:void(0)" class="layui-btn layui-btn-danger layui-btn-xs" lay-event="cancel_mark" >取消标记</a>
            {{# } }}
            {{# }else if(d.status==3){ }}
          
            <a href="/home/index/house_index.html?house_nums={{d.house_nums}}" target="view_window" class="layui-btn layui-btn-xs layui-btn-xs" >预览</a> 
            <a href="/home/index/down_hxt.html?house_nums={{d.house_nums}}" target="view_window" class="layui-btn layui-btn-xs layui-btn-warm js-hxt-btn" >户型图</a>
                <!-- <a href="/home/index/hxt.html?order_id={{d.id}}" target="view_window" class="layui-btn layui-btn-xs " >查看</a> -->
    {{# }else if(d.status==5){ }}
                    <a href="javascript:void(0)" class="layui-btn layui-btn-danger layui-btn-xs" lay-event="invalid" >无效</a>
                <a href="/home/index/house_index.html?house_nums={{d.house_nums}}" target="view_window" class="layui-btn layui-btn-xs layui-btn-xs" >预览</a> 
        <a href="/home/index/tb_hxt.html?house_nums={{d.house_nums}}" target="view_window" class="layui-btn layui-btn-xs layui-btn-warm js-hxt-btn" >户型图</a> 
            {{# }else{  }}
        <a href="javascript:void(0)"  class="layui-btn layui-btn-warm layui-btn-xs" lay-event="del_order">删除</a> 
    {{# } }}
    <a href="javascript:void(0)" class="layui-btn layui-btn-xs" lay-event="detail">详情</a>


    layui.use(['table','form','laydate','upload'], function() {
        var table = layui.table,laydate = layui.laydate,form = layui.form, $ = layui.jquery,upload = layui.upload;
        var mark = 0;
        var lastHxtClickTime = 0;
        var hxtClickInterval = 5000;
        var tableIn = table.render({
            id: 'order',
            elem: '#order',
            url: '/houseadmin/pano/index.html',
            method: 'post',
            page: true,
            cols: [[
                /*{checkbox:true,fixed: true},*/
               /* {field: 'id', title: '编号', width: 80, fixed: true},*/
               {field: 'city', title: '城市', width: 110},
                {field: 'house_name', title: '楼盘名称', width: 120},
                {field: 'house_nums', title: '房源编号', width: 160},
                
                {field: 'realname', title: '摄影师', width: 110},
                {field: 'fb_name', title: '设计师', width: 90},
                {field: 'sc_name', title: '上传人', width: 90},
                {field: 'status', title: '全景状态', width: 105,toolbar: '#order_status'},
                {field: 'hxt_tb', title: '户型图', width: 105,toolbar: '#hxt_tb'},
                {field: 'toward', title: '朝向', width: 60},
                {field: 'room', title: '卧室(室)', width: 90},
                {field: 'image_time', title: '全景时间',width: 180,
                        templet: function(d){
                            if (d.image_time) {
                                return layui.util.toDateString(d.image_time*1000, 'yyyy-MM-dd HH:mm:ss');
                            } else {
                                return '';
                            }
                        }
                },
                {field: 'tb_time', title: '同步时间',width: 180,
                        templet: function(d){
                            if (d.tb_time) {
                                return layui.util.toDateString(d.tb_time*1000, 'yyyy-MM-dd HH:mm:ss');
                            } else {
                                return '';
                            }
                        }
                },
                /*{field: 'create_time', title: '创建时间',templet:"<div>{{layui.util.toDateString(d.create_time*1000, 'yyyy-MM-dd HH:mm:ss')}}</div>", width: 180},*/
                {width: 400, title: '操作',align: 'center', toolbar: '#action'}
            ]],
            done: function(res, curr, count){
                mark = res.mark;
                // 设置背景颜色
                res.data.forEach(function(item,index,self){
                    // 判断想要改变的条件
                    if(item.mark == '1'){
                        // 给 表格设置背景色
                        $('.layui-table').find('tr[data-index ='+index+']').css("background-color","#FFFFE0");
                    }
                });
            },
            limit: 15 //每页默认显示的数量
        });

        $(document).on('click', '.js-hxt-btn, a[href*="/home/index/tb_hxt"], a[href*="/home/index/down_hxt"]', function(e) {
            var now = Date.now();
            var diff = now - lastHxtClickTime;
            if (diff < hxtClickInterval) {
                e.preventDefault();
                e.stopImmediatePropagation();
                layer.msg('户型图生成较耗时，请' + Math.ceil((hxtClickInterval - diff) / 1000) + '秒后再试', {time: 1600, icon: 0});
                return false;
            }
            lastHxtClickTime = now;
        });
       
        // 时间范围
        laydate.render({
            elem: '#startTime'
        });
        laydate.render({
            elem: '#endTime'
        });
        // 时间范围
        laydate.render({
            elem: '#startTimes'
        });
        laydate.render({
            elem: '#endTimes'
        });
        //普通图片上传
        var uploadInst = upload.render({
            elem: '#daoru'
            ,url: '/houseadmin/up_files/file.html'
            ,accept: 'file' //允许上传的文件类型
            ,done: function(res){
                if(res.code>0){
                    $.post('/houseadmin/order/upfile.html',{'url':res.url}, function (res) {
                        if (res.code > 0) {
                            layer.msg(res.msg);
                        } else {
                            layer.msg('上传失败');
                        }
                    });
                }else{
                    //如果上传失败
                    layer.msg('上传失败');
                }
            }
        });

        table.on('tool(order)', function(obj) {
            var data = obj.data;
            if (obj.event === 'dercarriage'){
                    var loading = layer.load(1, {shade: [0.1, '#fff']});
                    $.post("dercarriage", {'order_id':data.id}, function (res) {
                        layer.close(loading);
                        if (res.code > 0) {
                            layer.msg(res.msg,{time:1000,icon:1});
                            tableIn.reload();
                        } else {
                            layer.msg(res.msg, {time: 1800, icon: 2});
                        }
                    });

            }else if(obj.event === 'new_dercarriage'){
                    var loading = layer.load(1, {shade: [0.1, '#fff']});
                    if(data.mark == 1){
                        layer.msg('当前订单被标记，不可发布', {time: 1800, icon: 2});
                        return false;
                    }
                    $.post("new_dercarriage", {'order_id':data.id}, function (res) {
                        layer.close(loading);
                        if (res.code > 0) {
                            layer.msg(res.msg,{time:1000,icon:1});
                            layer.close(loading);
                            // 新增 class
                            var type = 2;
                            // 新增 class
                            $("#order_type").addClass('layui-btn-primary');
                            // 移除 class
                            $("#order_types").removeClass('layui-btn-primary');
                            $('#key').val(data.house_nums)
                            var key = data.house_nums;
                            var status = '';
                            var uid = '';
                            var fb_uid = '';
                            var startTime = '';
                            var endTime = '';
                            var startTimes = '';
                            var endTimes = '';
                            var city = '';
                            tableIn.reload({where: {key: key,status:status,uid:uid,fb_uid:fb_uid,startTime:startTime,endTime:endTime,startTimes:startTimes,endTimes:endTimes,city:city,type:type}});
                            //tableIn.reload();
                        } else {
                            //console.log(res.obj)
                            layer.msg(res.msg, {time: 1800, icon: 2});
                        }
                    });
            }else if(obj.event === 'undercarriage'){
                    var loading = layer.load(1, {shade: [0.1, '#fff']});
                    $.post("undercarriage",{'order_id':data.id},function(res){
                        layer.close(loading);
                        if(res.code===1){
                            layer.msg(res.msg,{time:1000,icon:1});
                            tableIn.reload();
                        }else{
                            layer.msg(res.msg,{time:1000,icon:2});
                        }
                    });
            }else if(obj.event === 'del_order'){
                layer.confirm('您确定要删除数据吗？', function(index){
                    var loading = layer.load(1, {shade: [0.1, '#fff']});
                    $.post("del_order",{'id':data.id,'house_nums':data.house_nums},function(res){
                        layer.close(loading);
                        if(res.code===1){
                            layer.msg(res.msg,{time:1000,icon:1});
                            tableIn.reload();
                        }else{
                            layer.msg(res.msg,{time:1000,icon:2});
                        }
                    });
                });    
            }else if(obj.event === 'mark'){
                if(mark == 2){
                    layer.msg('标记数量已达上限',{time:1000,icon:2});
                    return false;
                }
                var wp = layer.open({
                    type: 2, 
                    title:'即设计师对全景图片有异议,以标记告知摄影师需要对全景图片处理:以及摄影师处理的备注回复记录',
                    area: ['800px', '600px'],
                    content: "/houseadmin/pano/mark.html?order_id="+data.id+"&type=1"
                });
            }else if(obj.event === 'cancel_mark'){
                var wp = layer.open({
                    type: 2, 
                    title:'即设计师对全景图片有异议,以标记告知摄影师需要对全景图片处理:以及摄影师处理的备注回复记录',
                    area: ['800px', '600px'],
                    content: "/houseadmin/pano/mark.html?order_id="+data.id+"&type=2"
                });
            }else if(obj.event === 'invalid'){
                const index = layer.open({
                    type: 2,
                    title: '即将房源详情全进及户型图下架;选择重拍，全景状态恢复至未上传状态;选择修改，全泉状态恢复到已上传状态',
                    area: ['800px', '300px'],
                    content: "/houseadmin/pano/invalid.html?id="+data.id
                }); 
            }else if(obj.event === 'transfer'){
                const index = layer.open({
                    type: 2,
                    title: '转单即设计师订单转移给接受人，由接受设计师完成订单后续流程',
                    area: ['550px', '500px'],
                    content: "/houseadmin/pano/transfer.html?id="+data.id+"&house_nums="+data.house_nums+"&house_name="+data.house_name
                }); 
            }else if(obj.event === 'detail'){
                const index = layer.open({
                    type: 2,
                    title: '操作详情',
                    area: ['1000px', '700px'],
                    content: "/houseadmin/pano/detail.html?id="+data.id+"&house_name="+data.house_name+"&realname="+data.realname+"&create_time="+data.create_time+"&house_nums="+data.house_nums
                }); 
            }else if(obj.event === 'synchronous'){
                const index = layer.open({
                    type: 2,
                    title: '同步(既同步到房源详情上呈现)',
                    area: ['500px', '300px'],
                    content: "/houseadmin/pano/synchronous.html?username="+data.username+"&house_nums="+data.house_nums
                }); 
            }else if(obj.event === 'unsynchronous'){
                layer.confirm('您确定是否取消同步？', function(index){
                    const house_nums = data.house_nums;
                    xiangShiToken = '1760b4a03e80cfbf700abbf8cb6048a0';
                    $.ajax({  ///xiangshi/unXiangshiSynchronous
                        url: 'https://api.xhj.com/api/xhj-bms/houseSurveyImg/xiangshi/unXiangshiSynchronous', // 替换成你的API端点
                        type: 'POST',
                        data: JSON.stringify({ // 将对象转为字符串
                            houseSourceNumber: house_nums,
                            account: "100",
                            xiangShiToken: "1760b4a03e80cfbf700abbf8cb6048a0"
                        }),
                        dataType: 'json', // 期望返回的数据类型
                        contentType: 'application/json; charset=UTF-8', // 发送JSON数据
                        success: function(res) {
                            console.log(res);
                            //if (res.code == 200) {
                            if (res.code == 200 && res.success == true) {    
                                var loading = layer.load(1, {shade: [0.1, '#fff']});
                                $.post("unsynchronous",{'house_nums':house_nums},function(res){
                                    layer.close(loading);
                                    if(res.code===1){
                                        layer.msg(res.msg,{time:1000,icon:1});
                                    }else{
                                        //var loading = layer.load(1, {shade: [0.1, '#fff']});
                                        //layer.close(loading);
                                        layer.msg(res.msg, {time: 1000, icon: 2});
                                    }
                                });
                            }else {
                                
                                layer.msg(res.msg, {time: 1800, icon: 2});
                                layer.close(loading);
                                
                            }
                        },
                        error: function(error) {
                            console.error('Error:', error);
                            // 在这里处理错误的情况
                        }
                    });
                });    
            }else if(obj.event === 'abnormal'){
                var wp = layer.open({
                    type: 2, 
                    title:'即设计师对全景图片有异议，无法处理',
                    area: ['800px', '600px'],
                    content: "/houseadmin/pano/abnormal.html?order_id="+data.id+"&house_nums="+data.house_nums
                });
            }
        });
        //设计师接单
        $('#receive').on('click', function() {
            // 提交到方法 默认为本身
            var loading = layer.load(1, {shade: [0.1, '#fff']});
            $.post("receive",{group_id:5}, function (res) {
                layer.close(loading);
                if (res.code > 0) {
                    layer.msg(res.msg,{time:1000,icon:1});
                    tableIn.reload();
                } else {
                    layer.msg(res.msg, {time: 1800, icon: 2});
                }
            });
        });
         //搜索
        $('#order_type').on('click', function() {
            var type = $(this).data('value');

            // 新增 class
            $("#order_types").addClass('layui-btn-primary');
            // 移除 class
            $(this).removeClass('layui-btn-primary');
            var key = $.trim($('#key').val());
            var status = $('#status').val();
            var uid = $('#uid').val();
            var fb_uid = $('#fb_uid').val();
            var sc_uid = $('#sc_uid').val();
            var startTime = $('#startTime').val();
            var endTime = $('#endTime').val();
            var startTimes = $('#startTimes').val();
            var endTimes = $('#endTimes').val();
            var city = $.trim($('#city').val());
            tableIn.reload({where: {key: key,status:status,uid:uid,fb_uid:fb_uid,sc_uid:sc_uid,startTime:startTime,endTime:endTime,startTimes:startTimes,endTimes:endTimes,city:city,type:type}});
        });

        //搜索
        $('#order_types').on('click', function() {
            var type = $(this).data('value');
            // 新增 class
            $("#order_type").addClass('layui-btn-primary');
            // 移除 class
            $(this).removeClass('layui-btn-primary');
            var key = $.trim($('#key').val());
            var status = $('#status').val();
            var uid = $('#uid').val();
            var fb_uid = $('#fb_uid').val();
            var sc_uid = $('#sc_uid').val();
            var startTime = $('#startTime').val();
            var endTime = $('#endTime').val();
            var startTimes = $('#startTimes').val();
            var endTimes = $('#endTimes').val();
            var city = $.trim($('#city').val());
            tableIn.reload({where: {key: key,status:status,uid:uid,fb_uid:fb_uid,sc_uid:sc_uid,startTime:startTime,endTime:endTime,startTimes:startTimes,endTimes:endTimes,city:city,type:type}});
        });
         //搜索
        $('#search').on('click', function() {
            var key = $.trim($('#key').val());
            var status = $('#status').val();
            var uid = $('#uid').val();
            var fb_uid = $('#fb_uid').val();
            var sc_uid = $('#sc_uid').val();
            var startTime = $('#startTime').val();
            var endTime = $('#endTime').val();
            var startTimes = $('#startTimes').val();
            var endTimes = $('#endTimes').val();
            var city = $.trim($('#city').val());
            tableIn.reload({where: {key: key,status:status,uid:uid,fb_uid:fb_uid,sc_uid:sc_uid,startTime:startTime,endTime:endTime,startTimes:startTimes,endTimes:endTimes,city:city}});
        });
        
        
    });
