import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:['succeeded', 'failed']
    }
},
{timestamps:true}
);
const Donation = mongoose.model('Donation', donationSchema);

export default Donation;