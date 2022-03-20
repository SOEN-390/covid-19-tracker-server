import { Container, Service } from 'typedi';
import { IPatient, IPatientData, IPatientReturnData, IReportPatient, UserType } from '../interfaces/IPatient';
import { IUser } from '../interfaces/IUser';
import { ISymptom } from '../interfaces/ISymptom';

@Service()
export default class PatientService {

	constructor() {
		//
	}

	async createUser(userId: string, userInfo: IPatientData): Promise<void> {
		const db: any = Container.get('mysql');
		const sql = 'INSERT INTO User VALUES (?, ?, ?, ?, ?, ?)';
		const user: IUser = this.getUserFromData(userInfo);
		const patient: IPatient = this.getPatientFromData(userInfo);

		await db.query(sql, [userId, user.firstName, user.lastName, user.phoneNumber, user.address, user.email]);
		await this.createPatient(userId, patient);
	}

	async createPatient(userId: string, patient: IPatient): Promise<void> {
		const db: any = Container.get('mysql');
		const sql = 'INSERT INTO Patient VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(), \'UTC\', \'America/New_York\'))';
		await db.query(sql, [patient.medicalId, userId, patient.testResult, null, patient.dob,
		patient.gender, patient.flagged, patient.reviewed, patient.reminded]);
	}


	getUserFromData(userInfo: IPatientData): IUser {
		return {
			id: '', firstName: userInfo.firstName,
			lastName: userInfo.lastName, phoneNumber: userInfo.phoneNumber,
			address: userInfo.address, email: userInfo.email
		};
	}

	getPatientFromData(userInfo: IPatientData): IPatient {
		return {
			medicalId: userInfo.medicalId,
			testResult: userInfo.testResult,
			dob: userInfo.dob,
			gender: userInfo.gender,
			flagged: false,
			reviewed: false,
			reminded: false,
		};
	}

	async getPatientWithId(userId: string, medicalId: string): Promise<IPatientReturnData> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = `SELECT medicalId,
							patientUser.firstName,
							patientUser.lastName,
							testResult,
							IF(Patient.doctorId IS NOT NULL,
							   CONCAT(doctorUser.firstName, ' ', doctorUser.lastName), NULL)             as doctorName,
							patientUser.phoneNumber,
							patientUser.address,
							patientUser.email,
							dob,
							gender,
							reminded,
							lastUpdated,
							CASE
								WHEN medicalId IN
									 (SELECT medicalId From Flagged_Auth WHERE medicalId = ? AND authId = ?) THEN 1
								ELSE 0 END                                         as flagged
							
					 FROM User patientUser,
						  Patient,
						  User doctorUser,
						  Doctor
					 WHERE patientUser.id = Patient.userId
					   AND medicalId = ?
					   AND IF(Patient.doctorId IS NOT NULL,
							  Patient.doctorId = Doctor.licenseId AND doctorUser.id = Doctor.id, true)`;
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

	async getPatientDoctor(userId: string, medicalId: string): Promise<{ id: string, firstName: string, lastName: string }> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = `SELECT IF(Patient.doctorId IS NOT NULL,
							   doctorUser.id, NULL)             as id,
							IF(Patient.doctorId IS NOT NULL,
							   doctorUser.firstName, NULL)             as firstName,
							IF(Patient.doctorId IS NOT NULL,
							   doctorUser.lastName, NULL)             as lastName
					 FROM User patientUser,
						  Patient,
						  User doctorUser,
						  Doctor
					 WHERE patientUser.id = Patient.userId
					   AND medicalId = ?
					   AND IF(Patient.doctorId IS NOT NULL,
							  Patient.doctorId = Doctor.licenseId AND doctorUser.id = Doctor.id, true)`;
		const [rows] = await db.query(sql, [medicalId, userId, medicalId]);
		if (rows.length === 0) {
			throw new Error('User does not exist');
		}
		return {
			id: rows[0].id,
			firstName: rows[0].firstName,
			lastName: rows[0].lastName,
		};
	}

	public async getAllPatients(userId: string): Promise<IPatientReturnData[]> {
		const patientsArray: IPatientReturnData[] = [];
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = `SELECT DISTINCT medicalId,
									 patientUser.firstName,
									 patientUser.lastName,
									 testResult,
									 IF(Patient.doctorId IS NOT NULL,
										CONCAT(doctorUser.firstName, ' ', doctorUser.lastName), NULL)             as doctorName,
									 patientUser.phoneNumber,
									 patientUser.address,
									 patientUser.email,
									 dob,
									 gender,
									 reminded,
									 lastUpdated,
									 IF(medicalId IN (SELECT medicalId From Flagged_Auth WHERE authId = ?), 1,
										0) as flagged
										
					 FROM User patientUser,
						  Patient,
						  User doctorUser,
						  Doctor
					 WHERE patientUser.id = Patient.userId
					   AND IF(Patient.doctorId IS NOT NULL,
							  Patient.doctorId = Doctor.licenseId AND doctorUser.id = Doctor.id, true)`;
		const results = await db.query(sql, [userId]);
		if (results.length === 0) {
			throw new Error('Zero Patients exist');
		}
		results[0].forEach(patient => {
			patientsArray.push(patient);
		});
		return patientsArray;
	}

	async updateTestResult(userId: any, medicalId: string, testResult: string): Promise<void> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = 'UPDATE Patient SET testResult = ?, lastUpdated = CONVERT_TZ(NOW(), \'UTC\', \'America/New_York\')' +
			' WHERE medicalId = ?';
		await db.query(sql, [testResult, medicalId]);
	}

	async flagPatient(userId: string, medicalId: string, role: UserType): Promise<void> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		await this.verifyRole(userId, role);
		let sql = '';
		if (role === UserType.HEALTH_OFFICIAL || role === UserType.IMMIGRATION_OFFICER || role == UserType.ADMIN) {
			sql = 'INSERT INTO Flagged_Auth VALUES (?,?)';
			await db.query(sql, [medicalId, userId]);
			return;
		}
		if (role === UserType.DOCTOR) {
			await this.verifyAssignee(userId, medicalId);
			sql = 'UPDATE Patient SET flagged = true WHERE medicalId = ?';
			await db.query(sql, [medicalId]);
			return;
		}
		if (role === UserType.PATIENT) {
			sql = 'UPDATE Patient SET flagged = true WHERE medicalId = ?';
			await db.query(sql, [medicalId]);
			return;
		}
	}

	async unFlagPatient(userId: string, medicalId: string, role: UserType): Promise<void> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		await this.verifyRole(userId, role);
		let sql = '';
		if (role == UserType.ADMIN || role == UserType.IMMIGRATION_OFFICER || role == UserType.HEALTH_OFFICIAL) {
			sql = 'DELETE FROM Flagged_Auth WHERE medicalId =? AND authId =?';
			await db.query(sql, [medicalId, userId]);
			return;
		}
		if (role === UserType.DOCTOR) {
			await this.verifyAssignee(userId, medicalId);
			sql = 'UPDATE Patient SET flagged = false WHERE medicalId = ?';
			await db.query(sql, [medicalId]);
			return;
		}
		if (role === UserType.PATIENT) {
			sql = 'UPDATE Patient SET flagged = false WHERE medicalId = ?';
			await db.query(sql, [medicalId]);
			return;
		}
	}

	async remindPatient(userId: string, medicalId: string, role: UserType): Promise<void> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		await this.verifyRole(userId, role);
		let sql = '';

		if (role === UserType.HEALTH_OFFICIAL) {
			sql = 'UPDATE Patient SET reminded = true WHERE medicalId = ?';
			await db.query(sql, [medicalId]);
			return;
		}
		if (role === UserType.PATIENT) {
			sql = 'UPDATE Patient SET reminded = true WHERE medicalId = ?';
			await db.query(sql, [medicalId]);
			return;
		}
	}

	async unRemindPatient(userId: string, medicalId: string, role: UserType): Promise<void> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		await this.verifyRole(userId, role);
		let sql = '';
		if (role === UserType.HEALTH_OFFICIAL) {
			await this.verifyAssignee(userId, medicalId);
			sql = 'UPDATE Patient SET reminded = false WHERE medicalId = ?';
			await db.query(sql, [medicalId]);
			return;
		}
		if (role === UserType.PATIENT) {
			sql = 'UPDATE Patient SET reminded = false WHERE medicalId = ?';
			await db.query(sql, [medicalId]);
			return;
		}
	}


	async reportInContactWith(userId: string, reporterMedicalId: string, people: IReportPatient[]) {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		for (const person of people) {
			let sql = 'SELECT medicalId From Patient, User WHERE Patient.userId = User.id AND phoneNumber = ? AND email = ?';
			const [rows] = await db.query(sql, [person.phoneNumber, person.email]);
			if (rows.length == 0) {
				throw new Error('Reportee is not a user');
			}
			sql = 'INSERT INTO InContact VALUES (?,?, CONVERT_TZ(NOW(), \'UTC\', \'America/New_York\'))';
			await db.query(sql, [reporterMedicalId, rows[0].medicalId]);
		}
	}

	async getMyRequestedSymptoms(userId: string, medicalId: string): Promise<ISymptom[]> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = 'SELECT name, description FROM Request, Symptoms ' +
			'WHERE medicalId = ? AND symptom = Symptoms.name AND response is null';
		const [rows] = await db.query(sql, medicalId);
		if (rows.length == 0) {
			throw new Error('No requested symptoms at the moment');
		}
		return rows;
	}

	async submitSymptomsResponse(userId: string, medicalId: string, responseList: ISymptom[]) {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		for (const symptom of responseList) {
			const sql = 'UPDATE Request SET response = ?, onDate = CONVERT_TZ(NOW(), \'UTC\', \'America/New_York\')' +
				' WHERE medicalId = ? ' +
				'AND symptom = ? AND onDate is null AND response is null';
			await db.query(sql, [symptom.isChecked, medicalId, symptom.name]);
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

	async verifyRole(userId: string, role: UserType): Promise<void> {
		const db: any = Container.get('mysql');
		let sql = '';
		switch (role) {
			case UserType.ADMIN || UserType.IMMIGRATION_OFFICER || UserType.HEALTH_OFFICIAL: {
				sql = 'SELECT * FROM Authority WHERE id=?';
				const [rows1] = await db.query(sql, userId);
				if (rows1.length === 0) {
					throw new Error('Role does not match');
				}
				return;
			}
			case UserType.DOCTOR: {
				sql = 'SELECT * FROM Doctor WHERE id=?';
				const [rows2] = await db.query(sql, userId);
				if (rows2.length === 0) {
					throw new Error('Role does not match');
				}
				return;
			}
			case UserType.PATIENT: {
				return;
			}
		}
	}

	async verifyAssignee(userId: string, medicalId: string): Promise<void> {
		const db: any = Container.get('mysql');
		const sql = 'SELECT licenseId FROM Patient, Doctor WHERE Patient.doctorId = licenseId AND Doctor.id = ? AND Patient.medicalId = ?';
		const [rows] = await db.query(sql, [userId, medicalId]);
		if (rows.length === 0) {
			throw new Error('Patient is not assigned to this Doctor');
		}
	}


}
