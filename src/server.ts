import 'reflect-metadata';
import express from 'express'
import config from './config';
import routes from './api/index';
import db from './config/db'
import cors from 'cors';
import bodyParser from "body-parser";

function startServer() {
    const app = express()
    const PORT = 8080

    require('dotenv').config()

    app.use(cors());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/', (req, res) => {
        res.send('Welcome to the COVID-19 Tracker App Server')
    });

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    });

    app.use(config.api.prefix + config.api.version, routes());

    db();
    
}

startServer();
