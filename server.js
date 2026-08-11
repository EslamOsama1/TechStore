const dotenv = require('dotenv')
dotenv.config()
const app = require('./app')
const mongoose = require('mongoose')


const DB = process.env.MONGODB_URI

mongoose.connect(DB).then(() => console.log("DB connection successfully"))
    .catch(err => console.log(err))


const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`server running on port : ${PORT}`)
})