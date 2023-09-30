const Section=require('../models/Section')
const Course=require('../models/Course')
exports.createSection=async(req, res)=>
{
    try
    {
      const {sectionName, courseId}=req.body;
      if(!sectionName || !courseId)
      {
        return res.status(400).json({
            success: false,
            message:"all fields are required"
        }) 
      }
      const newSection=await Section.create({sectionName})
      const updatedCourse=await Course.findByIdAndUpdate({courseId},
        {
            $push: 
            {
                courseContent:newSection._id
            }
        },
        {
            new: true
        })


        
        return res.status(200).json({
            success: true,
            message:"section created successfully",
            updatedCourse
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


exports.updateSection=async(req, res)=>
{
    try
    {
      const {sectionName, sectionId}=req.body;
      if(!sectionName || !sectionId)
      {
        return res.status(400).json({
            success: false,
            message:"all fields are required"
        }) 
      }
      const section=await Section.findByIdAndUpdate(sectionId,
        {
            sectionName        },
            {
                new: true
            })
    return res.status(200).json({
                success: true,
                message:"section updated successfully",
                updatedCourse
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

exports.deleteSection= async(req, res)=>
{
    try
    {
        const {sectionId}=req.params
        await Section.findByIdAndDelete(sectionId);
        return res.status(200).json({
            success: true,
            message: "succesfully delete"
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