const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  // User
 addchat : { type: String },
 date: {type: String},
 empid: {type: String},
});

module.exports = mongoose.model("chat", ChatSchema);