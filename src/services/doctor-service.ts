import { Container, Service } from 'typedi';
import { IDoctorReturnData } from '../interfaces/IDoctor';
import { IContact, IPatientReturnData } from '../interfaces/IPatient';
import { ISymptom, ISymptomResponse } from '../interfaces/ISymptom';
import { IAppointment, IAppointmentReturnData } from '../interfaces/IAppointment';

@Service()
export default class DoctorService {

	constructor() {
		//
	}

	public async getAllDoctors(userId: string): Promise<IDoctorReturnData[]> {
		const doctorsArray: IDoctorReturnData[] = [];
		const db: any = Container.get('mysql');

		await this.verifyUser(userId);
		const sql = `SELECT firstName,
							lastName,
							Doctor.licenseId,
							phoneNumber,
							address,
							email,
       						emergencyLeave,
							AssignedPatients.assignedPatientsCount
					 FROM User,
						  Doctor,
						  (SELECT Doctor.licenseId, COUNT(Patient.doctorId) AS assignedPatientsCount
						   FROM Doctor
									LEFT JOIN Patient on Doctor.licenseId = Patient.doctorId
						   GROUP BY Doctor.licenseId) AS AssignedPatients
					 WHERE User.id = Doctor.id
					   AND AssignedPatients.licenseId = Doctor.licenseId`;
		const results = await db.query(sql);
		if (results.length === 0) {
			throw new Error('Zero Doctors exist');
		}
		results[0].forEach(doctor => {
			doctorsArray.push(doctor);
		});
		return doctorsArray;
	}

	async getAssignedPatients(userId: string, licenseId: string): Promise<IPatientReturnData[]> {
		const patients: IPatientReturnData[] = [];
		const db: any = Container.get('mysql');

		await this.verifyUser(userId);
		const sql = `SELECT patientUser.id,
							medicalId,
							patientUser.firstName,
							patientUser.lastName,
							testResult,
							patientUser.phoneNumber,
							patientUser.address,
							patientUser.email,
							dob,
							gender,
							flagged,
							reviewed,
							reminded,
							lastUpdated
					 FROM User patientUser,
						  Patient,
						  User doctorUser,
						  Doctor
					 WHERE Patient.doctorId = ?
					   AND patientUser.id = Patient.userId
					   AND Patient.doctorId = Doctor.licenseId
					   AND doctorUser.id = Doctor.id`;
		const [rows] = await db.query(sql, licenseId);
		if (rows.length === 0) {
			throw new Error('No patients assigned');
		}
		rows.forEach(patient => {
			patients.push(patient);
		});
		return patients;
	}

	async getPatientWithId(userId: string, medicalId: string): Promise<IPatientReturnData> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = `SELECT medicalId,
							patientUser.firstName,
							patientUser.lastName,
							testResult,
							CONCAT(doctorUser.firstName, ' ', doctorUser.lastName) as doctorName,
							patientUser.phoneNumber,
							patientUser.address,
							patientUser.email,
							dob,
							gender,
							lastUpdated,
							Patient.flagged
					 FROM User patientUser,
						  Patient,
						  User doctorUser,
						  Doctor
					 WHERE patientUser.id = Patient.userId
					   AND medicalId = ?
					   AND Patient.doctorId = Doctor.licenseId
					   AND doctorUser.id = Doctor.id`;
		const [rows] = await db.query(sql, [medicalId, userId, medicalId]);
		if (rows.length === 0) {
			throw new Error('User does not exist');
		}
		return {
			medicalId: rows[0].medicalId,
			firstName: rows[0].firstName,
			lastName: rows[0].lastName,
			testResult: rows[0].testResult,
			doctorName: rows[0].doctorName,
			phoneNumber: rows[0].phoneNumber,
			address: rows[0].address,
			email: rows[0].email,
			dob: rows[0].dob,
			gender: rows[0].gender,
			flagged: rows[0].flagged,
			reminded: rows[0].reminded,
			lastUpdated: rows[0].lastUpdated
		};
	}

	async getSymptoms(userId: string): Promise<ISymptom[]> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = 'SELECT name, description FROM Symptoms';
		const [rows] = await db.query(sql);
		if (rows.length === 0) {
			throw new Error('Symptoms do not exist');
		}
		return rows;
	}

	async requestSymptomsFromPatient(userId: string, medicalId: string, licenseId: string, checklist: string[]): Promise<void> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		await this.checkPendingRequest(medicalId, licenseId);
		const sql = 'INSERT INTO Request VALUES (?, ?, ?, ?, ?)';
		for (const name of checklist) {
			await db.query(sql, [medicalId, licenseId, name, null, null]);
		}
	}

	async getPatientSymptomsHistory(userId: string, licenseId: string, medicalId: string): Promise<ISymptomResponse[]> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = 'SELECT name, description, response, onDate FROM Request, Symptoms ' +
			'WHERE medicalId = ? AND licenseId = ? AND name = symptom AND response is not null ORDER by onDate desc';
		const [rows] = await db.query(sql, [medicalId, licenseId]);
		if (rows.length === 0) {
			throw new Error('No response submitted by patient');
		}
		return rows;
	}

	async checkPendingRequest(medicalId: string, licenseId: string) {
		const db: any = Container.get('mysql');
		const sql = 'SELECT * FROM Request WHERE medicalId = ? AND licenseId = ? AND response is null';
		const [rows] = await db.query(sql, [medicalId, licenseId]);
		if (rows.length > 0) {
			throw new Error('Already requested');
		}
	}

	async getPatientContacts(userId: string, medicalId: string): Promise<IContact[]> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = 'SELECT medicalId, firstName, lastName, testResult FROM User, Patient, InContact \n' +
			'WHERE reporterId = ? AND  reporteeId = Patient.medicalId AND Patient.userId = User.id';
		const [rows] = await db.query(sql, medicalId);
		if (rows.length == 0) {
			throw new Error('No contacts found');
		}
		return rows;
	}


	async reviewPatient(userId: string, medicalId: string,): Promise<void> {
		const db: any = Container.get('mysql');
		const sql = 'UPDATE Patient SET reviewed = true WHERE medicalId = ?';
		await db.query(sql, [medicalId]);
		return;
	}

	async unReviewPatient(userId: string, medicalId: string): Promise<void> {
		const db: any = Container.get('mysql');
		const sql = 'UPDATE Patient SET reviewed = false WHERE medicalId = ?';
		await db.query(sql, [medicalId]);
		return;
	}

	async declareEmergencyLeave(userId: string, licenseId: string): Promise<void> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = 'UPDATE Doctor SET emergencyLeave = true WHERE licenseId = ?';
		await db.query(sql, [licenseId]);
		return;
	}

	async bookAppointment(userId: string, licenseId: string, medicalId: string, appointment: IAppointment) {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		await this.verifyAppointment(licenseId, medicalId);
		const date = new Date(appointment.date);
		const sql = 'INSERT INTO Appointment VALUES (?, ?, ?, ?)';
		await db.query(sql, [medicalId, licenseId, date, appointment.subject]);
		await this.sendEmailToPatient(medicalId, appointment);
	}

	async sendEmailToPatient(medicalId: string, appointment: IAppointment) {
		const db: any = Container.get('mysql');
		const mailerService: any = Container.get('mailerService');
		const sql = 'SELECT email FROM User, Patient WHERE Patient.userId = User.id AND medicalId = ?';
		const [rows] = await db.query(sql, medicalId);
		if (rows.length === 0) {
			throw new Error('User does not exist');
		}
		mailerService.sendMail({
			from: 'notifications@cvoid-19-app.web.app',
			to: `${rows[0].email}`,
			subject: `${appointment.subject}`,
			html: `
							<p>Your Doctor has set an appointment at ${appointment.date} </p>

						`
		});
	}

	async verifyAppointment(licenseId: string, medicalId: string) {
		const db: any = Container.get('mysql');
		const sql = 'SELECT * FROM Appointment WHERE licenseId = ? AND medicalId = ? AND appointmentDate > NOW()';
		const [rows] = await db.query(sql, [licenseId, medicalId]);
		if (rows.length > 0) {
			throw new Error('Already have an upcoming appointment');
		}
	}

	async getUpcomingAppointments(userId: string, licenseId: string): Promise<IAppointmentReturnData[]> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = `SELECT CONCAT(firstName, ' ', lastName) as patientName, appointmentSubject, appointmentDate
						FROM User, Patient, Appointment WHERE Appointment.licenseId = ? AND Appointment.medicalId = Patient.medicalId
						AND Patient.userId = User.id AND appointmentDate > CONVERT_TZ(NOW(), 'UTC', 'America/New_York')
						ORDER BY appointmentDate asc`;
		const [rows] = await db.query(sql, licenseId);
		if (rows.length === 0) {
			throw new Error('No upcoming appointments');
		}
		return rows;
	}

	// To be used for almost all functions to verify the requester user exists in our db
	async verifyUser(userId: string): Promise<void> {
		const db: any = Container.get('mysql');
		const sql = 'SELECT * FROM User WHERE id=?';
		const [rows] = await db.query(sql, userId);
		if (rows.length === 0) {
			throw new Error('User does not exist');
		}
	}


}
