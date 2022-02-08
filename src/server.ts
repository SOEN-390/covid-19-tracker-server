import 'reflect-metadata';
import express from 'express'
import config from './config';
import routes from './api/routes';
import db from './config/db'

const admin = require('firebase-admin');

function startServer() {
    const app = express();
    const PORT = 8080

    require('dotenv').config();

    app.use(express.json());


    app.get('/', (req, res) => {
        res.send('Welcome to the COVID-19 Tracker App Server')
    });

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    });

    app.use(config.api.prefix + config.api.version, routes());

    db();

    admin.initializeApp({
        credential: admin.credential.cert({
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
    });
}

startServer();
