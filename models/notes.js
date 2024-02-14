const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notes = new Schema({
  addnote: { type: String },
  
  
});

module.exports = mongoose.model("Notes", notes);