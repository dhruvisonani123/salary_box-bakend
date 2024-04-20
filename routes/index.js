var express = require("express");
var router = express.Router();
var Register = require("../models/employee");
const nodemailer = require("nodemailer");
const Mailgen =require("mailgen")
const employee = require("../models/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var { createToken } = require("../authentication");

// var reg=require("../models/router");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ title: "Express" });
});

router.post("/company", async (req, res) => {
  try {
    var count = await employee.count();
    function pad(num) {
      num = num.toString();
      while (num.length < 2) num = "0" + num;
      return num;
    }

    const employeeName = req.body.fname;
    const paddedCount = pad(count + 1);
    // Assuming name is in req.body

    // Generate the employee ID by combining the padded count and the name
    const empid = employeeName + paddedCount;

    // Assign the generated employee ID to req.body
    req.body["empid"] = empid;

    const data = await Register.create(req.body);

    if (data) {
      res.json({
        statusCode: 200,
        data: data,
        message: "Register Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.post("/email",async(req,res)=>{
  let { name, email, phone,city } = req.body;
  
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: 'dhruvisonaniid@gmail.com', // Update with your Gmail email
        pass: 'hqkzfziamuplbfha' // Update with your Gmail password
      },
      tls: {
        rejectUnauthorized: false // Add this line
      }
    });
  
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Sidhhivinayk Company',
        link: 'https://teamflourish.co/'
        // You can also add a logo here if needed
      }
    });
  
    const emailBody = {
      body: {
        // name: Name,
        intro: "You have received a new message from the contact form:",
        table: {
          data: [
            {
              "Name": name,
              "Email": email,
              "Phone": phone,
             "city":city,
            }
          ]
        },
        outro: 'Thank you for contacting us.'
      }
    };
  
    const emailTemplate = mailGenerator.generate(emailBody);
  
    const info = await transporter.sendMail({
      from: 'harpalkotarkotar@gmail.com', // sender address (must be the same as authenticated user)
      to: "harpalkotarkotar@gmail.com", // recipient email address
      subject: 'New Message from Contact Form',
      html: emailTemplate
    });
  
    console.log("Message sent: %s", info.messageId);
    res.json(info.messageId);
})


router.get("/search/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;

    // Use Mongoose to find records by mobile number
    const results = await employee.find({ mobileNo: mobileNumber });

    res.status(200).json({
      statusCode: 200,
      message: "Search results",
      data: results,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.export = router;

router.put("/imageupdate/:id",async (req, res) => {
  try {
    let result = await employee.findByIdAndUpdate(req.params.id, req.body);
    console.log(result,"result")
    res.json({
      statusCode: 200,
      data: result,
      message: "profile photo updated",
    });
  } catch (err) {
    res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});

// router.delete("/company/:id", async (req, res) => {
//   try {
//     const deletedCompany = await Register.findByIdAndRemove(req.params.id);

//     if (!deletedCompany) {
//       return res.status(404).json({
//         statusCode: 404,
//         message: "Company not found",
//       });
//     }

//     res.json({
//       statusCode: 200,
//       data: deletedCompany,
//       message: "Company deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });
//autoid generate

// Assuming this code is inside an asynchronous function or an async route handler.

//login page


router.post("/login", async (req, res) => {
  try {
    // Find a user with the provided name
    const user = await Register.findOne({ name: req.body.name, password: req.body.password });
console.log(user,"user")
    if (!user) {
      return res
        .status(403)
        .json({ statusCode: 403, message: "Invalid name and password" });
    }

    // Check if the provided password matches the stored password using bcrypt

    // Create a token using the user's information (excluding the password)
    const token = await createToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      password:user.password,
      mobileNo: user.mobileNo,
      address: user.address,
      empid:user.empid,
    });

    // Send the token as a response
    res.status(200).json({
      statusCode: 200,
      message: "User Authenticated",
      token: token,
      mobileNo: user.mobileNo,
      empid:user.empid
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
});






//get user 

// Assuming you have an "employee" model defined using Mongoose

router.get("/employeedate", async (req, res) => {
  try {
   
    const results = await employee.find();
console.log("results",results)
    res.status(200).json({
      statusCode: 200,
      message: "Search results",
      data: results,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});


router.get("/totalemp", async (req, res) => {
  try {
    const results = await employee.find();
    const totalcount =results.length;
console.log("results",results)

    res.status(200).json({
      statusCode: 200,
      message: "Search results",
      data: results,
      totalcount:totalcount
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});





//update user
router.put("/company/:empid", async (req, res) => {
  try {
    const empid = req.params.empid;
    const updateData = req.body;

    // Update the user data based on the empid
    const updatedUser = await employee.findOneAndUpdate({ empid }, updateData, {
      new: true
    });

    if (!updatedUser) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found"
      });
    }

    res.json({
      statusCode: 200,
      data: updatedUser,
      message: "User data updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
});




router.delete("/company/:empid", async (req, res) => {
  try {
    const empid = req.params.empid;

    // Find and delete the employee by empid
    const deletedEmployee = await employee.findOneAndRemove({ empid });

    if (!deletedEmployee) {
      return res.status(404).json({
        statusCode: 404,
        message: "Employee not found"
      });
    }

    res.json({
      statusCode: 200,
      data: deletedEmployee,
      message: "Employee deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message
    });
  }
});


router.get("/employeedates", async (req, res) => {
  try {
    // Use the `select` method to specify the fields you want to retrieve
    const results = await employee.find().select("name mobileNo");
    console.log("results", results);
    
    res.status(200).json({
      statusCode: 200,
      message: "Search results",
      data: results,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});


//for profile photo





module.exports = router;