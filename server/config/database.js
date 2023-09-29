const mongoose=require('mongoose');
require("dotenv").config();
exports.connect=()=>
{
    mongoose.connect(process.env.MONGDB_URL,
        {
        useNewUrlParser:true,
        useUnifiedTopology: true,
    }).then(()=>console.log("db connect succesfully"))
    .catch((error)=>
    {
        console.log("DB connection failed");
        console.error(error);
        process.exit(1);
    })
}