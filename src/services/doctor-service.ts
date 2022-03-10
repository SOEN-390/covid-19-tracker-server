import { Container, Service } from 'typedi';
import { IDoctorReturnData } from '../interfaces/IDoctor';
import { IPatientReturnData } from '../interfaces/IPatient';
import { ISymptom } from '../interfaces/ISymptom';

@Service()
export default class DoctorService {

	constructor() {
		//
	}

	public async getAllDoctors(userId: string): Promise<IDoctorReturnData[]> {
		const doctorsArray: IDoctorReturnData[] = [];
		const db: any = Container.get('mysql');

		await this.verifyUser(userId);
		const sql = 'SELECT firstName, lastName, licenseId, phoneNumber, address, email FROM User, Doctor WHERE User.id = Doctor.id';
		const results = await db.query(sql);
		if (results.length === 0) {
			throw new Error('Zero Doctors exist');
		}
		results[0].forEach(doctor => {
			doctorsArray.push(doctor);
		});
		return doctorsArray;
	}

	async getAssignedPatients(userId: any, licenseId: string): Promise<IPatientReturnData[]> {
		const patients: IPatientReturnData[] = [];
		const db: any = Container.get('mysql');

		await this.verifyUser(userId);
		const sql = 'SELECT medicalId, firstName, lastName, testResult, phoneNumber, address, email, ' +
			' dob, gender, flagged, reviewed FROM User, Patient WHERE Patient.doctorId=? AND User.id = Patient.userId';
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
		const sql = 'SELECT medicalId, firstName, lastName, testResult, phoneNumber, address, email,' +
			' dob, gender, flagged FROM User, Patient ' +
			'WHERE User.id = Patient.userId AND medicalId=?';
		const [rows] = await db.query(sql, medicalId);
		if (rows.length === 0) {
			throw new Error('User does not exist');
		}
		return {
			medicalId: rows[0].medicalId,
			firstName: rows[0].firstName,
			lastName: rows[0].lastName,
			testResult: rows[0].testResult,
			phoneNumber: rows[0].phoneNumber,
			address: rows[0].address,
			email: rows[0].email,
			dob: rows[0].dob,
			gender: rows[0].gender,
			flagged: rows[0].flagged
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
		const sql = 'INSERT INTO Request VALUES (?, ?, ?, ?, NOW())';
		for (const name of checklist) {
			await db.query(sql, [medicalId, licenseId, name, null]);
		}
	}

	async checkPendingRequest(medicalId: string, licenseId: string) {
		const db: any = Container.get('mysql');
		const sql = 'SELECT * FROM Request WHERE medicalId = ? AND licenseId = ? AND response is null';
		const [rows] = await db.query(sql, [medicalId, licenseId]);
		if (rows.length > 0) {
			throw new Error('Already requested');
		}
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

	async reviewPatient(userId: string, medicalId: string,): Promise<void> {
		const db: any = Container.get('mysql');
		let sql = '';
		sql = 'UPDATE Patient SET reviewed = true WHERE medicalId = ?';
		await db.query(sql, [medicalId]);
		return;
	}

	async unReviewPatient(userId: string, medicalId: string): Promise<void> {
		const db: any = Container.get('mysql');
		let sql = '';
		sql = 'UPDATE Patient SET reviewed = false WHERE medicalId = ?';
		await db.query(sql, [medicalId]);
		return;
	}
}
