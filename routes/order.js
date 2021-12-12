const  router = require('express').Router()

const Order = require('../models/Order')
const { route } = require('./auth')
// const CryptoJS = require('crypto-js')

const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')

//CREATE NEW ORDER

router.post('/', verifyToken, async(req,res)=>{
          try {     
                    const newOrder = new Order(req.body)
                    const savedOrder= await newOrder.save();
                    res.status(200).json(savedOrder)
          }catch (error) {
                    res.status(500).json(error)
          }
})

// UPDATE ORDER
router.put("/:id", verifyTokenAndAdmin, async(req,res)=>{
          try {
                    const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
                              $set:req.body
                              },{new:true}
                    ) 
                    res.status(200).json(updatedOrder)
          } catch (error) {
                    res.status(500).json(error)
          }        
})

// DELETE ORDER

router.delete("/:id",verifyTokenAndAdmin, async(req,res)=>{
          try {
                    const deletedOrder = await Order.findByIdAndDelete(req.params.id) 
                    res.status(200).json("Order has been deleted")
          } catch (error) {
                    res.status(500).json(error)
          }

})


//GET A USER'S ALL ORDERS

router.get("/find/:userId", verifyTokenAndAuthorization, async(req,res)=>{
          try {
                    const Orders = await Order.find({userId: req.params.userId})
                    res.status(200).json(Orders)
          } catch (error) {
                    res.status(500).json(error)
          }

})

// GET ALL 

router.get("/", verifyTokenAndAdmin, async(req,res)=>{
          try {
                    const allOrder = await Order.find()
                    res.status(200).json(allOrder)
          } catch (error) {
                    res.status(500).json(error) 
          }
})

//GET MONTHLY INCOME

router.get('/income', verifyTokenAndAdmin, async(req,res)=>{
          const date = new Date();
          const lastYear =new Date(date.setFullYear(date.getFullYear -1));

          try {
                    const income = await (await Order).aggregate([
                    {
                    $match:{
                              createdAt:{
                                        $gte: lastYear
                                        },         
                              }
                    },
                    {
                    $project:{
                              month:{
                                        $month:"$createdAt"
                                        },
                              sales: "$amount",
                              }          
                    },
                    {
                    $group:{
                              _id:"$month",
                              total:{$sum:"$sales"}
                              }
                    }
                    ])
                    res.status(200).json(income)
          } catch (error) {
                    res.status(500).json(error)
          }
})

module.exports = router