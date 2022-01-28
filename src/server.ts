import express from 'express'

const app = express()
const PORT = 8080

require('dotenv').config()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to the COVID-19 Tracker App Server')
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});

const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT
});

connection.connect((err: Error) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database.');
});

connection.end();