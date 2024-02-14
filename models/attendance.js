const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendance= new Schema({
  
starttime:{type: String},
endtime:{type: String},
working_days:{type: Array},
    
});

module.exports = mongoose.model("attendance", attendance);
