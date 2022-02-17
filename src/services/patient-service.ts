import {Container, Service} from "typedi";
import {IPatient, IPatientData, IPatientReturnData, testResult} from "../interfaces/IPatient";
import {IUser} from "../interfaces/IUser";


@Service()
export default class PatientService {

    constructor() {
    }

    async createUser(userId: string, userInfo: IPatientData): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'INSERT INTO User VALUES (?, ?, ?, ?, ?, ?)'
        const user: IUser = this.getUserFromData(userInfo);
        const patient: IPatient = this.getPatientFromData(userInfo);

        await db.query(sql, [userId, user.firstName, user.lastName, user.phoneNumber, user.address, user.email]);
        await this.createPatient(userId, patient);
    }

    async createPatient(userId: string, patient: IPatient): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'INSERT INTO Patient VALUES (?, ?, ?)'
        await db.query(sql, [patient.medicalId, userId, patient.testResult]);
    }


    getUserFromData(userInfo: IPatientData): IUser {
        return {
            id: '', firstName: userInfo.firstName,
            lastName: userInfo.lastName, phoneNumber: userInfo.phoneNumber,
            address: userInfo.address, email: userInfo.email
        }
    }

    getPatientFromData(userInfo: IPatientData): IPatient {
        return {medicalId: userInfo.medicalId, testResult: userInfo.testResult};
    }

    async getPatientWithId(userId: string, medicalId: string): Promise<IPatientReturnData> {
        const db: any = Container.get('mysql');
        await this.verifyUser(userId);
        const sql = 'SELECT firstName, lastName, testResult FROM User, Patient ' +
            'WHERE User.id = Patient.userId AND medicalId=?';
        const [rows] = await db.query(sql, medicalId);
        if (rows.length === 0) {
            throw new Error('User does not exist');
        }
        return {
            firstName: rows[0].firstName,
            lastName: rows[0].lastName,
            testResult: rows[0].testResult
        };
    }


    public async getPatients(userId: string): Promise<IPatientReturnData[]> {
        const patientsArray:IPatientReturnData[] = [];
        const db: any = Container.get('mysql');
        await this.verifyUser(userId)
        const sql = 'SELECT firstName, lastName, testResult FROM User, Patient '+
                ' WHERE User.id = Patient.userId';
        const results =await db.query(sql);
        if (results.length === 0) {
                throw new Error('Zero Patients exist');
            }
        results[0].forEach(patient => {
            patientsArray.push(patient)
        });
        return (patientsArray);
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
