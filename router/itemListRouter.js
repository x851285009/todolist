//引入express
var express = require('express');
//引入body-parser
var bodyParser = require('body-parser');
//引入模型对象
var Item = require('../models/items');
//创建路由器对象
var router = express.Router();
//通过中间件应用bodyParser
//解析请求体中的参数，挂载到req.body上
router.use(bodyParser.urlencoded({extended: true}));
//配置路由器
//创建一个路由，用来修改待办事项的内容
router.post("/updateTitle",function (req , res) {
  //获取待办事项的id
  var itemId = req.body.id;
  //获取要修为的内容
  var title = req.body.title;
  //获取当前用户的id
  var userId = res.locals.session.todolist_id;
  //修改指定item
  Item.update({_id:itemId, userId:userId},{$set:{title:title, state:1}},function (err) {
    if (!err) {
      //跳转到item_list
      res.redirect("/itemList");
    }
  })
});
//创建一个路由，用来修改待办事项的状态
router.get("/updateState" , function (req , res) {
  //获取待办事项的id
  var itemId = req.query.id;
  //获取到要修改成的状态
  var state = req.query.state;
  //获取当前用户的id
  var userId = res.locals.session.todolist_id;
  //修改指定item
  Item.update({_id:itemId, userId:userId},{$set:{state:state}}, function (err) {
    if (!err) {
      //跳转到item_list
      res.redirect("/itemList")
    }
  })
});
//创建一个路由，用来处理添加待办事项的功能
router.post("/addItem",function (req , res) {
  //获取用户填写的标题
  var title = req.body.title;
  //获取当前用户的id
  var userId = res.locals.session.todolist_id;
  //调用Item将待办事项插入到数据库中
  Item.create({
    title:title,
    userId:userId
  },function (err) {
    if (!err) {
      //跳转到item_list
      res.redirect("/itemList")
    }
  })
});
//将路由器对象暴露出去
module.exports = router;