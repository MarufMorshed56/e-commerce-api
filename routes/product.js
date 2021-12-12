const  router = require('express').Router()

const Product = require('../models/Product')
// const CryptoJS = require('crypto-js')

const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')

//CREATE NEW PRODUCT

router.post('/', verifyTokenAndAdmin, async(req,res)=>{
          try {     
                    const newProduct = new Product(req.body)
                    const savedProduct= await newProduct.save();
                    res.status(200).json(savedProduct)
          }catch (error) {
                    res.status(500).json(error)
          }
})

// UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async(req,res)=>{
          try {
                    const updatedProduct = await Product.findByIdAndUpdate(
                              req.params.id,{
                              $set: req.body
                              },{new:true}
                    ) 
                    res.status(200).json(updatedProduct)
          } catch (error) {
                    res.status(500).json(error)
          }        
})

// DELETE PRODUCT

router.delete("/:id",verifyTokenAndAdmin, async(req,res)=>{
          try {
                    const deletedProduct = await Product.findByIdAndDelete(req.params.id) 
                    res.status(200).json("Product has been deleted")
          } catch (error) {
                    res.status(500).json(error)
          }

})


// //GET SINGLE Product

router.get("/find/:id", async(req,res)=>{
          try {
                    const product = await Product.findById(req.params.id)
                    res.status(200).json(product)
          } catch (error) {
                    res.status(500).json(error)
          }

})

//GET ALL PRODUCTS

router.get("/", async(req,res)=>{
          const queryNew = req.query.new;
          const queryCategory = req.query.category;
          try {
                    if(queryNew){
                              products = await Product.find().sort({createdAt:-1})
                    }else if(queryCategory){
                              products = await Product.find({categories:{
                              $in: [queryCategory]
                              }})
                    }else{
                              products = await Product.find() 
                    }

                    // const users = query? await User.find().sort({ _id: -1 }).limit(5):await User.find();

                    res.status(200).json(products)
          } catch (error) {
                    res.status(500).json(error)
          }

})

module.exports = router