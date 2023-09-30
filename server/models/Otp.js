const mongoose=require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema=new mongoose.Schema({
    email:
    {
        type:String,
        required: true,
       
    },
    otp:
    {
        type:String,
        required: true,
        
    },
    createdAt:
    {
        type: Date,
        default: Date.now,
        expires: 5*60,
    }
});

async function sendVerificationEmail(email,otp)
{
    try{
        const mailResponse=await mailSender(email, "verification mail from studynotion", otp);
           console.log("email send succesfffuly")

    }
    catch(error)
    {
      console.log("error ocuured while sending mail",error.message)
      throw(error)
    }
}
otpSchema.pre("save",async function(next)
{
 await sendVerificationEmail(this.email, this.otp);
 next();
})
module.exports=mongoose.model("Otp", tagSchema);
