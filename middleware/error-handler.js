 const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //status codes
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later"
  }

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  if (err.code === 11000) {
    customError.statusCode = 400
    customError.msg = `${Object.keys(err.keyValue)} is already in use`
    console.log(Object.keys(err.keyValue))
  }

  if (err.name === 'CastError') {
    customError.statusCode = 404
    customError.msg = `id number ${err.value} is not a valid id`
  }

  if (err.name === 'ValidationError') {
    customError.statusCode = 400
    customError.msg = Object.values(err.errors).map(item => item.message).join(' ,')
  }

  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = errorHandlerMiddleware
