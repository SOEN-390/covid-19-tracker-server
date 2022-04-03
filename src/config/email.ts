import nodemailer from 'nodemailer'
import Container from 'typedi';
export default () => {

	const transport = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "aa1c77d4befacd",
			pass: "2eb3c4424aa957"
		}
	})

	Container.set('patientEmail', transport)
};
