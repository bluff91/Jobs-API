const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const error = require('../errors')

// - Validate - email, password - in controller
// - If email or password is missing, throw BadRequestError
// - Find User
// - Compare Passwords
// - If no user or password does not match, throw UnauthenticatedError
// - If correct, generate Token
// - Send Response with Token

const userLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new error.BadRequestError("Please provide an email and password")
    }
    const user = await User.findOne({email})
    if (!user) {
        throw new error.UnauthenticatedError("No user with this email address")
    }
    const checkPassword = await user.comparePasswords(password)
    if (!checkPassword) {
        throw new error.UnauthenticatedError("Password is incorect")
    }
    const token = user.generateToken()
    res.status(StatusCodes.OK).json({userID: user._id, name: user.name, email, token})
}

const userRegistration = async (req, res) => {
    const user = await User.create(req.body)
    const token = user.generateToken()
    res.status(StatusCodes.OK).json({userID: user._id, name: user.name, token})
}

module.exports = {
    userLogin, userRegistration
}