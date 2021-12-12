const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
          username:{
                    type: String,
                    required:[true,'must provide a Username'],
                    unique:[true,'Username already exists']
          }, 
          email:{
                    type:String,
                    required:[true,'must provide Email'],
                    unique:[true,'Id with this Email already exist']
          },
          password:{
                    type:String,
                    required:true
          },
          isAdmin:{
                    type:Boolean,
                    default:false,
          },
          
},{timestamps:true}//this is a mongoose built in function which adds createdAt & updatedAt timestamps
)

module.exports = mongoose.model('User', UserSchema)