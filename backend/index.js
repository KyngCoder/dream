const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

//routes
const postRoutes = require('./routes/post.js')
const userRoutes = require('./routes/user.js')

//middleware
app.use(cors())
app.use(express.json())
// app.use(bodyParser.json({limit:"30mb",extended:true}))
// app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))

app.use('/posts',postRoutes)
app.use('/users',userRoutes)

const PORT = 8000
const MONGO_URL = 'mongodb+srv://rick:rick@cluster0.93dss.mongodb.net/Cluster0?retryWrites=true&w=majority'

mongoose.connect(MONGO_URL,)
.then(()=>app.listen(PORT,()=>console.log('server started on port ' + PORT)))
.catch((error)=> console.log(error))