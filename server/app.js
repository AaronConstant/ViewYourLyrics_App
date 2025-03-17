const express = require('express')
const app = express()
const cors  = require('cors')
const userController = require('./controllers/usersController')

app.use(cors())
app.use(express.json())


app.get('/', (req,res)=>{
    res.send('Welcome to your View Your Lyrics App!')
})

app.use('/users', userController)

app.get("*", (req,res)=>{
    res.status(404).json({error: "Path not found"})
})

module.exports = app;