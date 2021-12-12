const  router = require('express').Router()

const User = require('../models/User')
const CryptoJS = require('crypto-js')

const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')

router.put("/:id", verifyTokenAndAuthorization, async(req,res)=>{
          if(req.body.password){
                    req.body.password =CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SECRET).toString()
          }
          try {
                    const updatedUser = await User.findByIdAndUpdate(
                              req.params.id,{
                              $set: req.body
                              },{new:true}
                    ) 
                    res.status(200).json(updatedUser)
          } catch (error) {
                    res.status(500).json(error)
          }

          
})

//DELETE USER

router.delete("/:id",verifyTokenAndAuthorization, async(req,res)=>{
          try {
                    const deletedUser = await User.findByIdAndDelete(req.params.id) 
                    res.status(200).json("user has been deleted")
          } catch (error) {
                    res.status(500).json(error)
          }

})
//GET SINGLE USER
router.get("/find/:id",verifyTokenAndAdmin, async(req,res)=>{
          try {
                    const user = await User.findById(req.params.id)
                    const {password, ...others} = user._doc
                    res.status(200).json(others)
          } catch (error) {
                    res.status(500).json(error)
          }

})

//GET ALL USERS

router.get("/",verifyTokenAndAdmin, async(req,res)=>{
          const query = req.query.new;
          try {
                    const users = query? await User.find().sort({ _id: -1 }).limit(5):await User.find();

                    res.status(200).json(users)
          } catch (error) {
                    res.status(500).json(error)
          }

})

//GET USER STATS  // GET USER STATS per month. meaning  how many new users registered per month

          router.get("/stats", verifyTokenAndAdmin, async (req,res) => {
          const date = new Date();
          const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

          try {
          const data = await User.aggregate([ //see MongoDB aggregation Documentation
          {
                    $match:{ 
                              createdAt: { $gte: lastYear } } // takes all the user who registered after this day on last year & passes the grouped vlaues to '$project'
          },
          {
                    $project: {
                              month: { $month: "$createdAt" }, // inside part of {} -> '$month' takes the month no. values of each user from their "createdAt" field & stores it in 'month', & then thi field is passed on to '$group'
                    },
          },
          {
                    $group: {// '$group' will group all the users based on the parameters which here is  _id
                              _id: "$month", // all the users created in the same month will have the same id, i.e. for september it will be 9
                              total: { $sum: 1 }, //'$sum: 1' will sum the number of users's with same'_id' & stores it in total, thus  '$group' will group the users based on the months they were created & show the tottal number of users per/each month..
                    },
          },
          ]);
                    res.status(200).json(data)
          } catch (err) {
          res.status(500).json(err);
          }
          });

module.exports = router