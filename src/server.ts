import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import config from './config';
import routes from './api/routes';
import db from './config/db';
import cors from 'cors';
import bodyParser from 'body-parser';
import email from './config/email';
const admin = require('firebase-admin');

function startServer() {

	const http = require('http');
	const https = require('https');
	const fs = require('fs');

	const app = express();

	const httpsCredentials = {
		key: fs.readFileSync('./https-certificate/key.pem'),
		cert: fs.readFileSync('./https-certificate/cert.pem')
	};

	http.createServer(app).listen(8080, () => {
		console.log('Server is listening on port 8080 - http');
	});
	https.createServer(httpsCredentials, app).listen(8443, () => {
		console.log('Server is listening on port 8443 - https');
	});

	dotenv.config({ path: process.env.CONFIG_PATH });

	app.use(cors());

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get('/', (req, res) => {
		res.send('Welcome to the COVID-19 Tracker App Server');
	});

	app.get('/.well-known/pki-validation/91AA05CD71D8C57AA4AA0D8019D50646.txt', (req, res) => {
		res.download('./https-certificate/91AA05CD71D8C57AA4AA0D8019D50646.txt');
		res.status(200);
	});

	app.use(config.api.prefix + config.api.version, routes());

	db();
	//email(); //this will send email 

	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
		})
	});
}

startServer();
