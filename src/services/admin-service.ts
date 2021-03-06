import { Container, Service } from 'typedi';
import { ISymptom } from '../interfaces/ISymptom';

@Service()
export default class AdminService {
	constructor() {
		//
	}


	async unassignDoctor(userId: string, medicalId: string, licenseId: string): Promise<void> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = 'UPDATE Patient SET doctorId = null WHERE medicalId = ? AND doctorId = ?';
		await db.query(sql, [medicalId, licenseId]);
	}

	async assignDoctor(userId: string, medicalId: string, licenseId: string): Promise<void> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = 'UPDATE Patient SET doctorId = ? WHERE medicalId = ? AND doctorId is null';
		await db.query(sql, [licenseId, medicalId]);
	}

	async addNewSymptom(userId: string, symptom: ISymptom): Promise<void> {
		const db: any = Container.get('mysql');
		await this.verifyUser(userId);
		const sql = 'INSERT INTO Symptoms VALUES (?,?)';
		await db.query(sql, [symptom.name, symptom.description]);
	}

	async verifyUser(userId: string): Promise<void> {
		const db: any = Container.get('mysql');
		const sql = 'SELECT * FROM User WHERE id=?';
		const [rows] = await db.query(sql, userId);
		if (rows.length === 0) {
			throw new Error('User does not exist');
		}
	}
}
