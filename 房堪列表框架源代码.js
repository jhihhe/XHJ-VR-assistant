
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
    .layui-layer-btn .layui-layer-btn1 {
        background-color: #1E9FFF;
        color: #fff;
    }
    .layui-layer-btn .layui-layer-btn0 {
        background-color: #fff;
        color: #333;
    }
    /* 自定义标题字体颜色 */
    .layui-layer-title {
      color: red; /* 设置标题字体颜色为红色 */
      background-color: #f5f5f5; /* 背景色 */
      border-bottom: 1px solid #d2d2d2; /* 边框 */
    }
</style>
<div class="admin-main layui-anim layui-anim-upbit">
     <form class="layui-form" disabled>
        <div class="demoTable">
         <div class="layui-inline">
            <input class="layui-input" name="key" value="" id="key" placeholder="房源编号">
        </div>

        <div class="layui-inline layui-form" >
            <select name="status" lay-search="" id="status"  lay-filter="test_user" >
                    <option value="">订单状态</option>
                    <option value="0" >无效</option>
                    <option value="1" >有效</option>
                    <option value="2" >待接单</option>
                    <option value="3" >已接单</option>
                    <option value="4" >取消</option>
                    <option value="5" >举报</option>
            </select>
        </div>
            <div class="layui-inline layui-form" >
                <select name="province" lay-search="" id="fuzong" lay-filter="province" >
                        <option value="0">副总区</option>
                                                <option value="100035" >河西姚以副总区</option>
                                                <option value="110736" >行政综合管理部副总区-撤销</option>
                                                <option value="110741" >廖利双副总区</option>
                                                <option value="100047" >株洲副总区</option>
                                                <option value="100066" >雨花城南区(刘政)</option>
                                                <option value="100067" >星沙区(王明琪/邱广武)</option>
                                                <option value="100068" >雨花红星区(汤冰)</option>
                                                <option value="100069" >岳麓望城区(姚苡/张建勇)</option>
                                                <option value="100070" >湘江新区(周科峰)</option>
                                                <option value="100071" >开福区(杨武/邓志宏)</option>
                                                <option value="100072" >芙蓉城东区(彭万)</option>
                                                <option value="100073" >天心城东区(陈伟艳)</option>
                                                <option value="100074" >中心直辖区(罗峰)</option>
                                                <option value="100075" >天心省府区(杨理)</option>
                                                <option value="101645" >测试副总1</option>
                                                <option value="107246" >想到家刘政副总区</option>
                                                <option value="107247" >想到家彭万副总区</option>
                                                <option value="107259" >XMH西点军团(姚苡)</option>
                                                <option value="107260" >XMH赤焰军团(杨武/邓志宏)</option>
                                                <option value="107261" >XMH东南战区(彭万)</option>
                                                <option value="107262" >XMH金刚团(陈伟艳)</option>
                                                <option value="107263" >XMH中央军团(罗峰)</option>
                                                <option value="107264" >XMH省府军团(杨理)</option>
                                                <option value="107265" >XMH岳麓新区(周科峰)</option>
                                                <option value="107266" >XMH野狼团(刘政)</option>
                                                <option value="107267" >XMH火箭军团(王明琪/邱广武)</option>
                                                <option value="107268" >XMH红星军团(汤冰)</option>
                                                <option value="108461" >芙蓉尚东区(钟志)</option>
                                                <option value="108589" >XMH加盟副总区</option>
                                                <option value="108644" >XMH钟志副总区</option>
                                                <option value="108966" >胡炜副总区</option>
                                                <option value="108967" >李静伟副总区</option>
                                                <option value="108968" >刘星乐副总区</option>
                                                <option value="108969" >倪倩副总区</option>
                                                <option value="108970" >阳树林副总区</option>
                                                <option value="108971" >张正方副总区</option>
                                                <option value="108973" >刘锦宏副总区</option>
                                                <option value="108974" >文国旗副总区</option>
                                                <option value="108975" >张得亮副总区</option>
                                                <option value="108976" >付永强副总区</option>
                                                <option value="108977" >聂宁副总区</option>
                                                <option value="108978" >匡杰雄副总区</option>
                                                <option value="108979" >廖春燕副总区</option>
                                                <option value="108981" >赵超贵副总区</option>
                                                <option value="109391" >姚铭副总区</option>
                                                <option value="109527" >株洲测试副总区</option>
                                                <option value="109541" >马喜副总区</option>
                                                <option value="109542" >石若男副总区</option>
                                                <option value="109543" >何鹏副总区</option>
                                                <option value="109544" >曾蓉副总区</option>
                                                <option value="109545" >汪遥副总区</option>
                                                <option value="109546" >王德志副总区</option>
                                                <option value="109547" >李润副总区-撤销</option>
                                                <option value="109548" >陈梦洁副总区</option>
                                                <option value="109549" >伍亮副总区</option>
                                                <option value="109550" >杨雅婷副总区</option>
                                                <option value="109551" >何丹副总区</option>
                                                <option value="109552" >戴鲁副总区</option>
                                                <option value="109553" >程杰副总区</option>
                                                <option value="109554" >朱海燕副总区</option>
                                                <option value="109786" >觅租副总区-撤销</option>
                                                <option value="109792" >定娟副总区</option>
                                                <option value="109793" >龚雷副总区</option>
                                                <option value="109795" >李淼副总区</option>
                                                <option value="109796" >钟伟副总区</option>
                                                <option value="109797" >陈东一副总区</option>
                                                <option value="109798" >陈台香副总区</option>
                                                <option value="109799" >沈杨副总区</option>
                                                <option value="109800" >周波副总区</option>
                                                <option value="109876" >XMH周波副总区</option>
                                                <option value="109877" >XMH陈东一副总区</option>
                                                <option value="109878" >XMH陈台香副总区</option>
                                                <option value="109880" >XMH龚雷副总区</option>
                                                <option value="109881" >XMH定娟副总区</option>
                                                <option value="109883" >XMH钟伟副总区</option>
                                                <option value="109884" >XMH李淼副总区</option>
                                                <option value="109933" >运营副总区-撤销</option>
                                                <option value="109941" >王德志副总区</option>
                                                <option value="109942" >宋海钦副总区(常德)</option>
                                                <option value="109957" >黄兴望副总区1</option>
                                                <option value="109958" >廖小艳副总区1</option>
                                                <option value="109979" >武磨副总区-撤销</option>
                                                <option value="109980" >张英副总区-撤销</option>
                                                <option value="109994" >张兵副总区</option>
                                                <option value="109995" >肖耀南副总区</option>
                                                <option value="109996" >宋绍镰副总区</option>
                                                <option value="110014" >刘云华副总区</option>
                                                <option value="110030" >高翔副总区</option>
                                                <option value="110034" >刘星乐/刘阳胜副总区</option>
                                                <option value="110038" >李远超副总区</option>
                                                <option value="110044" >宋海钦/颜彪副总区(娄底)</option>
                                                <option value="110106" >郁仙枝副总区</option>
                                                <option value="110129" >李龙副总区(衡阳)</option>
                                                <option value="110143" >宋海钦副总区（怀化）</option>
                                                <option value="110147" >杨理副总区</option>
                                                <option value="110214" >海口测试副总</option>
                                                <option value="110238" >杨世晓副总区</option>
                                                <option value="110247" >株洲副总区</option>
                                                <option value="110261" >武汉测试副总</option>
                                                <option value="110274" >贵阳测试副总</option>
                                                <option value="110286" >XMH桃源副总区</option>
                                                <option value="110313" >网络营销部副总区-撤销</option>
                                                <option value="110327" >职能绩效副总区-撤销</option>
                                                <option value="110329" >杨怀远副总区</option>
                                                <option value="110330" >朱红虎副总区</option>
                                                <option value="110384" >湘潭测试副总</option>
                                                <option value="110426" >李静伟/荣兵副总区</option>
                                                <option value="110427" >李静伟/吴邦/廖金花副总区</option>
                                                <option value="110428" >白双灵副总区</option>
                                                <option value="110429" >邹春花副总区</option>
                                                <option value="110432" >高翔/文国旗副总区1</option>
                                                <option value="110439" >赵群/游永红副总区</option>
                                                <option value="110440" >李静伟/潘朝辉副总区</option>
                                                <option value="110441" >左蓉副总区</option>
                                                <option value="110470" >沈天文副总区</option>
                                                <option value="110484" >赵群/李伟副总区</option>
                                                <option value="110510" >新房职能部门副总区-撤销</option>
                                                <option value="110553" >XMH沈天文副总区</option>
                                                <option value="110570" >文境麟副总区</option>
                                                <option value="110581" >益阳测试副总</option>
                                                <option value="110600" >陈祥副总区</option>
                                                <option value="110667" >刘桥辉副总区</option>
                                                <option value="110692" >袁总直管区</option>
                                                <option value="110698" >觅租运营副总区</option>
                                                <option value="110715" >吴闪红副总区</option>
                                                <option value="110726" >王鸿副总区</option>
                                                <option value="110744" >朱凯副总区</option>
                                                <option value="110747" >鄢欢副总区</option>
                                                <option value="110753" >觅租副总区</option>
                                                <option value="110756" >自营副总区</option>
                                                <option value="110808" >AI智能中心副总区(职能)-撤销</option>
                                                <option value="110826" >股东绩效部副总区-撤销</option>
                                                <option value="110887" >后勤中心副总区-撤销</option>
                                                <option value="110891" >唐建超副总区</option>
                                                <option value="110919" >霞辉按揭副总区-撤销</option>
                                                <option value="110938" >网络维护部副总区-撤销</option>
                                                <option value="110942" >客服部副总区-撤销</option>
                                                <option value="110963" >明宾副总区</option>
                                                <option value="110966" >招募中心副总区-撤销</option>
                                                <option value="110972" >郭军副总区1</option>
                                                <option value="110975" >刘凯副总区1</option>
                                                <option value="110978" >陈武副总区</option>
                                                <option value="110981" >市府望城区(张建勇)-撤销</option>
                                                <option value="111002" >袁昊玢副总区</option>
                                                <option value="111014" >职能副总区-撤销</option>
                                                <option value="111064" >想到家V副总一区-撤销</option>
                                                <option value="111131" >选址部副总区-撤销</option>
                                                <option value="111134" >采购部副总区-撤销</option>
                                                <option value="111148" >房勘部副总区-撤销</option>
                                                <option value="111152" >楼盘字典部副总区-撤销</option>
                                                <option value="111176" >XMH王启碌副总区</option>
                                                <option value="111246" >陈台香副总区(长沙)</option>
                                                <option value="111247" >龚雷副总区(长沙)</option>
                                                <option value="111326" >品牌部副总区-撤销</option>
                                                <option value="111347" >XMH王启碌三亚副总区(加盟)</option>
                                                <option value="111457" >品质监察部副总区-撤销</option>
                                                <option value="111579" >新媒体副总区</option>
                                                <option value="111693" >廖春燕直属副总区</option>
                                                <option value="111801" >星居文化副总区-撤销</option>
                                                <option value="111877" >刘绘鹏副总区</option>
                                                <option value="111881" >马凯副总区</option>
                                                <option value="111935" >赵群/李伟副总区(长沙)-撤销</option>
                                                <option value="111939" >张正方副总区(长沙)</option>
                                                <option value="111958" >王德志副总区(长沙)</option>
                                                <option value="112033" >文阳副总区</option>
                                                <option value="112034" >阳峰副总区(岳阳)</option>
                                                <option value="112037" >廖小艳副总区</option>
                                                <option value="112080" >总经办副总区-撤销</option>
                                                <option value="112154" >想到家易联副总区</option>
                                                <option value="112356" >XD加盟副总区(加盟)</option>
                                                <option value="112394" >俞立君副总区</option>
                                                <option value="112597" >陆名伟副总区</option>
                                                <option value="112611" >姜柏宇/尹甜娟副总区</option>
                                                <option value="112816" >刘锦宏直属副总区</option>
                                                <option value="112825" >程杰副总区(长沙)</option>
                                                <option value="112898" >XMH醴陵罗文副总区(加盟)</option>
                                                <option value="112922" >FYY周希副总区(加盟)</option>
                                                <option value="112939" >小象佳缘副总区-撤销</option>
                                                <option value="113004" >唐高波实习副总区</option>
                                                <option value="113018" >XMH唐高波副总区</option>
                                                <option value="113059" >XMH周波副总区1</option>
                                                <option value="113076" >颜彪副总区(娄底)</option>
                                                <option value="113112" >黄兴望副总区</option>
                                                <option value="113177" >郭军副总区</option>
                                                <option value="113182" >李静伟直属副总区</option>
                                                <option value="113186" >赵群/李伟直属副总区</option>
                                                <option value="113193" >旷双平副总区</option>
                                                <option value="113195" >文国旗直属副总区</option>
                                                <option value="113208" >刘凯副总区</option>
                                                <option value="113302" >陈台香副总区(常德)</option>
                                                <option value="113398" >CY副总区-撤销</option>
                                                <option value="113424" >XD王启禄副总区</option>
                                                <option value="113584" >沈天文副总区(长沙)</option>
                                                <option value="113669" >ZY三亚高同青副总区(加盟)</option>
                                                <option value="113781" >朱红虎副总区（XMH）</option>
                                                <option value="113824" >赵芳副总区（XMH)</option>
                                                <option value="113834" >龚永升副总区（XMH)</option>
                                                <option value="113859" >宋维副总区</option>
                                                <option value="113878" >李龙副总区(常德)</option>
                                                <option value="113983" >XH三亚高同青副总区(加盟)</option>
                                                <option value="114043" >邹泽意副总区（XMH)</option>
                                                <option value="114134" >颜彪/宋海钦副总区(加盟)</option>
                                                <option value="114149" >杜金霞副总区</option>
                                                <option value="114212" >沈天文副总区(常德)</option>
                                                <option value="114235" >XMH沈天文副总区(加盟)</option>
                                                <option value="114359" >赵雯副总区（XMH）</option>
                                                <option value="114420" >吴津仪副总区（XMH）</option>
                                                <option value="114482" >张武义副总区</option>
                                                <option value="114543" >XMH邯郸副总区(邯郸)</option>
                                                <option value="114661" >黄河副总区(XMH）</option>
                                                <option value="114703" >总经办副总区(邯郸)</option>
                                                <option value="114710" >XMH新房部-副总区（邯郸）</option>
                                                <option value="114716" >XMH培训部-副总区（邯郸）</option>
                                                <option value="114724" >XD胡波/刘新宇副总区(加盟)</option>
                                                <option value="114730" >XMH行政部（邯郸）</option>
                                                <option value="114731" >XMH行政部-副总区（邯郸）</option>
                                                <option value="114740" >XMH财务部-副总区（邯郸）</option>
                                                <option value="114779" >象盒找铺副总区</option>
                                                <option value="114809" >XMH资源管控部（邯郸）</option>
                                                <option value="114844" >曹曦副总区（XMH）</option>
                                                <option value="114948" >肖兵副总区（XMH）</option>
                                                <option value="114957" >XMH房勘部（邯郸）</option>
                                                <option value="114958" >XMH房勘部（邯郸）-副总区</option>
                                                <option value="114995" >李晓娇副总区</option>
                                                <option value="114996" >刘迪妮副总区</option>
                                                <option value="115025" >XMH汉谷-副总区（邯郸）</option>
                                                <option value="115180" >石若男副总区（XMH)</option>
                                                <option value="115239" >测试副总2副总区</option>
                                                <option value="115293" >燕郊副总区</option>
                                                <option value="115410" >总部（湘潭）王德志副总区</option>
                                                <option value="115696" >燕郊副总区(加盟)</option>
                                                <option value="116278" >王明副总区</option>
                                                <option value="116349" >刘新宇副总区</option>
                                                <option value="116545" >杨柳实习副总区</option>
                                                <option value="116551" >上海总部运营区(龙祥)</option>
                                                <option value="116746" >宝山运营区(胡麒)</option>
                                                <option value="116788" >浦东运营区(龙祥)</option>
                                                <option value="116928" >松江运营区</option>
                                                <option value="116951" >静安运营区</option>
                                                <option value="107012" >新房刘政副总区</option>
                                                <option value="107013" >新房星沙副总区</option>
                                                <option value="107014" >新房汤冰副总区</option>
                                                <option value="107015" >新房彭万副总区</option>
                                                <option value="107016" >新房陈伟艳副总区</option>
                                                <option value="107017" >新房罗峰副总区</option>
                                                <option value="107018" >新房杨理副总区</option>
                                                <option value="107019" >新房姚苡副总区</option>
                                                <option value="107020" >新房周科峰副总区</option>
                                                <option value="107021" >新房开福副总区</option>
                                                <option value="108477" >新房副总区</option>
                                                <option value="108478" >测试</option>
                                                <option value="108479" >测试</option>
                                                <option value="108484" >新房钟志副总区</option>
                                                <option value="110759" >新房张兵副总区</option>
                                                <option value="110760" >新房宋绍镰副总区</option>
                                                <option value="110856" >新房沈天文副总区</option>
                                                <option value="110868" >新房项目部副总区(武汉)</option>
                                                <option value="110982" >新房张建勇副总区</option>
                                                <option value="111098" >娄底市场副总区</option>
                                                <option value="32695" >新房市场部</option>
                                                <option value="110860" >新房项目助理部(益阳)</option>
                                                <option value="110865" >新房项目助理部(武汉)</option>
                                                <option value="113438" >新房项目助理部(常德)</option>
                                                <option value="110485" >商业部副总区</option>
                                                <option value="110719" >测试副总区</option>
                                        </select>
            </div>

            <div class="layui-inline layui-form" >
                <select name="city" lay-search="" id="zongjian" lay-filter="zongjian" >
                        <option value="0">总监区</option>
                </select>
            </div>

            <div class="layui-inline layui-form" >
                <select name="citys" lay-search="" id="zongjians" lay-filter="citys" >
                        <option value="0">实习总监</option>
                </select>
            </div>

            <div class="layui-inline layui-form" >
                <select name="area" lay-search="" id="departmentID" lay-filter="area" >
                        <option value="0">门店</option>
                </select>
            </div>

            <div class="layui-inline layui-form" >
               <select name="user_id" id="user_id" lay-filter="test_user" >
                    <option value="0">摄影师</option>
                                            <option value="4416" >刘云华</option>
                                            <option value="1010433" >池慕卉-1001</option>
                                            <option value="1018452" >张发鑫</option>
                                            <option value="1024121" >刘姿</option>
                                            <option value="1024242" >摄影测试</option>
                                            <option value="1024597" >测试鲁班</option>
                                            <option value="1047823" >刘熠</option>
                                            <option value="1047825" >王宇轩</option>
                                            <option value="1047828" >张宏伟</option>
                                            <option value="1047829" >刘毅</option>
                                            <option value="1047831" >刘书言</option>
                                            <option value="1047832" >刘娟</option>
                                            <option value="1048042" >王禹鑫</option>
                                            <option value="1052313" >王岳</option>
                                            <option value="1070636" >黄文财</option>
                                            <option value="1087560" >卢哲彬</option>
                                            <option value="1088546" >陈浩</option>
                                            <option value="1095942" >李港</option>
                                            <option value="1097082" >靳浩然</option>
                                            <option value="1100328" >测试账号</option>
                                            <option value="1105371" >贺志</option>
                                            <option value="2000066" >测试1003</option>
                                            <option value="2007072" >张超煜</option>
                                            <option value="2008967" >夏威</option>
                                            <option value="2011549" >胡鹏程</option>
                                            <option value="2012141" >杨雯</option>
                                            <option value="2013964" >廖柔刚</option>
                                            <option value="2013966" >王超</option>
                                            <option value="2014027" >刘锦涛</option>
                                            <option value="2014138" >童大根</option>
                                            <option value="2014559" >冯李文</option>
                                            <option value="2018518" >刘敬儒</option>
                                            <option value="2018526" >吴谋康</option>
                                            <option value="2029926" >郭蕾</option>
                                            <option value="2029944" >樊淑钦</option>
                                            <option value="2029948" >李浩楠</option>
                                   </select>
           </div>
        </form>
        <a class="layui-btn" id="search" data-type="reload">搜索</a>
        <a href="/houseadmin/house/index.html" class="layui-btn">重置</a>
    </div>
    <table class="layui-table" id="order" lay-filter="order"></table>
</div>

<script type="text/html" id="isKey">
        {{# if(d.isKey==1){ }} 是{{# }else{  }}否{{# } }}
</script>


<script type="text/html" id="action">
    {{# if(d.state==0){ }}
        <a href="javascript:void(0)" class="layui-btn layui-btn-xs" lay-event="detail">详情</a>
    {{# }else if(d.state==1){ }}
        <a href="javascript:void(0)" class="layui-btn layui-btn-xs" lay-event="add_fk_image" id="add_fk_image">上传</a>
        <a href="javascript:void(0)" class="layui-btn layui-btn-xs" lay-event="detail">详情</a>
        <a href="javascript:void(0)"  class="layui-btn layui-btn-warm layui-btn-xs" lay-event="synchronous" >同步</a>
        <a href="javascript:void(0)" class="layui-btn layui-btn-danger layui-btn-xs" lay-event="invalid">无效</a>
    {{# }else if(d.state==2){ }}
        /*<a href="javascript:void(0)" class="layui-btn layui-btn-xs" lay-event="confirm" >接单</a>*/
    {{# }else if(d.state==3){ }}
        <a href="javascript:void(0)" class="layui-btn layui-btn-xs" lay-event="add_fk_image">上传</a>
        <a href="javascript:void(0)" class="layui-btn layui-btn-xs" lay-event="cancel">取消</a>
        <a href="javascript:void(0)"  class="layui-btn layui-btn-warm layui-btn-xs" lay-event="transfer" >转单</a>
        <a href="javascript:void(0)"  class="layui-btn layui-btn-warm layui-btn-xs" lay-event="synchronous" >同步</a>
        <a href="javascript:void(0)" class="layui-btn layui-btn-xs" lay-event="detail">详情</a>  
    {{# }else{  }}
        <a href="javascript:void(0)" class="layui-btn layui-btn-xs" lay-event="detail">详情</a>  
    {{# } }}
</script>

<script type="text/javascript" src="/static/plugins/layui/layui.js"></script>

<div style="display:none;"><script type="text/javascript" src="https://s11.cnzz.com/z_stat.php?id=1259448652&web_id=1259448652"></script></div>
<script>
    layui.use(['table','form','laydate','upload'], function() {
        var table = layui.table,laydate = layui.laydate,form = layui.form, $ = layui.jquery,upload = layui.upload;
        form.render('select','cancelRemarks')
        //var keys = ''
        var tableIn = table.render({
            id: 'order',
            elem: '#order',
            url: '/houseadmin/house/index.html',
            method: 'post',
           /* where: {
              key: keys
            },*/
            page: true,
            cols: [[
                /*{checkbox:true,fixed: true},*/
                /*{field: 'id', title: 'ID', width: 90},*/
                
                {field: 'stateName', title: '订单状态', width: 90},
                {field: 'houseSourceNumber', title: '房源编号', width: 150},
                {field: 'lpName', title: '楼盘名称', width: 130},
                {field: 'creatorName', title: '申请人', width: 100},
                {field: 'departmentName', title: '申请门店', width: 150},
                {field: 'createDate', title: '申请时间', width: 160},
                {field: 'appointmentDate', title: '预约时间', width: 160},
                {field: 'isKey', title: '钥匙', width: 60,toolbar: '#isKey'},
                {field: 'photographyUserName', title: '摄影师', width: 105},
                {field: 'uploadName', title: '上传人', width: 105},
                {field: 'tel', title: '电话', width: 120},
                {field: 'fk_status', title: '房堪状态', width: 90},
                /*{field: 'house_status', title: '全景状态', width: 90},*/
                {width: 320, title: '操作',align: 'center', toolbar: '#action'}
            ]],
            limit: 10 //每页默认显示的数量
        });

        
        table.on('tool(order)', function(obj) {
            var data = obj.data;
            console.log(data)
            var key = $.trim($('#key').val());
            var status = $('#status').val();
            var photographyUserId = $('#user_id').val();
            
            if (obj.event === 'confirm'){
                layer.confirm('你确定接受本次拍摄任务吗？一旦接单,请及时联系客户按时进行拍摄', {
                    btn: ['取消', '确定'] //按钮
                }, function(){
                    layer.closeAll();
                }, function(){
                    $.post("receive", {'id':data.id,'city':data.cityName,'house_nums':data.houseSourceNumber,'house_name':data.lpName}, function (res) {
                        layer.close(loading);
                        if (res.code > 0) {
                            layer.msg('接单成功',{time:1000,icon:1});
                            tableIn.reload({where: {flag:1,key: key,status:status,photographyUserId:photographyUserId}});
                        } else {
                            //console.log(res.obj)
                            layer.msg('接单失败', {time: 1800, icon: 2});
                        }
                    });
                });
            }else if(obj.event === 'add_fk_image'){
                //新增房堪图
                var index = layer.open({
                    type: 2, 
                    title:'新增房堪图',
                    area: ['900px', '700px'],
                    content: "/houseadmin/house/add_fk_image.html?id="+data.surveyId+"&lpid="+data.lpid+"&oid="+data.id+"&saleOrRentid="+data.saleOrRentid+"&housetype="+data.housetype+"&housesourceid="+data.housesourceid+"&houseSourceNumber="+data.houseSourceNumber
                }); 
            }else if(obj.event === 'cancel'){
                const index = layer.open({
                    type: 2,
                    title: '取消订单将终止房堪拍摄，请确认已联系摄影师取消预约',
                    area: ['600px', '400px'],
                    content: "/houseadmin/house/cancel.html?id="+data.id+"&tel="+data.tel+"&photographyUserName="+data.photographyUserName
                }); 
            }else if(obj.event === 'invalid'){
                const index = layer.open({
                    type: 2,
                    title: '无效之后房堪将会下架需要重新申请房堪',
                    area: ['600px', '300px'],
                    content: "/houseadmin/house/invalid.html?id="+data.surveyId+"&house_nums="+data.houseSourceNumber+"&key="+key
                }); 
            }else if(obj.event === 'transfer'){
                const index = layer.open({
                    type: 2,
                    title: '转单即将摄影师订单转移给接受人，由接受摄影师完成订单后续流程',
                    area: ['600px', '500px'],
                    content: "/houseadmin/house/transfer.html?id="+data.id+"&houseSourceNumber="+data.houseSourceNumber+"&lpName="+data.lpName
                }); 
            }else if(obj.event === 'synchronous'){           
                $.post("synchronous", {'id':data.id}, function (res) {
                    if (res.code > 0) {
                        layer.msg('同步成功',{time:1000,icon:1});
                    } else {
                        console.log(res.msg)
                        layer.msg('同步失败', {time: 1800, icon: 2});
                    }
                });
            }else if(obj.event === 'detail'){
                const index = layer.open({
                    type: 2,
                    title: '操作详情',
                    area: ['1000px', '700px'],
                    content: "/houseadmin/house/detail.html?createDate="+data.createDate+"&tel="+data.tel+"&departmentName="+data.departmentName+"&creatorName="+data.creatorName+"&photographyDate="+data.photographyDate+"&lpName="+data.lpName+"&id="+data.id
                }); 
            }
        });

         //搜索
        $('#search').on('click', function() {
            var key = $.trim($('#key').val());
            var status = $('#status').val();
            var photographyUserId = $('#user_id').val();
            var departmentID = $('#departmentID').val();
            var dept6Id = $('#fuzong').val();
            var dept5Id = $('#zongjian').val();
            var dept4Id = $('#zongjians').val();
            tableIn.reload({where: {flag:1,key: key,status:status,photographyUserId:photographyUserId,departmentID:departmentID,dept4Id:dept4Id,dept5Id:dept5Id,dept6Id:dept6Id}});
        });
        
        //三级联动
        form.on('select(province)', function (data) {
            var pid = data.value;
            $.post("/houseadmin/house/dept.html?pid=" + pid, function (data) {
                var html = '<option value="">总监区</option>';
                $.each(data.data, function (i, value) {
                    html += '<option value="' + value.id + '">' + value.department_name + '</option>';
                });
                console.log(html)
                $('#zongjian').html(html);
                form.render()
            });
        });
        
        form.on('select(zongjian)', function (data) {
            var pid = data.value;
            $.post("/houseadmin/house/dept.html?pid=" + pid, function (data) {
                var html = '<option value="">实习总监</option>';
                $.each(data.data, function (i, value) {
                    html += '<option value="' + value.id + '">' + value.department_name + '</option>';
                });
                //console.log(html)
                $('#zongjians').html(html);
                form.render()
            });
        });

        form.on('select(citys)', function (data) {
            var pid = data.value;
            $.post("/houseadmin/house/dept.html?pid=" + pid, function (data) {
                var html = '<option value="">门店</option>';
                $.each(data.data, function (i, value) {
                    html += '<option value="' + value.id + '">' + value.department_name + '</option>';
                });
                $('#departmentID').html(html);
                form.render()
            });
        });
        
    });
</script>
</body>
</html>