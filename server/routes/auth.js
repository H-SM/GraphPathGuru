const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = "gpg_no_way_home_44";

//ROUTE 1: create a user using : POST "/api/auth/createuser". doesnt require Auth ( authenitication ), No login required 
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', 'Password must have a minimum of 5 characters').isLength({ min: 5 }),
  ],async (req,res)=>{
    const errors = validationResult(req);
    let success = false;
    if(!errors.isEmpty()){
        return res.status(400).json({success, errors : errors.array()});
    }
    try{
    const salt =await bcrypt.genSalt(10);
    const secPass =await bcrypt.hash(req.body.password, salt);

    const user =await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
    });
    const data = { 
        user :{ 
            id : user.id
        }
    }
    const jwt_token = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, jwt_token});

    }catch(err){
        if(err.code=== 11000){
            //Duplicate key error 
            return res.status(400).json({success, error : "Email Already Exist"});
        }
        console.error(err);
        res.status(500).json({success, error : "server error", message : err.message});
    }
});

//ROUTE 2: Authenticate a user using : POST "/api/auth/login". No login required 
router.post('/login',[
    body('email', "Enter a valid Email").isEmail(),
    body('password', 'Password cannot be blank').exists()
  ],async (req,res)=>{
    const errors = validationResult(req);
    let success = false;
    if(!errors.isEmpty()){
        return res.status(400).json({success , errors : errors.array()});
    }
    const { email , password} = req.body;

    try{
        let user =await User.findOne({email});
        if(!user){
            return res.status(400).json({success, error :"Check over your credentials again"});
        }
        const passwordCompare =await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({success, error :"Check over your credentials again"});
        }
        const payload = { 
            user :{ 
                id : user.id
            }
        }
        const auth_token = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.json({success, auth_token});
    }catch(err){
        console.error(err);
        res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
    }

});

//ROUTE 3:GET logged-in user details : POST "/api/auth/getuser". login required 
router.get('/getuser',fetchuser,  async (req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (err_hsm) {
        console.error(err_hsm);
        res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
    }
});

//ROUTE 4: Update user name. no verification required

router.put('/settings/name',[
    fetchuser,
    body('name', 'Enter a valid name').isLength({ min: 3 }),
],async (req,res)=>{
    try {
        const userId = req.user.id;
        let success = false;
        const { name } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ success, error: "Check over your credentials again" });
        }

        const updInfo = {};
        if(name){updInfo.name = name;}
        success = true;
        const user_upd = await User.findByIdAndUpdate(userId, {$set : updInfo},{new : true});
        res.json({ success, user_upd });
}catch(err){
    console.error(err);
    res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
}
});
//ROUTE 4: Update profile pic. no verification required

router.put('/settings/pfp',[
    fetchuser,
    body('image'),
],async (req,res)=>{
    try {
        const userId = req.user.id;
        let success = false;
        const { image } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ success, error: "Check over your credentials again" });
        }

        const updInfo = {};
        updInfo.image = image;
        success = true;
        const user_upd = await User.findByIdAndUpdate(userId, {$set : updInfo},{new : true});
        res.json({ success, user_upd });
}catch(err){
    console.error(err);
    res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
}
});

//ROUTE 5: Update user info. verification required [ for password ]
router.put('/settings/pw',[
    fetchuser,
    body('newpassword', 'Password cannot be blank').exists(),
    body('oldpassword', 'Password cannot be blank').exists(),
],async (req,res)=>{
    try {
            const userId = req.user.id;
            let success = false;
            const { oldpassword, newpassword } = req.body;
            const user = await User.findById(userId);
    
            if (!user) {
                return res.status(400).json({ success, error: "Check over your credentials again" });
            }
    
            const passwordCompare = await bcrypt.compare(oldpassword, user.password);


        if(!passwordCompare){
            return res.status(400).json({success, error :"Incorrect Password Entered"});
        }
        const salt =await bcrypt.genSalt(10);
        const secPass =await bcrypt.hash(newpassword, salt);

        const updInfo = {};
        if(newpassword){updInfo.password = secPass;}
        success = true;
        const user_upd = await User.findByIdAndUpdate(userId, {$set : updInfo},{new : true});
        res.json({ success, user_upd });
    }catch(err){
        console.error(err);
        res.status(500).send("INTERNAL SERVER ERROR : Some error occured");
    }
});

module.exports = router;