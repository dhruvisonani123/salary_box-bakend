const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const holidaySchema= new Schema({
  
  holidaytype: {type: String},
  date: { type: String},
  
});

module.exports = mongoose.model("Holiday", holidaySchema);
