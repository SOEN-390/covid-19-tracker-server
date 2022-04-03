import nodemailer from 'nodemailer'
export default () => {

	const transport = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "aa1c77d4befacd",
			pass: "2eb3c4424aa957"
		}
	})


	transport.sendMail({
		from: 'quaranteam.soen390@gmail.com',
		to: 'beshoysoliman11@gmail.com',
		subject: 'Appointment has been set with your Doctor',
		html: `<p> Please login covid-19 tracker app and check appoiment set with your docter </p>
			`
	})
};
