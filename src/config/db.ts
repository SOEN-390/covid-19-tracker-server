import { Container } from 'typedi';

export default () => {

	const mysql = require('promise-mysql2');

	console.log('env');
	console.log(process.env);

	console.log('database config:');

	console.log({
		host            : process.env.RDS_HOSTNAME,
		user            : process.env.RDS_USERNAME,
		password        : process.env.RDS_PASSWORD,
		database        : process.env.RDS_PORT
	});

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
