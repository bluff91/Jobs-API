const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        minlength: 3,
    },
    email: {
        type: String,
        minlength: 6,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ,"Please provide a valid email"],
        unique:true,
        required:[true, "Please provide an email"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        maxlength: 50,
    }
})

UserSchema.pre('save', async function(next) {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
})

UserSchema.methods.generateToken = function() {
    return jwt.sign({name:this.name, userID: this._id}, process.env.SECRET, {expiresIn: process.env.TOKEN_VALIDITY})
}

UserSchema.methods.comparePasswords = async function(candidatePassword) {
    const isMatch = await bcryptjs.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model("User", UserSchema)