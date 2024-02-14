const mongoose = require("mongoose");
// var router = express.Router();
const Schema = mongoose.Schema;

const document = new Schema({
  // User
  adddocument: { type: String },
});

module.exports = mongoose.model("Document", document);
