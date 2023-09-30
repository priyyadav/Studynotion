const Profile=require('../models/Profile');
const User=require('../models/User')
 exports.updateProfile=async(req, res)=>
 {
  try
  {
  const { dateOfBirth="", about="", contactNo,gender}=req.body
  const id=req.user.id;
  if( ! contactNo || !gender)
  {
    return res.status(400).json({
        success: false,
        message: "all fields are required"
    }) 
  }
  const userDetails=await User.findById(id)
  const profileId=userDetails.additionalDetails;
  const profileDetails=await Profile.findById(profileId)
  profileDetails.dateOfBirth=dateOfBirth
  profileDetails.about= about
  profileDetails.gender= gender
  profileDetails.contactNumber= contactNo
  await profileDetails.save();
  return res.status(200).json({
    success: true,
    message: "profile updated successfukky"
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

exports.deleteAccount=async(req, res)=>
{
    try
    {
     const id=req.user.id
     const userDetails=await User.findById(id);
     if(!userDetails)
     {
        return res.status(404).json({
            success: false,
            message: "user is not found"
        })
     }
     await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
     await user.findByIdAndDelete({_id:id})
     return res.status(200).json({
        success: succes,
        message: "user is deleted succesfulyy"
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