const express = require("express");
const router = express.Router();
const salary=require("../models/salary");


router.post("/salary", async (req, res) => {
    try {
      
      var data = await salary.create(req.body);
      console.log("data kdslda",data)
      res.json({
        statusCode: 200,
        data: data,
        message: "Add  Successfully",
      });
    } catch (error) {
      res.json({
        statusCode: 500,
        message: error.message,
      });
    }
  });



  router.get("/salary",async (req, res) => {
    try{
      var data=await salary.find();

      res.json({
        statusCode:200,
        data:data,
        message:"retrive succesfully",
      });
    }
    catch(error){
      res.json({
        statusCode:500,
        message:error.message,
      });
    }   
  });



  router.put("/salary/:empid", async (req, res) => {
    try {
      // Find the user by their unique identifier, in this case, "empid"
      const empid = req.params.empid;
      const user = await salary.findOne({ empid: empid });
  
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: "User not found",
        });
      }
  
      // Update user information with the data from the request body
      user.empid = req.body.empid || user.empid;
      user.salary = req.body.salary || user.salary;
      
  
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