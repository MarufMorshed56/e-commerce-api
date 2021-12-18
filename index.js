const express = require("express")
const app = express()

const connectDB = require('./ConnectDB/connect')
require('dotenv').config()

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const stripeRoute = require('./routes/stripe')
const queryRoute = require('./routes/query')

const cors = require("cors");
// const router = require('./routes/router')

app.use(cors())
app.use(express.json())
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/user", userRoute)
app.use("/api/v1/products", productRoute)
app.use("/api/v1/cart", cartRoute)
app.use("/api/v1/order", orderRoute)
app.use("/api/v1/checkout", stripeRoute)
app.use("/api/v1/query", queryRoute)



const port = process.env.PORT || 5000
const start = async()=>{
          try {     
                    await connectDB(process.env.MONGO_URI, console.log('connected to Database'))
                    app.listen(port, console.log(`server listening to port ${port}`))
          } catch (error) {
                    console.log(error)
          }
}

start()