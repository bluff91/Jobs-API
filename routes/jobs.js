const express = require('express')
const router = express.Router()

const { getAllJobs,
        getJob,
        postJob,
        updateJob,
        deleteJob,} = require('../controllers/jobs')

router.get('/', getAllJobs)
router.post('/', postJob)
router.get('/:id', getJob)
router.patch('/:id', updateJob)
router.delete('/:id', deleteJob)


module.exports = router

