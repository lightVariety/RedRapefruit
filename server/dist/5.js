webpackJsonp([5],{224:function(module,exports,__webpack_require__){var Component=__webpack_require__(21)(__webpack_require__(241),__webpack_require__(258),null,null);module.exports=Component.exports},235:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _crypto=__webpack_require__(89),_crypto2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_crypto),userBasic={data:{name:"",mobile:"",verify:""},length:{mobile:11,verify:6},state:{disabled:!1},text:{getVerify:"获取验证码"}};exports.default={name:"home",data:function(){var _this2=this;return{user:{},userRole:["超级管理员","部门管理员","专员"],showEditUser:!1,currentTab:"basic",userBasic:{data:{name:"",mobile:"",verify:""},length:{mobile:11,verify:6},state:{disabled:!1},text:{getVerify:"获取验证码"}},userPwd:{oldPwd:"",newPwd:"",dbNewPwd:""},checkPwd:{oldPwd:[{validator:function(rule,value,callback){if(""===value)callback(new Error("请输入原有的密码~"));else{var pwd=value;pwd=_crypto2.default.createHmac("sha1","azumar").update(pwd).digest().toString("base64"),_this2.$ajax({method:"post",url:"/user/checkOldPwd",data:{pwd:pwd}}).then(function(res){0==res.data.code||_this.$Message.error(res.data.message)}).catch(function(){_this.$Message.error("小Mo开小差去了，请稍后再试~")})}},trigger:"blur"}]},imgUrl:"/dist/img/userHead/default.jpg"}},methods:{showEditModal:function(){this.showEditUser=!0,this.userBasic.data.name=this.user.userName},setTab:function(name){this.currentTab=name},getVerify:function(){var mobile=this.userBasic.data.mobile,_this=this;this.$ajax({method:"post",url:"/user/sendVerify",data:{mobile:mobile}}).then(function(res){if(0==res.data.code){var time=60;_this.$Message.success("发送成功"),_this.userBasic.state.disabled=!0;var interval=setInterval(function(){_this.userBasic.text.getVerify=time+"秒后重发",--time<0&&(_this.userBasic.state.disabled=!1,_this.userBasic.text.getVerify="重发验证码",clearInterval(interval))},1e3)}else _this.$Message.error(res.data.message)}).catch(function(){_this.$Message.error("小Mo开小差去了，请稍后再试~")})},editOk:function(){switch(this.currentTab){case"basic":this.editUserBasic();break;case"pwd":break;case"head":this.editUserHead()}},editUserBasic:function(){var data=this.userBasic.data,_this=this;this.$ajax({method:"post",url:"/user/editUserBasic",data:data}).then(function(res){0==res.data.code?(_this.$Message.success("修改成功！"),_this.$store.state.user=res.data.data):_this.$Message.error(res.data.message)}).catch(function(){_this.$Message.error("小Mo开小差去了，请稍后再试~")}),this.userBasic=userBasic},handleBefore:function(file){this.$Message.loading({content:"图片 ["+file.name+"] 正在上传，请稍后...",duration:0})},handleSuccess:function(event){0==event.code?(this.imgUrl=event.data.imgUrl,this.$Message.destroy()):this.$Message.error(event.message)},handleSize:function(file){this.$Notice.warning({title:"红西柚悄悄告诉你",desc:"您上传的图片 ["+file.name+"] 过大，请确保你所上传的文章封面图片不超过 2M。"}),this.$Message.destroy()},handleFormat:function(){this.$Notice.warning({title:"红西柚悄悄告诉你",desc:"您上传的图片 ["+file.name+"] 格式不正确，请上传 jpg 或 png 格式的图片。"}),this.$Message.destroy()},editUserHead:function(){var img=this.imgUrl,_this=this;this.$ajax({method:"post",url:"/user/editUserHead",data:{img:img}}).then(function(res){0==res.data.code?(_this.$Message.success("修改成功！"),_this.$store.state.user=res.data.data):_this.$Message.error(res.data.message)}).catch(function(){_this.$Message.error("小Mo开小差去了，请稍后再试~")})}},computed:{getUser:function(){return this.user=this.$store.state.user,this.$store.state.user}},watch:{getUser:function(val){this.user=val}}}},241:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _userCard=__webpack_require__(253),_userCard2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_userCard);exports.default={name:"home",components:{UserCard:_userCard2.default}}},253:function(module,exports,__webpack_require__){var Component=__webpack_require__(21)(__webpack_require__(235),__webpack_require__(257),null,null);module.exports=Component.exports},257:function(module,exports){module.exports={render:function(){var _vm=this,_h=_vm.$createElement,_c=_vm._self._c||_h;return _c("div",[_c("Card",[_c("p",{slot:"title"},[_vm._v("我")]),_vm._v(" "),_c("a",{attrs:{href:"#"},on:{click:_vm.showEditModal},slot:"extra"},[_c("Icon",{staticStyle:{"margin-right":"5px"},attrs:{type:"edit"}}),_vm._v("编辑资料")],1),_vm._v(" "),_c("div",{staticClass:"home-card"},[_c("div",{staticClass:"home-card-head"},[_c("img",{attrs:{src:_vm.user.userHead}})]),_vm._v(" "),_c("div",{staticClass:"home-card-info"},[_c("h1",[_vm._v(_vm._s(_vm.user.userName))]),_vm._v(" "),_c("p",[_c("Icon",{staticStyle:{"margin-right":"5px"},attrs:{type:"ios-telephone"}}),_vm._v(_vm._s(_vm.user.userMobile))],1),_vm._v(" "),_c("p",[_c("Icon",{staticStyle:{"margin-right":"5px"},attrs:{type:"person"}}),_vm._v(_vm._s(_vm.userRole[_vm.user.userType-1]))],1)])])]),_vm._v(" "),_c("Modal",{attrs:{title:"编辑个人资料","ok-text":"确认修改","cancel-text":"取消"},on:{"on-ok":_vm.editOk},model:{value:_vm.showEditUser,callback:function($$v){_vm.showEditUser=$$v},expression:"showEditUser"}},[_c("Tabs",{attrs:{value:"basic"},on:{"on-click":_vm.setTab}},[_c("TabPane",{attrs:{label:"基本资料",name:"basic"}},[_c("Form",{attrs:{model:_vm.userBasic,"label-width":80}},[_c("FormItem",{attrs:{label:"昵称"}},[_c("Input",{attrs:{placeholder:"请输入你的昵称"},model:{value:_vm.userBasic.data.name,callback:function($$v){_vm.userBasic.data.name=$$v},expression:"userBasic.data.name"}})],1),_vm._v(" "),_c("p",[_vm._v("若您只需要修改昵称，不需要获取到手机验证码哦~")]),_vm._v(" "),_c("FormItem",{attrs:{label:"手机号码"}},[_c("Row",[_c("i-col",{attrs:{span:"24"}},[_vm._v(_vm._s(_vm.user.userMobile))])],1),_vm._v(" "),_c("Row",{staticStyle:{"margin-top":"10px"}},[_c("i-col",{attrs:{span:"16"}},[_c("Input",{attrs:{placeholder:"请输入新的手机号码",maxlength:_vm.userBasic.length.mobile},model:{value:_vm.userBasic.data.mobile,callback:function($$v){_vm.userBasic.data.mobile=$$v},expression:"userBasic.data.mobile"}})],1),_vm._v(" "),_c("i-col",{attrs:{span:"7",push:"1"}},[_c("Button",{attrs:{type:"primary",long:"",disabled:_vm.userBasic.state.disabled},on:{click:_vm.getVerify}},[_vm._v(_vm._s(_vm.userBasic.text.getVerify))])],1)],1),_vm._v(" "),_c("Row",{staticStyle:{"margin-top":"10px"}},[_c("i-col",{attrs:{span:"10"}},[_c("Input",{attrs:{placeholder:"请输入短信验证码",maxlength:_vm.userBasic.length.verify},model:{value:_vm.userBasic.data.verify,callback:function($$v){_vm.userBasic.data.verify=$$v},expression:"userBasic.data.verify"}})],1)],1)],1)],1)],1),_vm._v(" "),_c("TabPane",{attrs:{label:"修改密码",name:"pwd"}},[_c("Form",{attrs:{model:_vm.userPwd,"label-width":80,rules:_vm.checkPwd}},[_c("FormItem",{attrs:{label:"旧密码",prop:"oldPwd"}},[_c("Input",{attrs:{type:"password",placeholder:"请输入旧密码"},model:{value:_vm.userPwd.oldPwd,callback:function($$v){_vm.userPwd.oldPwd=$$v},expression:"userPwd.oldPwd"}})],1)],1)],1),_vm._v(" "),_c("TabPane",{attrs:{label:"更换头像",name:"head"}},[_c("Upload",{ref:"upload",attrs:{accept:"image/*",format:["jpg","jpeg","png"],action:"/user/upload","on-success":_vm.handleSuccess,"show-upload-list":!1,"max-size":2048,"on-format-error":_vm.handleFormat,"on-exceeded-size":_vm.handleSize,"before-upload":_vm.handleBefore}},[_c("Button",{attrs:{type:"ghost",icon:"ios-cloud-upload-outline"}},[_vm._v("上传图片")])],1),_vm._v(" "),_c("Alert",{staticStyle:{"margin-top":"20px"},attrs:{type:"warning","show-icon":""}},[_vm._v("推荐使用 200 * 200 分辨率的 .jpg 后缀的图片；图片大小不得超过2M。")]),_vm._v(" "),_c("div",{staticClass:"user-card-head-img"},[_c("img",{attrs:{src:_vm.imgUrl}})])],1)],1)],1)],1)},staticRenderFns:[]}},258:function(module,exports){module.exports={render:function(){var _vm=this,_h=_vm.$createElement,_c=_vm._self._c||_h;return _c("section",{attrs:{id:"home"}},[_c("Row",{staticClass:"home-row"},[_c("i-col",{attrs:{span:"8"}},[_c("UserCard")],1),_vm._v(" "),_c("i-col",{attrs:{span:"15",push:"1"}},[_vm._v("12")])],1)],1)},staticRenderFns:[]}}});