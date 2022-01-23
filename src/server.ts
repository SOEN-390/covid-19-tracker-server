import express from 'express'

const app = express()
const PORT = 8080

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to the COVID-19 Tracker App Server')
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})