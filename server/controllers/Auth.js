const User=require("../models/User");
const Otp=require("../models/Otp");
const otpgenerator=require('otp-generator')
const bcrypt=require('bcrypt')
const jwt=requie('jsonwebtoken')
require("dotenv").config();

// send otp
exports.sendOtp=async(req, res)=>
{
    try{
    const { email }=req.body;

    const checkUserPresemt=await User.findOne({email});
    if(checkUserPresemt)
    {
        return res.status(401).josn({
            success: false,
            message: "user already exits"
        })
    }
    var otp=otpgenerator.generate(6,{
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })
    console.log(otp)
    let result=await Otp.findone({otp:otp});
    while(result)
    {
        otp=otpgenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        result=await Otp.findone({otp:otp});
    }
    const otpPayload={email,otp};
    const optBody=await Otp.create(otpPayload);
    console.log(optBody)
    res.status(200).json({
        success: true,
        message:'OTP successfully send',
        otp,
    })

}
catch(error)
{

    console.log(error)
    return res.status(500).json({
        success: false,
        message: error.message

    })
}
}








// signup

exports.signup=async (req,res)=>
{
    try
    {
    const { firstName, lastName, email, password, confirmPassword, accountType,contactNo,otp}=req.body;
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp)
    {
        return res.status(403).json({
            success: false,
            message: "All fields are required"
        })
    }
    if(password!== comfirmpassword)
    {
        return res.status(403).json({
            success: false,
            message: "password and confirm password value does not match please try again"
        })
    }
    const exist=await User.findOne({email})
    if(exist)
    {
        return res.status(403).json({
            success: false,
            message: "user already exits"
        }) 
    }
    const recentOtp=await Otp.findOne({email}).sort
    ({createdAt:-1}).limit(1);
    console.log(recentOtp);
    if(recentOtp.length==0)
    {
        return res.status(403).json({
            success: false,
            message: "opt not found"
        }) 
    }
    else if (otp!==recentOtp.otp)
    {
        return res.status(403).json({
            success: false,
            message: "invalid otp"
        })    
    }
    const heahedPassword=await bcrypt.hash(password, 10)

    const profileDetails=await Profiler.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null
    })
    const user=await User.create({firstName, lastName, 
        email, password:heahedPassword, accountType,additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initails/svg?seed=${firstName} ${lastName}`})
return res.status(200).json({
    success: true,
    message: "user is registered succsefully",
    user

})
}
catch(error)
{
    return res.status(500).json({
        success: false,
        message: "user cannot be registered succsefully",
      
    
    })
}
}
exports.login=async(req, res)=>
{
    try
    {
        const {email, password}=req.body;
        if(!email|| !password)
        {
            return res.status(403).json({
                success: false,
                message: "all fields are required",
              
            
            })
        }
        const user=await User.findOne({email}).populate("additionalDetails")
        if(!user)
        {
            return res.status(401).json({
                success: false,
                message: "user id not registerd",
              
            
            }) 
        }

        if(await bcrypt.compare(password,user.password))
        {
            const payload={email:user.email,
            id:user._id,
            accountType:user.accountType,
        }
     const token=jwt.sign(payload,process.env.JWT_SECRET,
        {
            expiresIn:"2h",
        })
        user.token=token;
        user.password= undefined;
        const options={
            expires:new Date(Date.now + 3*24*60*60*1000),
            httpOnly: true
        }
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message:'logged in succesfully'
        })
        }
        else
        {
            return res.status(401).json({
                success: false,
                message: "password is incorrent"
            })
        }
    }
    catch(error)
    {
       console.log(error);
       return res.status(500).json({
        success: false,
        message: "password is incorrent"
    })
    }
}



exports.changePassword=async(req,res)=>
{
    
    const userDetails=User.findById(req.user.id)
    const {oldpassword, newpassword}=req.body
    const ispasswordmatch=await bcrypt.compare(oldpassword,
        user)
// {User.validate

// get data from req,
// get oldpassword newpassword confirm password
// va;iadtion
// update pwd in db;
// send mail -password updated
// return response

}