const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sign= new Schema({
  
fname:{type: String},
lname:{type:String},
email:{type: String},
id:{type:String},
password:{type: Number},
    
});

module.exports = mongoose.model("sign", sign);
