const mongoose = require("mongoose");
// var router = express.Router();
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  // User
  name: { type: String },
  email: { type: String },
  password:{type:String},
  mobileNo:{type:Number},
  adharnumber:{type:Number},
  pannumber:{type:Number},
  dob:{type:String},
  gender:{type:String},
  address:{type:String},
  designation:{type:String},
  dojoining:{type:String},
  empid:{type:String},
  profile:{type:String}

  
});

module.exports = mongoose.model("employee", employeeSchema);
