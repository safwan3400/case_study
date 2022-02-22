
const express = require('express')
const app = express()
const cors = require('cors')

const careerRouter = require('./routes/careerRouter')

app.use(express.json({limit: '25mb'}))
app.use(express.urlencoded({ limit: "25mb", extended: true }))
app.use(cors());
app.use(express.static('public'))

app.use('/api', careerRouter);

app.get('*', (req, res) => {
    res.status(501).json({ status: 501, err: 'invalid' })
})

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`server listened to port ${PORT}`);
})
