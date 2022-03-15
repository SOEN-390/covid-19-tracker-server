import { Container, Service } from 'typedi';
import { IUserReturnData } from '../interfaces/IUser';
import { IPatient } from '../interfaces/IPatient';

@Service()
export default class UserService {

	constructor() {
		//
	}

	async getUser(userId: string): Promise<IUserReturnData> {
		const user = {} as IUserReturnData;
		const db: any = Container.get('mysql');
		const sql = 'SELECT * FROM User WHERE id=?';
		const [rows] = await db.query(sql, userId);
		if (rows.length === 0) {
			throw new Error('User does not exist');
		}
		user.firstName = rows[0].firstName;
		user.lastName = rows[0].lastName;
		user.address = rows[0].address;
		user.email = rows[0].email;
		user.phoneNumber = rows[0].phoneNumber;
		try {
			user.role = await this.getAuthority(userId);
			return user;
		} catch (e) {
			console.log('Not an Authority');
		}
		try {
			user.licenseId = await this.getDoctor(userId);
			user.role = 'doctor';
			return user;
		} catch (e) {
			console.log('Not a Doctor');
		}
		const patient: IPatient = await this.getPatient(userId);
		user.medicalId = patient.medicalId;
		user.testResult = patient.testResult;
		user.dob = patient.dob;
		user.gender = patient.gender;
		user.role = 'patient';
		return user;
	}

	async getAuthority(userId: string): Promise<string> {
		const db: any = Container.get('mysql');
		const sql = 'SELECT privilege FROM Authority WHERE id = ?';
		const [rows] = await db.query(sql, userId);
		if (rows.length === 0) {
			throw new Error('User not found');
		}
		return rows[0].privilege;
	}

	async getPatient(userId: string): Promise<IPatient> {
		const db: any = Container.get('mysql');
		const sql = 'SELECT medicalId, testResult, dob, gender FROM Patient WHERE userId = ?';
		const [rows] = await db.query(sql, userId);
		if (rows.length === 0) {
			throw new Error('User not found');
		}
		return {
			medicalId: rows[0].medicalId, testResult: rows[0].testResult,
			dob: rows[0].dob, gender: rows[0].gender
		};
	}

	async getDoctor(userId: string): Promise<string> {
		const db: any = Container.get('mysql');
		const sql = 'SELECT licenseId FROM Doctor WHERE id = ?';
		const [rows] = await db.query(sql, userId);
		if (rows.length === 0) {
			throw new Error('User not found');
		}
		return rows[0].licenseId;
	}
}
