const User = require('../models/User');
const user=require('../models/User')
const mailSender=require("../utils/mailSender")
const bcrypt=require('bcrypt')

exports.resetPasswordToken = async(req, res)=>
{
    try
    {
    const {email}=req.body.email;
    const user=await User.findOne({email: email})
    if(!user)
    {
        return res.status(401).json({
            success: false,
            message: "email is not registered"
        })
    }
  const token=crypto.randomUUID();
  const updatedDetials=await User.finsOneAndUpdate(
    {email: email},
    {
        token: token,
        resetPasswordExpires:Date.now()+5*60*1000,
    },
    {
        new: true
    }
  );
    const url=`http://localhost:3000/update-password/${token}`
    await mailSender(email, "password reset link", `Password reset Link: ${url}`)
    return res.status(200).json({
        success: true,
        message: "email sent succesfully"
    })
}
catch(error)
{
    return res.status(500).json({
        success: true,
        message: "smoething went wrong while reset passowrd"})
}
}

exports.resetPassword=async(req, res)=>
{
    try
    {
const {password, confirmPassword, token}=req.body;
if(password !== confirmPassword)
{
    return res.status(401).json({
        success: false,
        message: "password is not matching"})
}
const userDetails=await User.findOne({token: token});
if(!userDetails)
{
    return res.status(401).json({
        success: false,
        message: "token is in valid"})
}
if(userDetails.resetPasswordExpires<Date.now())
{
    return res.status(401).json({
        success: false,
        message: "token is expired"})
}
const hashedPassword=await bcrypt.hash(password, 10)
await User.findOneAndUpdate({
    token: token
},
{
    password:hashedPassword
},
{
    new: true
})
return res.status(200).json({
    success: true,
    message: "password reset successfully"})
}
catch(error)
{
    return res.status(500).json({
        success: false,
        message: "something when wrong while reset password"})
}
}
