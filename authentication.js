// var JWTD = require("jwt-decode");
var jwtDecode = require("jwt-decode");
var bcrypt = require("bcryptjs");
var JWT = require("jsonwebtoken");
var SECRET_KEY =
  "dhgfbwhjegdshhgsfhguw";

var hashPassword = async (pwd) => {
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(pwd, salt);
  return hash;
};

var hashCompare = async (pwd, hash) => {
  let result = await bcrypt.compare(pwd, hash);
  return result;
};

var createToken = async ({
  _id,
  name,
  mobileNo,
  email,
  password,
  address,
  empid,
}) => {
  let token = await JWT.sign(
    {
      _id: _id,
      name: name,
      mobileNo: mobileNo,
      password: password,
      email: email,
      address: address,
      empid:empid,
    },
    SECRET_KEY,
    {
      expiresIn: "500h",
    }
  );
  return token;
};


var verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" "); // Assuming the token is provided as "Bearer <token>"
    let decodeData = jwtDecode(token);
    if (Date.now() / 1000 < decodeData.exp) {
      next();
    } else {
      res.json({
        statusCode: 401,
        message: "Token Expired Login again!",
      });
    }
  } catch (error) {
    res.json({
      statusCode: 401,
      message: "Invalid Token",
    });
  }
};

module.exports = {
  verifyToken,
  hashPassword,
  hashCompare,
  createToken,
};