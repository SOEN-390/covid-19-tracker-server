import { Container, Service } from 'typedi';
import { IPatientReturnData } from '../interfaces/IPatient';

@Service()
export default class ImmigrationService {

	constructor() {
		//
	}

	async getFlaggedPatients(userId: string): Promise<IPatientReturnData[]> {
		const patients: IPatientReturnData[] = [];
		const db: any = Container.get('mysql');

		await this.verifyUser(userId);
		const sql = `SELECT patientUser.id,
							Patient.medicalId,
							patientUser.firstName,
							patientUser.lastName,
							Patient.testResult,
							patientUser.phoneNumber,
							patientUser.address,
							patientUser.email,
							dob,
       						true as flagged,
							gender
					 FROM Patient
							  INNER JOIN User patientUser on Patient.userId = patientUser.id
							  INNER JOIN Flagged_Auth on Patient.medicalId = Flagged_Auth.medicalId
					 Where Flagged_Auth.authId = ?`;
		const [rows] = await db.query(sql, userId);
		if (rows.length === 0) {
			throw new Error('No patients assigned');
		}
		rows.forEach(patient => {
			patients.push(patient);
		});
		return patients;
	}

	async verifyUser(userId: string): Promise<void> {
		const db: any = Container.get('mysql');
		const sql = `SELECT *
					 FROM Authority
					 WHERE privilege = 'immigration_officer'
					   AND id = ?`;
		const [rows] = await db.query(sql, userId);
		if (rows.length === 0) {
			throw new Error('User does not exist');
		}
	}
}
