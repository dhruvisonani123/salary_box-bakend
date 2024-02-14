const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const punching = new Schema({
  

 
  attendandanceTime: {type: String},
  attendandanceDate:{type:Date},
  status: {type: String},
  mobileNo:{type: Number},
  fromDate:{type: Date},
  toDate:{type: Date},
  empid:{type: String},
  // date: { type: Date, default: Date.now },
  date: { type: Date},
     
});

module.exports = mongoose.model("Punching", punching);