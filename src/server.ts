import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import config from './config';
import routes from './api/routes';
import db from './config/db';
import cors from 'cors';
import bodyParser from 'body-parser';

const admin = require('firebase-admin');

function startServer() {
	const app = express();
	const PORT = 8080;

	dotenv.config({path: process.env.CONFIG_PATH});

	app.use(cors());

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));

	app.get('/', (req, res) => {
		res.send('Welcome to the COVID-19 Tracker App Server');
	});

	app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	});

	app.use(config.api.prefix + config.api.version, routes());

	db();

	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
		})
	});
}

startServer();
