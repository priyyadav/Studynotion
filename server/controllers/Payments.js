const User=require('../models/User')
const Course=require('../models/Course')
const { instance }=require('../config/razorpay')
const mailSender=require('../utils/mailSender')
const { default: mongoose } = require('mongoose')
exports.capturePayment=async(req, res)=>
{
    try
    {
        const { course_id}=req.body
        const userId=req.user.id;
        if(!course_id){
            return res.status(401).json({
                success: false,
                message:"please provide valid course id"
          }) 
     
        }
        let course;
        course=await Course.findById(course_id);
        if(!course)
        {
            return res.status(401).json({
                success: false,
                message:"course id is not valid"
        })
    }
        const uid=new mongoose.Types.ObjectId(userId) 
        if(course.studentsEnrolled.includes(uid))
        {
            
            return res.status(401).json({
                success: false,
                message:"already enrolled"
        })
        }
          
        const amount=course.price;
        const currency="INR";
        const options={
            amount:amount*100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:
            {
                courseId:course_id,
                userId
            }
        }
           
   try
   {
    const paymentResponse=await instance.orders.create(options);
    console.log(paymentResponse)
    return res.status(100).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount:paymentResponse.amount

  })
   }

   catch(error)
   {
       
       return res.status(500).json({
           success: false,
           message: error.message
     }) 
   }   
    }
    catch(error)
    {
        
        return res.status(500).json({
            success: false,
            message: error.message
      }) 
    }
}



exports.verifiedSignature=async(req, res)=>
{
    const webHookSecret="12345678";
    const signature=req.headers["x-razorpay-signature"];
    const shasum=crypto.createHmac("sha-256",webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex")
    if(signature=digest)
    {
        console.log("payment is authorized")
        const {courseId, userId}=req.body.payload.payment.entity.notes
        try
        {
            const enrolled=await Course.findOneAndUpdate({_id:courseId},
                {
                    $push:
                    {
                        studentsEnrolled: userId
                    }
                },
                {
                    new: true
                })
            if(!enrolled)
            {
                return res.status(500).json({
                    success: false,
                    message: "course not found"
              })   
            }
            const enrolledStudent=await User.findOneAndReplace({_id: userId},
                {
                    $push:
                    {
                        course:courseId
                    }
                },
                {
                    new: true
                })
             const emailResonse=await mailSender(enrolledStudent.email,
                "congratulation","you are enrolled")
                return res.status(200).json({
                    success: true,
                    message: "signature verified and course added"
              })
        }
        catch(error)
        {
            return res.status(500).json({
                success: false,
                message: error.message
          })
        }
    }
    else
    {
        return res.status(400).json({
            success: false,
            message: "signature not matched"
      })
    }
}