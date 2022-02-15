import {Container, Service} from "typedi";
import {IConfirmed, IPatient, IPatientData, IPatientReturnData, testResult} from "../interfaces/IPatient";
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
        const confirmed = userInfo.testResult === testResult.POSITIVE;

        return new Promise(async (resolve, reject) => {
            try {
                await db.query(sql, [userId, user.firstName, user.lastName, user.phoneNumber, user.address, user.email]);
                try {
                    await this.createPatient(userId, patient);
                } catch (e) {
                    return reject(e);
                }
                if (!confirmed) {
                    return resolve();
                }
                try {
                    await this.createConfirmed({medicalId: userInfo.medicalId, flagged: false});
                    return resolve();
                } catch (e) {
                    return reject(e);
                }
            } catch (error) {
                return reject(error);
            }

        });
    }

    async createPatient(userId: string, patient: IPatient): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'INSERT INTO Patient VALUES (?, ?, ?)'
        return new Promise(async (resolve, reject) => {
            try {
                await db.query(sql, [patient.medicalId, userId, patient.testResult]);
                return resolve();
            } catch (error) {
                return reject(error);
            }
        });
    }

    async createConfirmed(data: IConfirmed): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'INSERT INTO Confirmed VALUES (?, ?)';
        return new Promise(async (resolve, reject) => {
            try {
                await db.query(sql, [data.medicalId, data.flagged]);
                return resolve();
            } catch (error) {
                return reject(error);
            }
        });
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
        return new Promise(async (resolve, reject) => {
            try {
                await this.verifyUser(userId);
                const sql = 'SELECT firstName, lastName, testResult FROM User, Patient ' +
                    'WHERE User.id = Patient.userId AND medicalId=?';
                const [rows] = await db.query(sql, medicalId);
                if (rows.length === 0) {
                    return reject(new Error('User does not exist'));
                }
                return resolve({
                    firstName: rows[0].firstName,
                    lastName: rows[0].lastName,
                    testResult: rows[0].testResult
                });
            } catch (error) {
                return reject(error);
            }
        });
    }

    // To be used for almost all functions to verify the requester user exists in our db
    async verifyUser(userId: string): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT * FROM User WHERE id=?';
        return new Promise(async (resolve, reject) => {
            try {
                await db.query(sql, userId);
                return resolve();
            } catch (e) {
                return reject(e);
            }
        })
    }
}
