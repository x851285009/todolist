var express = require('express');
//创建路由器对象
var router = express.Router();
var User = require('../models/users');
var Item = require('../models/items');
//cookie
// router.use(function (res,req,next) {
//     res.locals.username = '';
//     var cookie= req.headers.cookie.split(';');
//     for (var i = 0; i < cookie.length; i++){
//         if(cookie[i].match('username')){
//             res.locals.username = cookie[i].split('=')[0];
//             break;
//         }
//     }
//     next();
// });
//session
router.get('/login',function (req,res) {
    if (res.locals.session.todolist_id){
        res.redirect('/itemList');
    } else {
        res.render('login',{errMsg:{}});
    }
});
//解析请求体内的参数挂载到req.body
// router.get('/login',function (req,res) {
//     if(res.locals.username){
//         res.redirect('/itemList');
//     } else {
//         res.render('login',{errMsg:{}});
//     }
// });
router.get('/regist',function (req,res) {
    res.render('regist',{errMsg:{}});
});
router.get('/itemList',function (req,res) {
    if (res.locals.session.todolist_id) {
        User.find({_id: res.locals.session.todolist_id}, function (err, user) {
            if (!err && user[0]) {
                Item.find({ userId: res.locals.session.todolist_id},function (err,items) {
                    if (!err) {
                        res.render('item_list', {username: user[0].username , itemList: items})
                    }
                })
            } else {
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/login');
    }
});
// router.get('/itemList',function (req,res) {
//     if(res.locals.username){
//         res.render('item_list',{username:res.locals.username})
//     } else {
//         res.redirect('/login');
//     }
//     // var cookieList = req.headers.cookie.split(';');
//     // for (var i = 0;i<cookieList.length;i++){
//     //     if(cookieList[i].match('username')){
//     //         var username = cookieList[i].split('=')[1];
//     //         break;
//     //     }
//     // }
//     // // var username = cookieList[cookieList.length-1].split('=')[1];
//     // res.render('item_list',{username:username});
// });
router.get('/logout',function (req,res) {
    req.session.destroy();
    res.redirect('/login');
})
module.exports = router;