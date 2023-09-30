const SubSection=require('../models/SubSection')
const Section=require('../models/Section');
const { uploadImageCloudinary } = require('../utils/imageUploader');
exports.createSubsection=async(req, res)=>
{
    try
    {
    const {sectionId,title, timeDuration, description}=req.body;
    const video=req.files.videoFile

    if( !sectionId|| !title || !timeDuration|| !description|| !video)
    {
        return res.status(400).json({
            success: false,
            message:"all fields are required"
        }) 
    } 
    const uploadDetails=await uploadImageCloudinary(video, process.env.FOLDER_NAME);
    const SubSectionDetails=await SubSection.create(
        {
            title: title,
            timeDuration:timeDuration,
            description: description,
            videoUrl:uploadDetails.secure_url
        }
    )
    const updatedSection=Section.findByIdAndUpdate(sectionId,
        {
            $push:
            {
                subSection: SubSectionDetails._id
            }
        },
        {
            new: true
        })

               
        return res.status(200).json({
            success: true,
            message:"subsection created successfully",
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