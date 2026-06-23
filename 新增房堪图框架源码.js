
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- import CSS -->
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
  <link rel="stylesheet" href="/static/fkhouse/css/swiper.min.css">
  <link rel="stylesheet" href="/static/fkhouse/css/app.css">
  <link rel="stylesheet" href="/static/plugins/layui/css/layui.css" media="all" />
  <link href="/static/fkhouse/viewer/viewer.min.css" rel="stylesheet">
  <script src="/static/fkhouse/viewer/jquery-3.2.1.min.js" type="text/javascript"></script>
  <script src="/static/fkhouse/viewer/viewer.min.js" type="text/javascript"></script>
</head>
<style type="text/css">
    .el-dialog{
        margin: 0px;
        width: 100%;
    }
    .sonbox{
        background: url('/static/fkhouse/img/del@2x.png') no-repeat;
        background-size: 30px;
        display: inline-block;
        position: absolute;
        top: 0px;
        right: 0px;
        color: red;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
</style>
<body>
  <div id="app">
    <!-- <a href="javascript:;" @click="show()">显示</a> -->
    <el-dialog
          class="width860 dialogBox"
          title="房堪上传"
          top=0vh
          :visible.sync="formuploaddialogVisibles"
          :append-to-body="true"
          :close-on-click-modal="false"
        >
          <div class="boxFrom" id="docs-pictures">
            <!-- <div class="topbox" :class="{ topboxs: isActionsLeft, topboxss: isActionsRight }">
              <a class="topbox_item" @click="LeftItemFn" :class="{ isAction: isActionsLeft }">户型图</a>
              <a class="topbox_item" @click="rightItemFn" :class="{ isAction: isActionsRight }">室内外图</a>
            </div> -->
            <el-form :label-position="labelPosition" label-width="80px" :model="formuploads">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="10">
                  <div class="grid-content bg-purple">
                    <el-form-item label="申请人">
                      <el-input v-model="formuploads.Photographer" size="small" disabled></el-input>
                    </el-form-item>
                  </div>
                </el-col> 
                <el-col :span="10">
                  <div class="grid-content bg-purple-light">
                    <el-form-item label="摄影师">
                      <el-input v-model="formuploads.UploadBroker" size="small" disabled></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <!-- <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="10">
                  <div class="grid-content bg-purple">
                    <el-form-item label="上传时间">
                      <el-input v-model="formuploads.UploadTime" size="small" disabled></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content bg-purple-light">
                    <el-form-item label="720地址">
                      <el-input v-model="formuploads.adress" size="small"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row> -->
              <el-row v-if="isActionsLeft">
                <el-col :span="10" style="height:90px !important">
                  <div class="grid-content bg-purple">
                    <el-form-item label="户型图确认">
                      <el-radio-group v-model="formuploads.huxingType">
                        <el-radio :label="2">原装户型图</el-radio>
                        <el-radio :label="1">改装户型图</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <div v-if="isActionsRight">
                <el-row :gutter="20" v-for="(item, index) in houseDataList" :key="index">
                  <el-col :span="6">
                    <div class="grid-content bg-purple">
                      <el-form-item label="房间">
                        <el-select
                          v-model="houseDataList[index].roomType"
                          placeholder="请输入"
                          size="small"
                        >
                          <el-option
                            v-for="(item, index) in room"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple-light">
                      <el-form-item label="朝向">
                        <el-select
                          v-model="houseDataList[index].orientationId"
                          placeholder="请输入"
                          size="small"
                        >
                          <el-option
                            v-for="(item, index) in orientation"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                        <!-- <el-input v-model="houseDataList[index].orientation"></el-input> -->
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple-light">
                      <el-form-item label="窗户">
                        <el-select
                          v-model="houseDataList[index].windowType"
                          placeholder="请输入"
                          size="small"
                        >
                          <el-option
                            v-for="(item, index) in window"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                        <!-- <el-input v-model="houseDataList[index].window"></el-input> -->
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple-light">
                      <el-form-item label="长度">
                        <el-input v-model="houseDataList[index].length" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple-light">
                      <el-form-item label="宽度">
                        <el-input v-model="houseDataList[index].width" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple-light">
                      <el-form-item label="高度">
                        <el-input v-model="houseDataList[index].high" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple-light">
                      <el-form-item label="面积">
                        <el-input v-model="houseDataList[index].size" size="small"></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <a v-show="index == 0" href="#" class="addxxx" @click="addxxxFn(index)">+</a>
                    <a v-show="index >= 1" href="#" class="addxxx" @click="revexxxFn(index)">-</a>
                  </el-col>
                  <el-col class="colheight">
                    <div v-show="isActionsRight" style="display: flex">
                      <div class="schoolTu_top" style="margin-right: 0px">房间图</div>
                      <!--<div class="width_xxx">-->
                      <div class="" >
                        <template>
                          <div
                            class="upimg imgstyle"
                            v-for="(items, index1) in houseDataList[index]
                              .hsImgList"
                            :key="index1"
                          >
                            <img class="imgstyle_img" style="object-fit: covor" :src="items.imagepath" :data-original='items.imagepath' />
                            <span class="sonbox" @click="removeFn1(houseDataList[index].hsImgList, index1)" alt></span>
                          </div>
                          <el-upload
                            class="avatar-uploader"
                            action="https://files.xhj.com/oss/endpoint/put-file"
                            :before-upload="beforeAvatarUpload"
                            :show-file-list='false'
                            :data="{
                                type:1,
                                sysType:1,
                                cityId:1,
                            }"
                            multiple
                            :on-success="(res, file) => {
                              handleAvatarSuccess(res, file,2,index);
                            }"
                          >
                            <div class="picture-add">
                              <i
                                class="el-icon-plus"
                                style="
                                  width: 138px;
                                  height: 104px;
                                  line-height: 104px;
                                "
                              ></i>
                            </div>
                          </el-upload>
                        </template>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <!-- 房间图 -->
            </el-form>
            <!-- </el-form>  -->
            <!-- 户型图 -->
            <div v-show="isActionsLeft" style="display: flex; padding-right: 30px">
              <div class="schoolTu_top">
                户型图
                <div>支持jpg,png</div>
              </div>
              <div class="width_xxx">
                <template>
                  <div
                    class="upimg imgstyle"
                    v-for="(item, index) in formuploads.imageUrls"
                    :key="index"
                  >
                    <img class="imgstyle_img" style="object-fit: covor" :src="item.imagepath" />
                    <img
                      class="sonbox"
                      src="/static/fkhouse/img/del@2x.png"
                      @click="removeFn2(index)"
                      alt
                    />
                    <!-- <i class="el-icon-delete sonbox" ></i> -->
                  </div>
                  <el-upload
                    class="avatar-uploader"
                    action="https://doc.xhj.com/home/UpFiles/upload_image"
                    :before-upload="beforeAvatarUpload"
                    :show-file-list='false'
                            multiple
                    :on-success="(res, file) => {
                      handleAvatarSuccess(res, file,1);
                    }"
                  >
                    <div class="picture-add">
                      <i class="el-icon-plus" style="width: 138px; height: 104px; line-height: 104px"></i>
                    </div>
                  </el-upload>
                </template>
              </div>
            </div>
            <!-- 户型图轮播组件 -->
            <div class="boxformuploads" v-show="isActionsLeft">
              <div class="swiper mySwiper">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(item, index) in formuploads.itemList" :key="index">
                    <div
                      style="
                        display: flex !important;
                        flex-direction: column;
                        align-items: center;
                      "
                    >
                      <img style="width: 177px; height: 133px; margin-bottom: 10px" :src="item.img" alt />
                      <el-button
                        @click="addimg(item.img)"
                        style="
                          margin-top: 10px;
                          width: 80px;
                          height: 32px;
                          line-height: 7px;
                          background-color: #4057e7;
                          color: white;
                        "
                      >填充</el-button>
                    </div>
                  </div>
                </div>
                <!-- Navigation -->
                <div class="swiper-button-next swiper-button-black"></div>
                <div class="swiper-button-prev swiper-button-black"></div>
                <div class="swiper-pagination"></div>
              </div>
            </div>
            <div class="botimg"></div>
            <!-- 户型图CAD设计图啥的 -->
            <div v-show="isActionsLeft" style="display: flex">
              <div class="schoolTu_top">
                户型图原图
                <div>CAD设计底图</div>
              </div>
              <div class="width_xxx">
                <template>
                  <div
                    class="upimg imgstyle"
                    v-for="(item, index) in formuploads.imageUrlx"
                    :key="index"
                  >
                    <img class="imgstyle_img" style="object-fit: covor" :src="item.imagepath" />
                    <img
                      class="sonbox"
                      src="/static/fkhouse/img/del@2x.png"
                      @click="removeFn3(index)"
                      alt
                    />
                  </div>
                  <el-upload
                    class="avatar-uploader"
                    action="https://doc.xhj.com/home/UpFiles/upload_image"
                    :before-upload="beforeAvatarUpload"
                    :show-file-list='false'
                            multiple
                    :on-success="(res, file) => {
                      handleAvatarSuccess(res, file,4);
                    }"
                  >
                    <div class="picture-add">
                      <i class="el-icon-plus" style="width: 138px; height: 104px; line-height: 104px"></i>
                    </div>
                  </el-upload>
                </template>
              </div>
            </div>
            <div class="botimg"></div>
            <!-- 室外图 -->
            <div v-show="isActionsRight" style="display: flex">
              <div class="schoolTu_top" style="margin-right: 0px">室外图</div>
              <div class="width_xxx">
                <template>
                  <div
                    class="upimg imgstyle"
                    v-for="(item, index) in formuploads.shineiURL"
                    :key="index"
                  >
                    <img class="imgstyle_img" style="object-fit: covor" :src="item.imagepath" />
                    <!--<img-->
                    <!--  class="sonbox"-->
                    <!--  src="/static/fkhouse/img/del@2x.png"-->
                    <!--  @click="removeFn4(index)"-->
                    <!--  alt-->
                    <!--/>-->
                    <span class="sonbox" @click="removeFn4(index)"></span>
                  </div>
                  <el-upload
                    class="avatar-uploader"
                    action="https://files.xhj.com/oss/endpoint/put-file"
                    :numType="1"
                    :updateType="1"
                    :before-upload="beforeAvatarUpload"
                    :show-file-list='false'
                    :data="{
                        type:1,
                        sysType:1,
                        cityId:1,
                    }"
                    multiple
                    :on-success="(res, file) => {
                      handleAvatarSuccess(res, file,0);
                    }"
                  >
                    <div class="picture-add">
                      <i class="el-icon-plus" style="width: 138px; height: 104px; line-height: 104px"></i>
                    </div>
                  </el-upload>
                </template>
              </div>
            </div>
            <el-upload
              class="avatar-uploader uploadBtn"
              action="https://files.xhj.com/oss/endpoint/put-file"
              multiple
              :show-file-list='false'
              :on-success="
                ($event) => {
                  handleAvatarSuccessAll($event);
                }
              "
              :data="{
                    type:1,
                    sysType:1,
                    cityId:1,
                }"
              v-if="isActionsRight"
            >
              <el-button type="primary">批量上传</el-button>
            </el-upload>
            <div class="botimg"></div>
            <!-- <div class="boxformuploads" v-show="isActionsRight">
              <div class="swiper mySwipers">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(item, index) in formuploads.itemLists" :key="index">
                    <div
                      style="
                        display: flex !important;
                        flex-direction: column;
                        align-items: center;
                      "
                    >
                      <img style="width: 177px; height: 133px; margin-bottom: 10px" :src="item.img" alt />
                      <el-button
                        type="primary"
                        @click="addimg(item.img)"
                        style="
                          margin-top: 20px;
                          width: 80px;
                          height: 32px;
                          line-height: 7px;
                        "
                      >填充</el-button>
                    </div>
                  </div>
                </div>
                <div class="swiper-button-next swiper-button-black"></div>
                <div class="swiper-button-prev swiper-button-black"></div>
                <div class="swiper-pagination"></div>
              </div>
            </div> -->
            <div class="botText" v-show="isActionsRight">
              <p>注意:1.室内图上传数量大于室+厅+卫数量，且每个房间至多上传4张，房堪信息才能有效保存；</p>
              <p style="margin-left: 30px">上传的图片大小不能超过1M,且如果上传的过程中出现断点提示，是由于图片较大，请减少一次上传数量.</p>
              <p>温馨提示:1.复用专业标准的户型图，会同步到象盒找房，提高我们的专业度,有利于客户进店咨询;</p>
              <p style="margin-left: 30px">细分每个房间的图片，将有利于用户更好的了解房源信息，体验更好，有利于客户进店咨询;</p>
              <p style="margin-left: 30px">细节决定成败，客户第一;天下难事,必作于易;天下大事，必作于细 - 老子</p>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="warning" @click="reset">一键清除</el-button>
            <el-button @click="canlcefnq">取 消</el-button>
            <el-button type="primary" @click="saveFn">确 定</el-button>
          </span>
        </el-dialog>
  </div>
</body>
  <!-- import Vue before Element -->
  <script src="/static/fkhouse/js/vue.js"></script>
  <!-- import JavaScript -->
  <script src="/static/fkhouse/js/element-ui.js"></script>
  <script src="/static/fkhouse/js/swiper.min.js"></script>
  <script src="/static/fkhouse/js/axios.min.js"></script>
  <script src="/static/fkhouse/js/axios.js"></script>

  <script type="text/javascript" src="/static/plugins/layui/layui.js"></script>
  <script>
    new Vue({
      el: '#app',
      data() {
          return {
                houseDataList: [
                  {
                    // 房间
                    room: [],
                    roomid: "",
                    // 朝向
                    orientation: [],
                    orientationId: [],
                    // 窗户
                    window: [],
                    windowid: "",
                    // 长度
                    length: "",
                    // 宽度
                    width: "",
                    // 高度
                    high: "",
                    // 面积
                    size: "",
                    hsImgList: []
                  }
                ],
                labelPosition: "right",
                // 申请房堪
                ApplyList: [],
                orientation:[],
                room:[],
                window:[],
                lpid:67716,
                id:null,
                account:null,
                accountName:null,
                formuploaddialogVisible: false,
                formupload: {
                  applicationTime: "",
                  applicationStore: "",
                  applicationPeople: "",
                  applicationPhone: "",
                  lpArea: "",
                  makeTime: "",
                  key: "",
                  remarks: "",
                  keyDate: [
                    {
                      name: "是",
                      id: 1
                    },
                    {
                      name: "否",
                      id: 0
                    }
                  ]
                },
                keys: [
                  { name: "是", value: 1 },
                  { name: "否", value: 0 }
                ],
                // 房堪上传
                formuploaddialogVisibles: false,
                isActionsLeft: false,
                isActionsRight: true,
                isActionsText1: "户型图支持jpg,png",
                isActionsText2: "户型图原图CAD设计底图",
                userInfo:{},
                formuploads: {
                  Photographer: "",
                  UploadBroker: "",
                  UploadTime: "",
                  adress: "",
                  PublicInterestAdress: "",
                  checked: "",
                  huxingType: null,
                  imageUrls: [],
                  imageUrlx: [],
                  // 户型图数据
                  itemList: [{}],
                  // 环境图数据
                  itemLists: [{}],
                  // 房间图
                  houseimgURL: [],
                  // 室内图
                  shineiURL: []
                },
            }
        },
        mounted(){
            this.$nextTick(() => {  
                this.lpid=3540;
                this.id = null;
                this.accountName = "贺志";
                this.account = "221105371";
                //this.$set(this.formuploads,'UploadBroker',this.account);
                this.openedfkFn();
                this.show();
            });
        },
        methods: {
            GetQueryString(name){
               if (!name) return null;
               var after = window.location.search;
               after = after.substr(1) || window.location.hash.split('?')[1];
               if (!after) return null;
               if (after.indexOf(name) === -1) return null;
               var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
               var r = decodeURI(after).match(reg);
               if (!r) return null;
               return r[2];
            },
            info(){
                instance({
                    url: `https://api.xhj.com/api/xhj-bms/houseSurveyApply/xiangshi/detail?id=`+831847,
                    method: "get"
                }).then(res => {
                    let row = res.data.data;
                    console.log(row)
                    var date = res.data.data.houseSurveyImgVO;
                    if (date != null && JSON.stringify(date) !== '{}') {
                      this.formuploads.adress = date.url;
                      this.formuploads.checked = date.isSync == "1" ? true : false;
                      //  户型图
                       this.formuploads.imageUrls = date.houseSurveyImages1;
                       row.hxImage&&(this.formuploads.imageUrls.push({imagetype:1,imagepath:row.hxImage}));
                      if (!row.hxImage) {
                        this.formuploads.imageUrls = date.houseSurveyImages1;
                      }
                      // cad设计自地图
                      this.formuploads.imageUrlx = date.houseSurveyImages4;
                      //房间图
                      if (date.inDoorImgVoList && date.inDoorImgVoList.length > 0) {
                        this.houseDataList = date.inDoorImgVoList;
                      }
                      // 室外图
                      this.formuploads.shineiURL = date.houseSurveyImages3;
                        
                    }
                    this.dataObject = row;
                      this.lpid = row.lpid;
                      this.saleOrRentidL = row.saleOrRentidL;
                      this.formuploads.Photographer = row.creatorName;
                      this.formuploads.id = row.id;
                      this.formuploaddialogVisibles = true;
                      this.formuploads.huxingType = row.hxType;
                });
            },
            reset() {
              this.formuploads.adress = "";
              this.formuploads.PublicInterestAdress = "";
              this.formuploads.checked = false;
              this.formuploads.imageUrls = [];
              this.formuploads.imageUrlx = [];
              this.formuploads.shineiURL = [];
              this.houseDataList = [
                {
                  // 房间
                  room: [],
                  roomType: "",
                  // 朝向
                  orientation: [],
                  orientationid: [],
                  // 窗户
                  window: [],
                  windowType: "",
                  // 长度
                  length: "",
                  // 宽度
                  width: "",
                  // 高度
                  high: "",
                  // 面积
                  size: "",
                  hsImgList: []
                }
              ];
            },
            saveFn(){
                
            },
            canlcefnq(){
              layui.use(['table','form','laydate','upload'], function() {
                  var index = parent.layer.getFrameIndex(window.name); // 先得到当前 iframe 层的索引
                  parent.layer.close(index); // 再执行关闭
              });
              //this.formuploaddialogVisibles=false;
                
            },
            // 打开申请房堪的对话框的回调
            openformuploadFn() {
              // 申请时间
              this.formupload.applicationTime = this.getCurrentTime(true);
              // 申请门店
              this.formupload.applicationStore = this.userInfo.dept_name;
              // 申请人
              this.formupload.applicationPeople = this.userInfo.user_name;
              // 电话
              this.formupload.applicationPhone = this.userInfo.phone;
              // 房源类型
            },
            // 获取当前时间
            getCurrentTime(ischeck) {
              //获取当前时间并打印
              var _this = this;
              let yy = new Date().getFullYear();
              let mm =
                new Date().getMonth() + 1 < 10
                  ? "0" + (new Date().getMonth() + 1)
                  : new Date().getMonth() + 1;
              let dd =
                new Date().getDate() < 10
                  ? "0" + new Date().getDate()
                  : new Date().getDate();
              let hh =
                new Date().getHours() < 10
                  ? "0" + new Date().getHours()
                  : new Date().getHours();
              let mf =
                new Date().getMinutes() < 10
                  ? "0" + new Date().getMinutes()
                  : new Date().getMinutes();
              let ss =
                new Date().getSeconds() < 10
                  ? "0" + new Date().getSeconds()
                  : new Date().getSeconds();
              return ischeck
                ? (_this.gettime =
                    yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss)
                : (_this.gettime = yy + "-" + mm + "-" + dd);
            },
            // 删除
            removeFn1(item, index1) {
              item.splice(index1, 1);
            },
            // 户型图
            removeFn2(index) {
              this.formuploads.imageUrls.splice(index, 1);
            },
            // 户型图原图
            removeFn3(index) {
              this.formuploads.imageUrlx.splice(index, 1);
            },
            removeFn4(index) {
              this.formuploads.shineiURL.splice(index, 1);
            },
            reset() {
              this.formuploads.adress = "";
              this.formuploads.PublicInterestAdress = "";
              this.formuploads.checked = false;
              this.formuploads.imageUrls = [];
              this.formuploads.imageUrlx = [];
              this.formuploads.shineiURL = [];
              this.houseDataList = [
                {
                  // 房间
                  room: [],
                  roomType: "",
                  // 朝向
                  orientation: [],
                  orientationid: [],
                  // 窗户
                  window: [],
                  windowType: "",
                  // 长度
                  length: "",
                  // 宽度
                  width: "",
                  // 高度
                  high: "",
                  // 面积
                  size: "",
                  hsImgList: []
                }
              ];
            },
            rightItemFn() {
              this.isActionsRight = true;
              this.isActionsLeft = false;
              this.$nextTick(() => {
                new Swiper(".mySwipers", {
                  slidesPerView: 4,
                  spaceBetween: 40,
                  navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                  }
                });
              });
              this.isActionsText1 = "房间图";
              this.isActionsText2 = "室外图";
            },
            LeftItemFn() {
                this.isActionsText1 = "户型图原图CAD设计底图";
                this.isActionsText2 = "房间图";
                this.isActionsRight = false;
                this.isActionsLeft = true;
                this.$nextTick(() => {
                    new Swiper(".mySwiper", {
                      slidesPerView: 4,
                      spaceBetween: 40,
                      navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev"
                      }
                    });
                });
            },
            addxxxFn() {
              // console.log(index);
              this.houseDataList.push({
                // 房间
                room: this.houseDataList[0].room,
                roomType: "",
                // 朝向
                orientation: this.houseDataList[0].orientation,
                orientationid: [],
                // 窗户
                window: this.houseDataList[0].window,
                windowType: "",
                // 长度
                length: "",
                // 宽度
                width: "",
                // 高度
                high: "",
                // 面积
                size: "",
                hsImgList: []
              });
            },
            getSystemInfoApi(id){
                return instance({
                    url: `https://api.xhj.com/api/xhj-bms/houseSurveyImg/xiangshi/getSystemInfoBySid?sid=${id}`,
                    method: "get"
                });
            },
            gethuxingApi(lpId,imagetype){
                return instance({
                    url: `https://api.xhj.com/api/xhj-bms/houseSurveyImg/xiangshi/getLpImgByLpId?imagetype=${imagetype}&lpId=`+3540,
                    method: "get"
                });
            },
            saveApi(params){
                return instance({
                    url: "https://api.xhj.com/api/xhj-bms/houseSurveyImg/xiangshi/save",
                    method: "post",
                    data: params
                });
            },
            openedfkFn() {
              // 名字
              this.formuploads.UploadBroker=this.accountName;
              this.formuploads.account=this.account;
              // 当前时间
              this.formuploads.UploadTime = this.getCurrentTime(false);
              // 获取户型图接口
              this.gethuxingApi(this.lpid, 1).then(data => {
                this.formuploads.itemList = data.data.data;
                if (data.data.code == 200) {
                  this.$nextTick(() => {
                    new Swiper(".mySwiper", {
                      slidesPerView: 4,
                      spaceBetween: 40,
                      navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev"
                      }
                    });
                  });
                }
              });
              // 获取环境图数据
             this.gethuxingApi(this.lpid, 3).then(data => {
                this.formuploads.itemLists = data.data.data;
                if (data.data.code == 200) {
                  this.$nextTick(() => {
                    new Swiper(".mySwipers", {
                      slidesPerView: 4,
                      spaceBetween: 40,
                      navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev"
                      }
                    });
                  });
                }
              });
              // 房间
              this.getSystemInfoApi(1091).then(data => {
                this.room = data.data.data;
              });
              // 朝向
              this.getSystemInfoApi(12).then(data => {
                this.orientation = data.data.data;
              });
              // 窗户
              this.getSystemInfoApi(1092).then(data => {
                this.window = data.data.data;
              });
            },
            revexxxFn(index) {
              this.houseDataList.splice(index, 1);
            },
            beforeAvatarUpload(file) {
                console.log(file);
        //      const isJPG = file.type === 'image/jpeg';
        //      const isLt2M = file.size / 1024 / 1024 < 2;
        
        //      if (!isJPG) {
        //        this.$message.error('上传头像图片只能是 JPG 格式!');
        //      }
        //      if (!isLt2M) {
        //        this.$message.error('上传头像图片大小不能超过 2MB!');
        //      }
        //      return isJPG && isLt2M;
            },
            show(){
                this.formuploaddialogVisibles=true;
                this.$nextTick(() => {
                    this.rightItemFn();
                    this.info();
                });
            },
            handleAvatarSuccess(res,file,type,index=-1){
                console.log(res,file,type)
                console.log(res.data)
                let link = res.data
                switch(type){
                    case 0:
                        this.formuploads.shineiURL.push({
                            imagepath: link.link,
                            imagetype: type
                          });
                    break;
                    case 2:
                        this.houseDataList[index].hsImgList.push({
                            imagepath: link.link,
                            imagetype: type
                          });
                    break;
                    case 4:
                        this.formuploads.imageUrlx.push({
                            imagepath: link.link,
                            imagetype: type
                        });
                    break;
                    case 1:
                        this.formuploads.imageUrls.push({
                            imagepath: link.link,
                            imagetype: type
                        });
                    break;
                }
            },
            findOther(data) {
              for (let i = 0; i < this.room.length; i++) {
                if (this.room[i].name===data) {
                  return this.room[i];
                }
              }
            },
            addimg(img) {
              if (this.isActionsLeft) {
                // 添加户型图
                this.formuploads.imageUrls.push({
                    
                  imagepath: img,
                  imagetype: 1
                });
              } else {
                // 添加室外图
                this.formuploads.shineiURL.push({
                  imagepath: img,
                  imagetype: 0
                });
              }
            },
            async handleAvatarSuccessAll(row, index) {
              console.log(row.data);
              let settingItem;
              let imageName = row.data.originalName.replace(/\.jpg$/i, "");
              console.log(imageName);
              if(imageName.indexOf('(')>-1){
                settingItem=await this.findOther(imageName.replace(/\s*/g,"").split('(')[0]);
              }    
              if(!settingItem){
                settingItem={
                  id: 4443,
                  sid: 1091,
                  name: "其他",
                  statuss: 1,
                  createdate: "2019-07-24 15:56:56",
                };
              }
              if(!this.houseDataList[0].roomType){
                this.houseDataList[0].roomType=settingItem.id;
              }
              const settingIndex = this.houseDataList.findIndex(item => item.roomType === settingItem.id);      
              if(settingIndex>-1){
                this.houseDataList[settingIndex].hsImgList.push({
                  imagepath: row.data.link,
                  imagetype: 2
                });
              }else{
                await this.addxxxFn();
                this.houseDataList[this.houseDataList.length-1].roomType=settingItem.id;
                this.houseDataList[this.houseDataList.length-1].hsImgList.push({
                  imagepath: row.data.link,
                  imagetype: 2
                });
              }      
            },
            // 保存
            async saveFn() {
              var imglist = [];
              for (var i = 0; i < this.houseDataList.length; i++) {
                if (this.houseDataList[i].hsImgList.length == 0) {
                  this.$message.error("室内至少上传一张图片");
                  return;
                }

                for (var j = 0; j < this.houseDataList[i].hsImgList.length; j++) {
                  // 房间
                  this.houseDataList[i].hsImgList[j].roomType = this.houseDataList[
                    i
                  ].roomType;
                  // 朝向
                  this.houseDataList[i].hsImgList[j].orientationId = this.houseDataList[
                    i
                  ].orientationId;
                  // 窗户
                  this.houseDataList[i].hsImgList[j].windowType = this.houseDataList[
                    i
                  ].windowType;
                  // 长度
                  this.houseDataList[i].hsImgList[j].length = this.houseDataList[
                    i
                  ].length;
                  // 宽度
                  this.houseDataList[i].hsImgList[j].width = this.houseDataList[
                    i
                  ].width;
                  // 高度
                  this.houseDataList[i].hsImgList[j].high = this.houseDataList[i].high;
                  // 面积
                  this.houseDataList[i].hsImgList[j].size = this.houseDataList[i].size;
                  imglist.push(this.houseDataList[i].hsImgList[j]);
                }
              }
              var houseSurveyImage = [
                //...this.formuploads.imageUrls,
                // ...this.formuploads.imageUrlx,
                ...this.formuploads.shineiURL,
                ...imglist
              ];
              console.log(houseSurveyImage)
              var arr = {
                //添加加密
                xiangShiToken:'72dc77f9a102317515a5a4ead2672d46',
                //订单ID
                ///id:831847,
                account:221105371,
                url: this.formuploads.adress,
                urlZq: this.formuploads.PublicInterestAdress,
                housePhotographyId: 831847,
                isSync: this.formuploads.checked ? 1 : 0,
                //  摄影师id
                // Surveyorid: 123,
                saleorrentid: 2884312,
                surveydate: this.getCurrentTime(true),
                houseSurveyImages: houseSurveyImage,
                hosuetype: 1,
                housesourceid: 9447033,
                // 盘型
                diskSourceType: "1",
                // 房源编号
                houseNo: 'HS260318272535',
                lpid: 3540,
                inputType: 1,
                hxType: this.formuploads.huxingType
              };
              if (this.formuploads.checked) {
                if (this.formuploads.imageUrls.length == 0) {
                  this.$message.error("请上传一张户型图");
                  return;
                }
                if (this.userInfo.city_id == 1 && !this.formuploads.huxingType) {
                  this.$message.error("请选择户型确认");
                  return;
                }
              }
              //console.log(arr)

              this.saveApi(arr).then(data => {
                if (data.data.code == 200) {
                  layui.use(['table','form','laydate','upload'], function() {
                    var $ = layui.jquery;
                      //console.log(data.data)
                      $.post("",{'house_nums':'HS260318272535'}, function (res) {
                          layer.msg(data.data.msg,{time:1000,icon:1}, function(){
                              var index = parent.layer.getFrameIndex(window.name); // 先得到当前 iframe 层的索引
                              parent.layer.close(index); // 再执行关闭
                          });
                      });
                  });

                  //this.$message.success(data.data.msg);
                  //this.reset();
                  //this.formuploaddialogVisibles = false;
                  //this.getinit();
                }
              });
            }
        }
    })
    setTimeout(function(){
        $('#docs-pictures').viewer({
    		url: 'data-original',
    		navbar: true, //点开查看的时候不显示缩略图
    	});
    },1000)
    
  </script>
</html>