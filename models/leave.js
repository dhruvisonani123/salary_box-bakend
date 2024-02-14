const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leave= new Schema({
  
    fromdate: { type: String },
    todate:{type:String},
    leavetype:{type:String},
    reasonofleave:{type:String},
    empid:{type:String},
    applydate:{type:Date},
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"], // Valid enum values
      default: "pending",
    },
  
});

module.exports = mongoose.model("Leave", leave);
