import User from "../Models/User";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";
import cors from 'cors';
dotenv.config();

var checkOTP;
var checkEmail;
var LoginEmail;
export const getAllUsers = async(req,res,next)=>{
    let users;
    try{
        users = await User.find();
    }
    catch(err)
    {
        console.log(err);
    }
    if(!users)
    {
        return res.staus(404).json({message:"No Users Found!"});
    }
    return res.status(200).json({users});
}
 
export const signup = async(req,res,next)=>{
    console.log(req.body);
    const { password,showPassword,email,userName } = req.body;
    LoginEmail = {email};
    let existingUser;
    try{
     existingUser = await User.findOne({email});
    }
    catch(err)
    {
        console.log(err);
    }
    if(existingUser)
    {
        return res.status(400).json({message:"User already Exist! Login Instead."});
    }
     const hashedpassword = bcrypt.hashSync(password);
    const newUser = new User({
        userName,
        email,
        password:hashedpassword,
    })
    try{
        await newUser.save();
    }
    catch(err)
    {
        console.log(err);
    }
    return res.status(202).json({newUser})   
}

export const login = async(req,res,next)=>{
    const {email,password} = req.body;
    LoginEmail = {email};
    console.log(LoginEmail);
    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }
    catch(err)
    {
        console.log(err);
    }
    if(!existingUser)
    {
        return res.status(404).json({message:"No user Found!"});
    }
    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
    if(!isPasswordCorrect)
    {
        return res.status(404).json({message:"Incorrect Password"})
    }
    return res.status(200).json({existingUser})
}

export const forgetpassword = async(req,res,next)=>{ 
  const {email}= req.body;
  checkEmail = email;
  console.log(checkEmail);
  let existingUser;
  try{
    existingUser = await User.findOne({email});
  }   
  catch(err)
  {
    console.log(err);
  }
  if(!existingUser)
  {
    return res.status(404).json({message:"No email found"});
  }
  var otp1 = Math. floor(100000 + Math. random() * 900000);
  checkOTP = otp1;
  console.log(checkOTP);
  const mailTransporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'srkriste2022@gmail.com',
        pass:'ntnbsvawrstwulco'
    }
  })

  let details = {
    from:"srkriste2022@gmail.com",
    to:existingUser.email,
    subject:"Message from SRKRISTE",
    text:`Your One Time Password : ${otp1}, Dont share with any one.`
  }
  
  mailTransporter.sendMail(details,err=>{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("Email Sent Successfully!");
    }
  })
  
}
export const OTP = async(req,res,next)=>{
    const {otp} = req.body;
    console.log(otp);
    if(otp == checkOTP)
    {
        return res.status(200).json({message:"OTP is Successfull"});
    }
    else{
        return res.status(404).json({message:"Invalid OTP!"});
    }
}

export const NewPassword = async(req,res,next)=>{
    const {password} = req.body;
    const hashedpassword = bcrypt.hashSync(password);
    let existingUser;
    try{
        existingUser= await User.findOneAndUpdate({email:checkEmail},{$set:{password:hashedpassword}})
        User.save();
    }
    catch(err)
    {
        console.log(err);
    }
    console.log(existingUser);
    if(!existingUser)
    {
        return res.status(404).json({message:"Unable to Change!"});
    }
    return res.status(200).json({message:"Details Updated!"});
}

 const Storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    },
 });

 const upload = multer({
    storage:Storage
 }).single('profile')

 
export const ImageUpload = async(req,res,next)=>{
   const Image = {
    data:req.file.filename,
    contentType:"image/png",
   }
    let existingUser;
    try
    {
        existingUser = await User.findOneAndUpdate({email:LoginEmail},{$set:{ProfileImage:Image}})
        User.save();
    }
    catch(err)
    {
        console.log(err);
    }
    if(!existingUser)
    {
        return res.status(404).json({message:"Unable to Change!"});
    }
    return res.status(200).json({message:"Details Updated!"});

}

export const GetDetails = async(req,res,next)=>{
    let existingUser;
    try
    {
        existingUser = await User.findOne(LoginEmail);
    }
    catch(err)
    {
        console.log(err)
    }
    if(!existingUser)
    {
        return res.status(404).json({message:"Unable to Fetch Details"});
    }
    console.log(existingUser)
    return res.status(200).json(existingUser);
    
}