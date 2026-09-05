
  {{# if(d.image_url){ }}<img src="{{d.image_url}}?x-oss-process=image/resize,m_fill,h_100,w_200" onmouseover="big_image();" >{{# } }} 


            {{# if(d.point){ }}
                                    <a href="/houseadmin/pano/pixelate.html?id={{d.id}}" target="view_window" class="layui-btn layui-btn-xs" >打码</a> 
                            {{# }else{  }}
                <div class="layui-table-cell laytable-cell-1-type" style="color:red;">未获取</div>
            {{# } }}
            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="sel">替换</a>


            {{# if(d.flag){ }}
           <a class="layui-btn layui-btn-xs" lay-event="point">坐标</a> 
        {{# }else{  }}
             <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="image_preprocess">矫正</a> 
        {{# } }}
        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
        


    layui.use(['table','form'], function() {
        var table = layui.table,form = layui.form,$ = layui.jquery;
        var tableIn = table.render({
            id: 'image',
            elem: '#list',
            url: '/houseadmin/pano/image.html',
            method: 'post',
            page:true,
            where :{order_id:596736},
            cols: [[
                {checkbox: true, fixed: true},
                {field: 'id', title: '编号', width: 80, fixed: true},
                {field: 'image_url', title: '全景图', width: 180,templet: '#title'},
                {field: 'image_url', title: '地址', width: 600},
                {field: 'point', title: '坐标', width: 120,templet: '#point'},
                {field: 'image_name', title: '所属位置', width: 100, edit: 'text'},
                {field: 'image_area', title: '面积', width: 100},
                {field: 'create_time', title: '添加时间',templet:"<div>{{layui.util.toDateString(d.create_time*1000, 'yyyy-MM-dd HH:mm:ss')}}</div>", width: 180},
                {width: 120, title: '操作', align: 'center', toolbar: '#action'}
            ]],
            limit:10
           
        });

        table.on('tool(list)', function(obj) {
            var data = obj.data;
            if (obj.event === 'del'){
                layer.confirm('您确定要删除该全景图吗？', function(index){
                    var loading = layer.load(1, {shade: [0.1, '#fff']});
                    $.post("/houseadmin/pano/image_del.html",{id:data.id,order_id:data.order_id},function(res){
                        layer.close(loading);
                        if(res.code===1){
                            layer.msg(res.msg,{time:1000,icon:1});
                            tableIn.reload();
                        }else{
                            layer.msg('操作失败！',{time:1000,icon:2});
                        }
                    });
                    layer.close(index);
                });
            }else if(obj.event === 'point'){
                // 提交到方法 默认为本身
                var loading = layer.load(1, {shade: [0.1, '#fff']});
                $.post("add_image_points", {'id':data.id}, function (res) {
                    layer.close(loading);
                    if (res.code > 0) {
                        layer.msg(res.msg,{time:1000,icon:1});
                        tableIn.reload();
                    } else {
                        layer.msg(res.msg, {time: 1800, icon: 2});
                    }
                });
            }else if(obj.event === 'image_preprocess'){
                // 提交到方法 默认为本身
                var loading = layer.load(1, {shade: [0.1, '#fff']});
                $.post("image_preprocess", {'order_id':data.order_id,'image_id':data.id}, function (res) {
                    layer.close(loading);
                    if (res.code > 0) {
                        layer.msg(res.msg,{time:1000,icon:1});
                        tableIn.reload();
                    } else {
                        layer.msg(res.msg, {time: 1800, icon: 2});
                    }
                });
            }else if(obj.event === 'pixelate'){
                layer.open({
                    type: 2, 
                    title:'打码',
                    area: ['1200px','600px'],
                    content: "/houseadmin/pano/pixelate.html?id="+data.id
                }); 
            }else if(obj.event === 'sel'){
                var loading = layer.load(1, {shade: [0.1, '#fff']});
                $.post("/houseadmin/pano/select_point.html", {'id':data.id,'order_id':data.order_id}, function (res) {
                    layer.close(loading);
                    if (res.code > 0) {
                        layer.msg(res.msg,{time:1000,icon:1});
                        tableIn.reload();
                    } else {
                        layer.msg(res.msg, {time: 1800, icon: 2});
                    }
                });
            }
        });
       

        //新增全景图
        $('#add_image').on('click', function() {
            layer.open({
                type: 2, 
                title:'新增全景图',
                area: ['800px', '600px'],
                content: "/houseadmin/pano/add_image.html?order_id=596736"
            }); 
        });
         //一键删除全景
        $('#del_image').on('click', function() {
            layer.confirm('您确定要全部删除全景图吗？', function(index){
                var loading = layer.load(1, {shade: [0.1, '#fff']});
                $.post("/houseadmin/pano/del_image.html",{order_id:596736},function(res){
                    layer.close(loading);
                    if(res.code===1){
                        layer.msg(res.msg,{time:1000,icon:1});
                        tableIn.reload();
                    }else{
                        layer.msg('操作失败！',{time:1000,icon:2});
                    }
                });
                layer.close(index);
            });
        });
         //一键生成坐标点
        $('#add_image_point').on('click', function() {
            // 提交到方法 默认为本身
            var loading = layer.load(1, {shade: [0.1, '#fff']});
            $.post("add_image_point", {'order_id':596736}, function (res) {
                layer.close(loading);
                if (res.code > 0) {
                    layer.msg(res.msg,{time:1000,icon:1});
                    tableIn.reload();
                } else {
                    layer.msg(res.msg, {time: 1800, icon: 2});
                }
            });
        });

        //保存
        $('#add_save').on('click', function() {
            const index = layer.open({
                type: 2,
                title: '朝向户型图选择',
                area: ['400px', '350px'],
                content: "/houseadmin/pano/add_save.html?order_id=596736"
            }); 
        });

        //一键预处理
        $('#preprocess').on('click', function() {
            // 提交到方法 默认为本身
            var loading = layer.load(1, {shade: [0.1, '#fff']});
            $.post("preprocess", {'order_id':596736}, function (res) {
                layer.close(loading);
                if (res.code > 0) {
                    layer.msg(res.msg,{time:1000,icon:1});
                    tableIn.reload();
                } else {
                    layer.msg(res.msg, {time: 1800, icon: 2});
                }
            });
        });

        //一键清除
        $('#image_clear').on('click', function() {
            // 提交到方法 默认为本身
            layer.confirm('您确定要一键清除数据吗？', function(index){
                var loading = layer.load(1, {shade: [0.1, '#fff']});
                $.post("/houseadmin/pano/image_clear.html",{order_id:596736},function(res){
                    layer.close(loading);
                    if(res.code===1){
                        layer.msg(res.msg,{time:1000,icon:1});
                        tableIn.reload();
                    }else{
                        layer.msg('操作失败！',{time:1000,icon:2});
                    }
                });
                layer.close(index);
            });
        });
        //修改名称
        //监听单元格编辑
          table.on('edit(list)', function(obj){
                data = obj.data //得到所在行所有键值
                var value = obj.value //得到修改后的值
                $.post('/houseadmin/pano/up_image_name.html',{id:data.id,image_name:value},function(res){
                    if(res.code==1){
                        layer.msg(res.msg,{time:1000,icon:1},function(){
                            //tableIn.reload();
                        });
                    }else{
                        layer.msg(res.msg,{time:1000,icon:2});
                        
                    }
               })
          });

       
        //放大图片
        window.big_image = function(obj) {
            var img_show = null; // tips提示
            $('td img').hover(function(){
                //alert($(this).attr('src'));
                var img = "<img class='img_msg' src='"+$(this).attr('src')+"' style='width:600px;height:300px' />";
                img_show = layer.tips(img, this,{
                    tips:[2, '#fff']
                });
            },function(){
                layer.close(img_show);
            });
        }

    })
