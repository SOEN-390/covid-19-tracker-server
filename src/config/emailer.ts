import nodemailer from 'nodemailer'
import Container from 'typedi';
export default () => {

	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOSTNAME,
		port: Number(process.env.EMAIL_PORT),
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}
	});


	Container.set('nodemailer', transport)
};
