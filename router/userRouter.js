var express = require('express');
var bodyParser = require('body-parser');
var sha1 = require('sha1');
var User = require('../models/users');
//创建路由器对象
var router = express.Router();
//解析请求体内的参数挂载到req.body
router.use(bodyParser.urlencoded({extended:true}));
router.post('/regist',function (req,res) {
    var info = req.body;
    var username = info.username;
    var password = info.password;
    var passwordConfirm = info.passwordConfirm;
    var email = info.email;
    //正则验证
    var umReg = /^[a-zA-Z0-9_]{6,12}$/;
    var pwdReg = /^[a-zA-Z0-9_]{6,12}$/;
    var emailReg = /^[a-z0-9-_]{3,10}@[a-z0-9]{2,6}\.com$/i;

    var errMsg = {username:username};
    if(!umReg.test(username)){

        errMsg.umErr = '用户名格式不正确,请输入长度6-12位,包含数字字母下划线';
    }
    if(!pwdReg.test(password)){

        errMsg.pwdErr = '密码格式不正确,请输入长度6-12位,包含数字字母下划线';
    }
    if(password !== passwordConfirm){

        errMsg.rePwdErr = '两次密码不一致请重新输入';
    }
    if(!emailReg.test(email)){

        errMsg.emailErr = '您的邮箱格式不正确,邮箱地址应包含@ 后缀为.com';
    }
    if(errMsg.umErr || errMsg.pwdErr || errMsg.rePwdErr || errMsg.emailErr){
        res.render('regist',{errMsg:errMsg});
        return;
    }
    User.create({
        username:username,
        password:sha1(password),
        email:email
    },function (err) {
        if(!err){
            res.redirect('./login');
        }else {
            errMsg.umErr = '用户名已存在';
            res.render('regist',{errMsg:errMsg});
        }
    })
});
router.post('/login',function (req,res) {
    var info = req.body;
    var username = info.username;
    var password = info.password;
    var errMsg = {username: username};
    User.find({username:username},function (err,user) {
        if(!err){
            if(user[0]){
                if(user[0].password === sha1(password)){
                    req.session.todolist_id = user[0]._id + '' ;
                    // res.cookie('username',username,{maxAge:10000000});
                    res.redirect('/itemList');
                }else {
                    errMsg.pwdErr = '您输入的密码错误';
                    res.render('login',{errMsg:errMsg});
                }
            }else {
                errMsg.username = username;
                errMsg.umErr = '您输入的用户名不存在';
                res.render('login',{errMsg:errMsg});
            }
        }
    })
});
module.exports = router;