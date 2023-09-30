const Tag=require("../models/Tag");
exports.createTag=async (req, res)=>
{
    try
    {
    const {name, description}= req.body;
    if(!name || !description)
    {
        return res.status(400).json({
            success: true,
            message: "all fields are required"
        })
    }
        const tagDetails=await Tag.create({
            name: name,
            description: description
        })
        console.log(tagDetails)
        return res.status(200).json({
            success: true,
            tagDetails
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


exports.getAllTags=async(req, res)=>
{
    try
    {
     const getalldetails=await Tag.find({},
        {
            name: true,
            description: true
        })
        return res.status(200).json({
            success: true,
            message: "All tags returs",
            getalldetails
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