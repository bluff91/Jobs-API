const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const getAllJobs = async (req, res) => {
    
    const jobs = await Job.find({createdBy: req.user.userID}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count:jobs.length})
}

const getJob = async (req, res) => {
    const {id: jobID} = req.params
    const {userID:userID} = req.user
    const job = await Job.findOne({
        _id:jobID,
        createdBy:userID
    })
    if (!job) {
        throw new NotFoundError(`Job not found for user ${userID}`)
    }

    res.status(StatusCodes.OK).json({jobDetails:job, createdBy:userID})
}

const postJob = async (req, res) => {
    req.body.createdBy = req.user.userID
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json(job)   
}

const updateJob = async (req, res) => {
    // const { id:jobID } = req.params
    // const { userID } = req.user
    // const {company, position} = req.body
    const {
        body: { company, position },
        params: { id:jobID },
        user: {userID}
    } = req
    if (company === "" || position === "") {
        throw new BadRequestError("Please provide company and position")
    }
    const job = await Job.findOneAndUpdate({_id:jobID, createdBy:userID}, req.body, {new:true})
    if (!job) {
        throw new NotFoundError(`Job not found for user ${userID}`)
    }
    res.status(StatusCodes.OK).json({updatedJob: {job}, userID})  
}

const deleteJob = async (req, res) => {
    const { id:jobID } = req.params
    const { userID } = req.user
    const job = await Job.findOneAndDelete({
        _id:jobID,
        createdBy: userID
    })
    if (!job) {
        throw new NotFoundError(`Job not found for user ${userID}`)
    }
    res.status(StatusCodes.OK).json({deletedJob: job})
}



module.exports = {
    getAllJobs,
    getJob,
    postJob,
    updateJob,
    deleteJob,
}