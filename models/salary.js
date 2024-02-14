const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salary= new Schema({
  
empid:{type: String},
salary:{type: Number},
    
});

module.exports = mongoose.model("salary", salary);
