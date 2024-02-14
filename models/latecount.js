const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const latecount= new Schema({
  
    punchintime: {type: String},
    punchouttime: {type: String},
    mobileNo:{type:Number},
    
});

module.exports = mongoose.model("latecount", latecount);
