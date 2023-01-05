require('dotenv').config()
require('express-async-errors')

//extra security
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const connectDB = require('./db/connect')
const express = require('express');
const app = express();
const userRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const userAuth = require('./middleware/authentication')

//swagger
const swaggerUI = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocument = yaml.load('./swagger.yaml')


const mongoose = require('mongoose')
const connectDB2 = (url) => { 
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})}


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxi', 1)
app.use(
  rateLimiter({
    windowMS: 15*60*1000,
    max: 100 
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

app.get("/", (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
})
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))
// routes 
app.use('/api/v1/auth', userRouter)
app.use('/api/v1/jobs', userAuth, jobsRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB2(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
