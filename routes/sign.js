const express = require("express");
const router = express.Router();
const sign=require("../models/sign");
const { createToken } = require("../authentication");




router.post("/sign", async (req, res) => {
    try {   
      var count=await sign.count();
      function pad(num){
        num=num.toString();
        while(num.length < 2)num ="0" + num;
        return num;
      }
      const name=req.body.name;
      const paddeedcount =pad(count+1);

      const id=name+paddeedcount;
      req.body["id"]=id

    const data=await sign.create(req.body);
      
    if(data){
        res.json({
            statusCode:200,
            data:data,
            message:"register successfully added"
        })
    }
}
catch(error){
    res.status(500).json({
        statusCode:500,
        message:error.message,
    })
}
});

router.post("/log",async(req,res)=>{
  try{
    const users= await sign.findOne({name:req.body.name,password:req.body.password})
    console.log("login",users)
    if(!users){
      return res
      .status(403)
      .json({statusCode:403,message:"invalid name and password"})
    }

    const token=await createToken({
      name:users.name,
      password:users.password,
      email:users.email,
      id:users.id,
    });


    res.status(200).json({
      statusCode:200,
      message:"user authenticated",
      token:token,
      id:users.id,
      email:users.email,
    })
  }catch(error){
    res.status(500).json({statusCode:500,message:error.message});
  }
});

router.get("/data",async(req,res)=>{
  try{
    var data=await sign.find();

    res.json({
      statusCode:200,
      data:data,
      message:"data get succesfully"

    });
  }
  catch(error){
    res.json({
      statusCode:500,
      message:error.message,
    });
  }
})
  
router.put("/data/:id",async(req,res)=>{
  try{
    const id=req.params.id;
    const user=await sign.findOne({id:id})
console.log(user,"id")
    if(!user){
      return res.status(404).json({
        statusCode:404,
        message:"user not found"
      });
      
    }
    user.name=req.body.name || user.name;
    user.email=req.body.email || user.email;
    user.password=req.body.password || user.password;

    await user.save();

    res.status(200).json({
      statusCode:200,
      message:"updated succesfully"
    })
  }
  catch(error){
    res.status(500).json({
      statusCode:500,
      message:error.message

    });
  }

});


router.delete("/data/:id",async(req,res)=>{
  try{
    const id=req.params.id;

    const deletedata=await sign.findOneAndRemove({id});

    if(!deletedata){
      return res.status(404).json({
        statusCode:404,
        message:"data not found"
      })
    }

    res.json({
      statusCode:200,
      data:deletedata,
      message:"data delete succesfully"
    });
    
  }catch(error){
    res.status(500).json({
      statusCode:500,
      message:error.message
    })
  }
})
  
module.exports = router;