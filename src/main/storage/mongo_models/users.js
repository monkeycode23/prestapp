
const mongoose = require("mongoose")
const  bcrypt= require('bcrypt')

const userSchema = new mongoose.Schema({
    sqlite_id:Number,
    username: String,
    email: String,
    password: String,
    avatar:String,
    number: String,
    address: String,
    role:{
      type:String,
      enum:["ADMIN","MOD","USER"]  
    },
    city: String,
    state: String,
    zip: String,
    country: String,
    isAdmin: Boolean,
    isActive: Boolean,
    isDeleted: Boolean,
    isBanned: Boolean,
    isVerified: Boolean,
    isEmailVerified: Boolean,
    isPhoneVerified: Boolean,
    isGoogle: Boolean,
    isFacebook: Boolean,
    
})  


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports= User