//引入express
var express = require('express');
//引入sha1
var sha1 = require('sha1');
//连接数据库
require('./tools/db');
//引入User模型对象
var User = require('./models/users');
var Item = require('./models/items');
//引入路由器
var userFaceRouter = require('./router/userFaceRouter');
var userRouter = require('./router/userRouter');
var itemListRouter = require('./router/itemListRouter');
//引入session
var session = require('express-session');
var mongoose = require('mongoose');
//将session配置为mongoDB中持久化的仓库
var MongoStore = require('connect-mongo')(session);
//创建应用对象
var app = express();
//设置模板引擎
app.set('view engine', 'ejs');
//设置静态资源目录
app.set('views', './views');
//配置静态资源
app.use(express.static('public'));
//设置为中间件
app.use(session({
    resave:false, //强制session保存到session store中
    saveUninitialized:false,  //强制没有‘初始化’的session保存到storage中
    secret:"todolist_id", //相当于一个加密密钥，值可以是任意字符串
    store: new MongoStore({
        url:'mongodb://localhost:27017/test'

    })
}));
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
//应用路由器
app.use(userFaceRouter);
app.use(userRouter);
app.use(itemListRouter);
//坑！！ 错误页面
app.use(function (req, res) {
    res.render('404')
});
//插入一条数据
User.create({
    username: 'admin',
    password: sha1('123123'),
    email: 'admin@admin.com'
}, function (err) {
    if (!err) {
        console.log('首次插入数据')
    }
});
//添加一次后删除该代码
/*Item.create({
  title: '吃饭睡觉打豆豆',
  userId: '5ac4381109fe9c236c05375d'
}, function (err) {
  if (!err) {
    console.log('首次插入数据')
  }
})*/
//启动项目
app.listen(3000, function () {
    console.log('服务器启动成功了')
});
