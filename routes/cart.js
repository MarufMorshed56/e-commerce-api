const  router = require('express').Router()

const Cart = require('../models/Cart')
const { route } = require('./auth')
// const CryptoJS = require('crypto-js')

const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')

//CREATE NEW CART

router.post('/', verifyToken, async(req,res)=>{
          try {     
                    const newCart = new Cart(req.body)
                    const savedCart= await newCart.save();
                    res.status(200).json(savedCart)
          }catch (error) {
                    res.status(500).json(error)
          }
})

// UPDATE CART
router.put("/:id", verifyTokenAndAuthorization, async(req,res)=>{
          try {
                    const updatedCart = await Cart.findByIdAndUpdate(
                              req.params.id,{
                              $set: req.body
                              },{new:true}
                    ) 
                    res.status(200).json(updatedCart)
          } catch (error) {
                    res.status(500).json(error)
          }        
})

// DELETE CART

router.delete("/:id",verifyTokenAndAdmin, async(req,res)=>{
          try {
                    const deletedCart = await Cart.findByIdAndDelete(req.params.id) 
                    res.status(200).json("Cart has been deleted")
          } catch (error) {
                    res.status(500).json(error)
          }

})


//GET USER CART

router.get("/find/:userId", verifyTokenAndAuthorization, async(req,res)=>{
          try {
                    const Cart = await Cart.findOne({userId: req.params.userId})
                    res.status(200).json(Cart)
          } catch (error) {
                    res.status(500).json(error)
          }

})

// GET ALL 

router.get("/", verifyTokenAndAdmin, async(req,res)=>{
          try {
                    const allCart = await Cart.find()
                    res.status(200).json(allCart)
          } catch (error) {
                    res.status(500).json(error) 
          }
})


module.exports = router