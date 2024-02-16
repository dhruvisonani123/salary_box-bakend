var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var dbCollation = require("./db.js");
var document =require("./routes/document.js");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var empbankdetail = require("./routes/empbankdetail.js");
var notes = require("./routes/notes.js");
var leave=require("./routes/leave.js");
var latecount=require("./routes/latecount.js");
var salary=require("./routes/salary.js");
// var punching=require("./router/punching.js");
var PunchinRouter = require("./routes/punching.js");
var ChatRouter = require("./routes/chats.js");
var HolidaysRouter = require("./routes/holiday.js");
var attendance =require("./routes/attendance.js");
const corsOptions = {
  origin: "https://https://salary-box-bakend-fre5-git-main-dheuvisonani123.vercel.app/", // Replace with the actual origin of your frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Add the HTTP methods your API supports
  credentials: true
};

var app = express();

// // view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/empbankdetail", empbankdetail);
app.use("/notes", notes);
app.use("/leave",leave)
app.use("/punching", PunchinRouter);
app.use("/chats", ChatRouter);
app.use("/document",document);
app.use("/holiday", HolidaysRouter);
app.use("/latecount",latecount);
app.use("/salary",salary);
app.use("/attendance",attendance);
app.use(cors(corsOptions));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
