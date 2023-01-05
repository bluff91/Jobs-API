const { UnauthenticatedError } = require('../errors')
const User = require('../models/User')
const jwt = require('jsonwebtoken')


const userAuthentification = async function(req, res, next) {
   const header = req.headers.authorization

   if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Bad credentials")
   }

   const token = header.split(" ")[1]
   try {
    const payload = jwt.verify(token, process.env.SECRET)
    // attach the payload to the user
    
    // const user = await User.findOne(payload.id).select("-password")
    // req.user = user
     req.user = {userID: payload.userID, name:payload.name}
    next()
   } catch (error) {
   throw new UnauthenticatedError("Bad credentials")
   }
}

module.exports = userAuthentification











module.exports = userAuthentification