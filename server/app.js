const express = require('express')
const app = express()
const cors  = require('cors')
const audioToVideoController = require('./controllers/audioToVideoController')
const aiController = require('./controllers/aiController')

app.use(express.json())
app.use(cors())


app.get('/', (req,res)=>{
    res.send('Welcome to your View Your Lyrics App!')
})

app.use('/ai', aiController)
// app.use('/videoconverter', audioToVideoController)


app.get("*", (req,res)=>{
    res.status(404).json({error: "Path not found"})
})

module.exports = app;