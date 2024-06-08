
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import Donation from "../models/donation.model.js";



const registerUser = async (req, res)=>{
    const {name, address, email, mobile, pin} = req.body;

    const userExists = await User.findOne({mobile});

    if(userExists){
        return res.status(400).json({message:'User already Exists'});
    }

    const user = await User.create({
        name,
        address,
        email,
        mobile,
        pin,
    });
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            mobile:user.mobile,
            token:generateToken(user._id)
        });
    } else {
        res.status(400).json({message:'Invalid User Data'});
    }
};

const loginUser = async (req,res)=>{
    const {mobile, pin} = req.body;

    const user = await User.findOne({mobile,pin});

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            mobile:user.mobile,
            token:generateToken(user._id)
        });
    } else {
        res.status(401).json({message:'Invalid Mobile Number or PIN'})
    }
};

const getUserProfile = async (req, res)=>{
    const user = await User.findById(req.user._id);
    if(user){
        const donations = await Donation.find({user:req.user._id}).sort({createdAt:-1});
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            mobile:user.mobile,
            donations
        });
    } else {
        res.status(404).json({message:'User not Found'});
    }
};

const updateUserProfile = async (req, res)=>{
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.address = req.body.address || user.address;
        user.email=req.body.email || user.email;
        user.pin = req.body.pin || user.pin;

        const updateUser = await user.save();

        res.status(201).json({
            _id:updateUser._id,
            name:updateUser.name,
            email:updateUser.email,
            mobile:updateUser.mobile,
            donations: await Donation.find({user:updateUser._id}).sort({createdAt:1}),
            token:generateToken(updateUser._id)
        });
    } else {
        res.status(404).json({
            message:'User not found'
        });
    }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile};

