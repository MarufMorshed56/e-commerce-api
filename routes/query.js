const  router = require('express').Router()

const Product = require('../models/Product')

const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')

router.get('/',async(req,res)=>{
          const queryname = req.query.name;
          const search = req.params.id
          try{
                    const  products =  await Product.find()
                    //let sortedProducts = [...products]
                    
                    let sortedProducts = products.filter((product)=>{
                              return product.title.includes(queryname)
                    })
                    
                    res.status(200).json(sortedProducts)

          }catch(error){
                    res.status(500).json(error)
          }
})

module.exports = router