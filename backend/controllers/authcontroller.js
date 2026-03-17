import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const register = async (req , res)=>{
    try{
        const {email, masterPasswordHash}= req.body
        if (!email || !masterPasswordHash){
            return res.status(400).json({message:"Please Provide Email and Password!"})

        }
        const user = await User.findOne({email})
        if (user){
            return res.status(400).json({message:"User Already Exists!"})
        }

        const hash = await bcrypt.hash(masterPasswordHash,10)
        const newuser = new User({
            email,
            masterPasswordHash:hash
        })
        await newuser.save()
        res.status(201).json({message:"User Created Successfully"})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}