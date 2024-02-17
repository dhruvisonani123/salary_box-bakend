const express = require("express");
const router = express.Router();
const Empbankdetail = require("../models/empbankdetail");
const employee = require("../models/employee");

router.post("/bank", async (req, res) => {
  try {
    // Check if a user with the provided account number already exists
    const user = await Empbankdetail.findOne({
      accountNumber: req.body.accountNumber,
    });

    if (user) {
      //if user exist
      return res.status(403).json({
        statusCode: 403,
        message: "Account number already in use",
      });
    } else {
     
      // Create a new user based on the request body
      const newUser = new Empbankdetail({
        accountNumber: req.body.accountNumber,
        bankName:req.body.bankName,
        ifsccode:req.body.ifsccode,
        holdername:req.body.holdername,
        empid:req.body.empid,

        // Add other user details here
      });
      await newUser.save();
      
      // Save the new user to the database
     

      res.status(200).json({
        statusCode: 200,
        message: "Successfully created user",
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});


router.get("/totalemp", async (req, res) => {
  try {
    const results = await employee.find()
//     const totalcount =results.length;
// console.log("results",results)

    res.status(200).json({
      statusCode: 200,
      message: "Search results",
      // data: results,
      totalcount:results.length
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

router.get("/bank", async (req, res) => {
  try {
    // Retrieve all users from the database
    const allUsers = await Empbankdetail.find();

    // Return the array of user data
    res.status(200).json({
      statusCode: 200,
      data: allUsers,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.put("/bank/:empid", async (req, res) => {
  try {
    // Find the user by their unique identifier, in this case, "empid"
    const empid = req.params.empid;
    const user = await Empbankdetail.findOne({ empid: empid });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Update user information with the data from the request body
    user.accountNumber = req.body.accountNumber || user.accountNumber;
    user.bankName = req.body.bankName || user.bankName;
    user.ifsccode = req.body.ifsccode || user.ifsccode;
    user.holdername = req.body.holdername || user.holdername;

    // You can add other user details here that need to be updated

    // Save the updated user to the database
    await user.save();

    res.status(200).json({
      statusCode: 200,
      message: "User information updated successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});


module.exports = router;
