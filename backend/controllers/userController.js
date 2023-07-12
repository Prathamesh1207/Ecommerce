const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken=require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto =require("crypto");

//register user
// exports.registerUser =catchAsyncErrors( async(req,res,next)=>{
//     const {name,email,password} = req.body;

//     const user=await User.create({
//         name,email,password,
//         avatar:{
//             public_id:"this is sample public id",
//             url:"ProfilePicURL"
//         }
//     });
//     // const token= user.getJWTToken();
//     // res.status(201).json({
//     //     success:true,
//     //     token,
//     // })
//     sendToken(user,201,res);

// })

//login user
// exports.loginUser = catchAsyncErrors( async(req,res,next)=>{

//     const {email,password} =req.body;
//     //checking if user  has given email ans password both
//     if(!email || !password){
//         return next(new ErrorHandler("Please Enter Email and Password",400))
//     }

//     const user=await User.findOne({email}).select("+password");
//     if(!user){
//         return next(new ErrorHandler("Invalid email or Password",401));
//     }

//     const isPasswordMatched = user.comparePassword(password);
//     if(!isPasswordMatched){
//         return next(new ErrorHandler("Invalid email or Password",401));
//     }
//     //password match
//     // const token= user.getJWTToken();
//     // res.status(200).json({
//     //     success:true,
//     //     token,
//     // })
//     sendToken(user,200,res);


// })


exports.registerUser = catchAsyncErrors(async (req, res, next) => {
//   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//     folder: "avatars",
//     width: 150,
//     crop: "scale",
//   });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample public idddd",
      url: "sample pic url",
    },
  });

  sendToken(user, 201, res);
});


exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});


//logout user
exports.logoutUser = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true,
    })


    res.status(200).json({
        success:"true",
        message:"Logged Out"
    })
})

//forgot password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404))
    }

    //get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false})

    // console.log("reset tokennnnn",resetToken);


    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }


})

//reset password
exports.resetPassword=catchAsyncErrors(async (req,res,next)=>{
    const resetPasswordToken= crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user =await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt:Date.now()},
    })

    if(!user){
        return next(new ErrorHandler("Reset Password token is expired or invalid",404))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password=req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);
})

//get user detail
exports.getUserDetails =catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success:true,
        user
    })
})

//update user password
exports.updatePassword =catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("old password is incorrect",400))
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password=req.body.newPassword;
    await user.save();
    
    sendToken(user,200,res);
})

//update user profile
exports.updateProfile =catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }
    //add avatar later

    const user=await User.findByIdAndUpdate(req.user.id , newUserData , {
        new:true,
        runValidators:true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success:true,
    })

    // sendToken(user,200,res);
})

//get all users
exports.getAllUsers =catchAsyncErrors(async(req,res,next)=>{
    const users =await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

//get singlr user (admin)
exports.getSingleUser =catchAsyncErrors(async(req,res,next)=>{
    const user =await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exits with id : ${req.params.id} `));
    }

    res.status(200).json({
        success:true,
        user
    })
})

//update user role --admin
exports.updateUserRole =catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user=await User.findByIdAndUpdate(req.user.id , newUserData , {
        new:true,
        runValidators:true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success:true,
    })

    // sendToken(user,200,res);
})

//Delete user --admin
exports.deleteUser =catchAsyncErrors(async(req,res,next)=>{

    //we will remove cloudinary avatar later

    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exit with id: $(req.params.id)`))
    }

    await user.deleteOne();

    res.status(200).json({
        success:true,
        message:"User deleted Successfully"
    })

    // sendToken(user,200,res);
})