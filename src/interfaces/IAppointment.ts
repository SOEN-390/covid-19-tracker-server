export interface IAppointment {
	date: string,
	subject: string
}

export interface IAppointmentReturnData {
	patientName: string;
	appointmentSubject: string;
	appointmentDate : Date;
}
