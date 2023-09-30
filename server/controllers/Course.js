const Course = require("../models/Course")
const Cousre=require("../models/Course")
const Tag=require("../models/Tag")
const User=requie("../models/User")
const {uploadImageCloudinary}=require("../utils/imageUploader")
exports.createCourse=async(req, res)=>
{
    try
    {
    
        const { courseName, courseDescription, whatYouWillLearn, price, tag}= req.body;
        const thumbnail=req.files.thumbnailImage;

        //  validation

        if(!courseName || ! courseDescription || whatYouWillLearn || price|| tag || thumbnail)
        {
            return res.status(400).json({
                success: false,
                message: "all fields are required"})
        }

         const userId=req.user.id;
         const instructorDetails=await User.findById(userId);
         console.log(instructorDetails)
         if(!instructorDetails)
         {
            return res.status(400).json({
                success: false,
                message: "instructor details not found"})
         }

         const tagDetails=await Tag.findById(tag)
         if(!tagDetails)
         {
            return res.status(400).json({
                success: false,
                message: "tag details not found"})  
         }

         const thumbnailImage=await uploadImageCloudinary(thumbnail, process.env.FOLDER_NAME);
         const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail:thumbnailImage
         })


         await User.findByIdAndUpdate(
            {
                _id: instructorDetails._id
            },
            {
                $push:
                {
                    courses:newCourse._id
                }
            },
            {
                new: true
            })

            return res.status(200).json({
                success: true,
                message: "course created successfully",
            data: newCourse})  
    }
    catch(error)
    {

        return res.status(500).json({
            success: false,
            message: error.message
      }) 
    }
}



exports.getAllCourse=async (req, res)=>
{
    try
    {
    const allCousre=await Course.find({},
        {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled:true
            .populate("instructor")
            .exec()
        })

        
        return res.status(200).json({
            success: true,
            message: "alll courses",
        data: allCousre})  
    }
    catch(error)
    {

        return res.status(500).json({
            success: false,
            message: error.message
      }) 
    }
}