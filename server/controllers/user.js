const request = require('request');

const common = require('./../common/common.js');
const User = require('./../schema/user.js');
const Verify = require('./../schema/verify.js');

// 获取用户列表
let getUserList = async (ctx, next) => {
    let page = parseInt(ctx.query.page),
        size = parseInt(ctx.query.size),
        skip = size*(page-1);

    let response = await new Promise((resolve, reject)=>{

        User.find({}, null, {skip: skip, limit: size}).sort({createdAt: 1}).exec((err, res)=>{
            if(err){
                resolve({code: 102, message: err});
            }else{
                let userList = [];
                res.map((user)=>{
                    userList.push({
                        userId: user._id,
                        userName: user.userName,
                        userMobile: user.userMobile,
                        userType: user.userType,
                        createdAt: common.getDateTime(user.createdAt),
                        userHead: user.userHead,
                        userStatus: user.userStatus
                    });
                });

                resolve({code: 0, message: '', data: {list: userList, current: page }})
            }
        });
    });

    await new Promise((resolve, reject)=>{
        User.count({}, function (err, res) {

            if(err){
                resolve({code: 102, message: err.message});
            }else{
                if(response.data.list.length>0) response.data.total = res;
                else response.data.total = 0;
                response.data.lastPage = Math.ceil(response.data.total/size);
                resolve('ok');
            }
        });
    });

    ctx.response.body = response;
};

// 添加新用户
let addUser = async (ctx, next) => {
    let data = ctx.request.body;

    let user = new User({userName: data.mobile, userMobile: data.mobile, userPwd: data.pwd, userType: data.type});

    let newUser = await new Promise((resolve)=>{
        user.save(function (err, res) {
            if(err){
                resolve({code: 102, message: err});
            }else{
                resolve({code: 0, message: '添加成功'});
            }
        });
    });

    ctx.response.body = newUser;
};

// 编辑用户
let editUser = async (ctx, next)=> {
    let data = ctx.request.body,
        where = {};
    if(data.name) where.userName = data.name;
    if(data.mobile) where.userMobile = data.mobile;
    if(data.type) where.userType = data.type;
    let editUserReason = await new Promise((resolve)=>{
        User.update({_id: data.id}, where, function(err, res){
            if (err) {
                resolve({code: 102, message: err});
            }
            else {
                resolve(getCurrentLoginUser(data.id));
            }
        });
    });

    ctx.response.body = editUserReason;
};

// 发送验证码
let sendVerify = async (ctx, next) => {
    let uId = ctx.session.user.userId,
        mobile = ctx.request.body.mobile;

    let verifyCode = common.randomSix(),
        verify = new Verify({verifyCode: verifyCode, user: uId});

    // 第一步：判断该用户是否已经发送过验证码了，如果有则更改数据库中的数据，如果没有则创建一条数据

    let verifyData = await new Promise((resolve)=>{
        Verify.find({user: uId}).exec(function (err, res) {
            if(err){
                resolve({code: 102, message: err.message});
            }else{
                resolve({code: 0, message: '', data: res[0]});
            }
        });
    });
    await new Promise((resolve)=>{
        if(verifyData.data){
            Verify.update({user: uId}, {verifyCode: verifyCode}, function(err, res){
                if (err) {
                    resolve({code: 102, message: err});
                }
                else {
                    resolve({code: 0, message:'更新成功'});
                }
            });
        }else{
            verify.save(function (err, res) {
                if(err){
                    resolve({code: 102, message: err});
                }else{
                    resolve({code: 0, message:'创建成功'});
                }
            });
        }
    });

    // 第二步：通过腾讯云服务器，发送短信

    let random = Math.round(Math.random()*99999),
        curTime = Math.floor(Date.now()/1000),
        appId = 1400047070;

    var reqObj = {
        tel: {
            nationcode: 86+'',
            mobile: mobile+''
        },
        tpl_id: Number(52175),
        params: [ verifyCode, 5 ],
        sig: common.getSmsSig(random, curTime, [mobile]),
        time: curTime
    };

   let smsResult = await new Promise((resolve)=>{
       request({
           url: 'https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid=' + appId + '&random=' + random,
           method: 'POST',
           json: false,
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(reqObj)
       }, (error, response, body) => {
           if (!error && response.statusCode == 200) {
               resolve({code: 0, message: '发送成功'});
           } else if (!error && response.statusCode != 200) {
               var retObj = {
                   code: -1,
                   message: 'http code ' + response.statusCode
               };
               resolve(retObj);
           } else {
               var retObj = {
                   code: -2,
                   message: error.toString()
               };
               resolve(retObj);
           }
       });

   });

    ctx.response.body = smsResult;
};

// 判断是否和旧密码一样
let checkOldPwd = async (ctx, next) => {
    let pwd = ctx.request.body.pwd;

    console.log(pwd);
};

// 修改基本资料
let editUserBasic = async (ctx, next)=> {
    let data = ctx.request.body,
        uId = ctx.session.user.userId;

    if(data.mobile && data.verify){
        // 第一步：判断该用户的验证码正确
        let valid = await new Promise((resolve)=>{
            Verify.find({user: uId, verifyCode: data.verify}).exec((err, res)=>{
                if(err){
                    resolve({code: 102, message: err.message});
                }else{
                    resolve({code: 0, message: '', data: res[0]});
                }
            });
        });

        // 第二步：验证验证码是否过期
        let timeout = await new Promise((resolve)=>{
            if(valid.data){
                let updatedTime = new Date(valid.data.updatedAt).getTime(),
                    now = new Date().getTime();

                if(now - updatedTime >300000){
                    // 过期
                    resolve({code: 504, message: '验证码已经过期，请重新获取~'});
                } else {
                    // 有效，可以修改手机
                    User.update({_id: uId}, {userName: data.name, userMobile: data.mobile}, function(err, res){
                        if (err) {
                            resolve({code: 102, message: err});
                        }
                        else {
                            ctx.session.user = getCurrentLoginUser(uId).data;
                            resolve(getCurrentLoginUser(uId));
                        }
                    });

                }
            } else{
                resolve({code: 201, message: '验证码无效，请重新获取~'});

            }
        });

        ctx.response.body = timeout;
    } else {

        let updateUserOnlyName = await new Promise((resolve)=>{
            User.update({_id: uId}, {userName: data.name}, function(err, res){
                if (err) {
                    resolve({code: 102, message: err});
                }
                else {
                    ctx.session.user = getCurrentLoginUser(uId).data;
                    resolve(getCurrentLoginUser(uId));
                }
            });
        });

        ctx.response.body = updateUserOnlyName;
    }
};

// 修改用户头像
let editUserHead = async (ctx, next)=> {
    let img = ctx.request.body.img,
        uId = ctx.session.user.userId;

    img = img.slice(1, img.length);

    let response = await new Promise((resolve, reject)=>{
        User.update({_id: uId}, {userHead: img}, function(err, res){
            if(err){
                resolve({code: 102, message: err});
            }else {
                ctx.session.user = getCurrentLoginUser(uId).data;
                resolve(getCurrentLoginUser(uId));
            }
        });
    });
    ctx.response.body = response;
};

// 修改用户状态
let updateUserStatus = async (ctx, next)=> {
    let id = ctx.request.body.id,
        status = ctx.request.body.status;

    let newStatus = await new Promise((resolve, reject)=>{
        User.update({_id: id}, {userStatus: status}, function(err, res){
            if(err){
                resolve({code: 102, message: err});
            }else {
                resolve(getCurrentLoginUser(id));
            }
        });
    });
    ctx.response.body = newStatus;
};

// 获取当前登录用户的所有信息
let getCurrentLoginUser = async (uId)=>{

    let currentLoginUser = await new Promise((resolve)=>{
        User.findOne({_id: uId}).exec((err, res)=>{
            if(err) {
                resolve({code: 102, message: err});
            } else {
                let user = {
                    userId: res._id,
                    userName: common.unary(res.userName, res.userMobile),
                    userMobile: common.unary(res.userMobile, '10000000000'),
                    userHead: common.unary(res.userHead, ''),
                    userType: common.unary(res.userType, 3),
                    userStatus: common.unary(res.userStatus, 1)
                };

                resolve({code: 0, message:'更新成功', data: user});
            }
        });
    });
    return currentLoginUser;
};

module.exports = {
    'GET /user/getUserList': getUserList,
    'POST /user/addUser': addUser,
    'POST /user/sendVerify': sendVerify,
    'POST /user/checkOldPwd': checkOldPwd,
    'POST /user/editUserBasic': editUserBasic,
    'POST /user/editUserHead': editUserHead,
    'POST /user/editUser': editUser,
    'POST /user/updateUserStatus': updateUserStatus
};