import { Container } from 'typedi';

export default () => {

	const mysql = require('promise-mysql2');

	const pool = mysql.createPool({
		host: process.env.RDS_HOSTNAME,
		user: process.env.RDS_USERNAME,
		password: process.env.RDS_PASSWORD,
		port: process.env.RDS_PORT,
		database: 'covid-tracker'
	});

	console.log(pool.database, pool.getConnection());
	Container.set('mysql', pool);
};
