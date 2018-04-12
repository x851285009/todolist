//用来创建模型对象
//引入mongoose
var mongoose = require('mongoose');
//创建Schema
var Schema = mongoose.Schema;
//创建约束对象
var itemsSchema = new Schema({
  title:String,
  state:{  //0删除  1未完成（默认值）  2完成
    type:Number,
    default:1
  },
  userId:Schema.Types.ObjectId
}, {
  versionKey: false
});
//创建模型
var Item = mongoose.model('items', itemsSchema);
//暴露Item出去
module.exports = Item;