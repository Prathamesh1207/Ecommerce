const Product =require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

//create product --admin
exports.createProduct= catchAsyncErrors(async(req,res,next)=>{

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
    req.body.images = imagesLinks;

    req.body.user = req.user.id
    const product =await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
})

//get all product
exports.getAllProducts = catchAsyncErrors(async(req,res,next)=>{
    const resultPerPage=8;
    const productsCount=await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);

    // let products = await apiFeature.query;
    // let filteredProductsCount = products.length;
    // apiFeature.pagination(resultPerPage);

    const products =await apiFeature.query;
    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage,
        // filteredProductsCount
    })
})

//update product --admin
exports.updateProduct= catchAsyncErrors(async(req,res,next)=>{
    let product =await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }


  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }    



    product = await Product.findByIdAndUpdate(req.params.id , req.body , {
        new:true,
        runValidators:true
        ,useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })

})

//delete Product
exports.deleteProduct= catchAsyncErrors(async(req,res,next)=>{
    const product= await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    }
    //deleting from cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }



    // await product.remove();
    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
})

////get product details
exports.getProductDetails= catchAsyncErrors(async(req,res,next)=>{
    const product= await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    }



    res.status(200).json({
        success:true,
        product
    })
})

//create new review or update review
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{
    const {rating , comment , productId} = req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev=>rev.user.toString()===req.user._id.toString());

    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString())
            rev.rating=rating,
            rev.comment=comment
        })
    }else{
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length

    }
    let average=0;

    product.reviews.forEach(rev=>{
        average+=rev.rating;
    });
    product.ratings = average/product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success:true
    })

})

//get all reviews of single product
exports.getProductReviews =catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    if(!product){
         return next(new ErrorHandler("Product not Found",404));
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews,
    })
})

//delete review
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
        const product = await Product.findById(req.query.productId);
    if(!product){
         return next(new ErrorHandler("Product not Found",404));
    }

    const reviews = product.reviews.filter(revi=>revi._id.toString() !== req.query.id.toString());

    let average=0;

    reviews.forEach(rev=>{
        average+=rev.rating;
    });
    const ratings = average/reviews.length;
    const numOfReviews =reviews.length;

    await Product.findByIdAndUpdate(req.query.productId , {reviews,ratings,numOfReviews},{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });


    res.status(200).json({
    success:true,
    reviews: product.reviews,
    })
})


//getAllProduct --admin
exports.getAdminProducts = catchAsyncErrors(async(req,res,next)=>{

    const products = await Product.find();

    res.status(200).json({
        success:true,
        products,
    })
})