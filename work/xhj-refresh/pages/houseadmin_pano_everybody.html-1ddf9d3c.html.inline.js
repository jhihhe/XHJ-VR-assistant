
    layui.use(['table','form','laydate','upload'], function() {
        var table = layui.table,laydate = layui.laydate,form = layui.form, $ = layui.jquery,upload = layui.upload;
        var tableIn = table.render({
            id: 'order',
            elem: '#order',
            url: '/houseadmin/pano/everybody.html?type='+1,
            method: 'post',
            cols: [[
                /*{checkbox:true,fixed: true},*/
                {field: 'group_name', title: '角色', width: 80, fixed: true},
                {field: 'name', title: '姓名', width: 120},
                {field: 'num1', title: '有效', width: 80},
                {field: 'num2', title: '待接单', width: 80},
                {field: 'num3', title: '已接单', width: 80},
                {field: 'num4', title: '无效', width: 80},
                {field: 'num5', title: '未上传全景', width: 105},
                {field: 'num6', title: '已上传全景', width: 105},
                {field: 'num7', title: '已发布全景', width: 105},
                {field: 'num8', title: '已同步全景', width: 105},
                {field: 'num9', title: '已标记', width: 105},
            ]]
        });
       
        // 时间范围
        laydate.render({
            elem: '#startTime'
        });
        laydate.render({
            elem: '#endTime'
        });
         //搜索
        $('#search').on('click', function() {
            var startTime = $('#startTime').val();
            var endTime = $('#endTime').val();
            tableIn.reload({where: {startTime:startTime,endTime:endTime}});
        });
    });
