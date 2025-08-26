import express from 'express'

const app = express()

const PORT = process.env.server || 3000;

app.get('/', (req, res) => {
    res.send('Hello Express from Render')
})

app.listen(3000)