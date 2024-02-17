var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://dhruvi:dhruvi123@cluster0.lskz6ku.mongodb.net/AMS"
    
    

  )
  .then(() => console.log("connection successful"))
  .catch((err) => console.error("MongoDB Error", err));

module.exports = mongoose.connection;