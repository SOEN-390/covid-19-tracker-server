import {Container, Service} from "typedi";
import {IConfirmed, IPatient, IPatientData, testResult} from "../interfaces/IPatient";
import {IUser} from "../interfaces/IUser";


@Service()
export default class PatientService {

    constructor() {
    }

    async createUser(userId, userInfo: IPatientData): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'INSERT INTO User VALUES (?, ?, ?, ?, ?, ?)'
        const user: IUser = this.getUserFromData(userInfo);
        const patient: IPatient = this.getPatientFromData(userInfo);
        const confirmed = userInfo.testResult === testResult.POSITIVE;

        return new Promise((resolve, reject) => {
            db.query(sql, [userId, user.firstName, user.lastName, user.phoneNumber, user.address, user.email], (error, result) => {
                if (error) {
                    return reject(error);
                }
                this.createPatient(patient).then(() => {
                    if (confirmed) {
                        this.createConfirmed({medicalId: userInfo.medicalId, flagged: false}).then(() => {
                        }).catch((error) => {
                            return reject(error);
                        })
                    }
                    return;
                }).catch((error) => {
                        return reject(error)
                });
            });
        });
    }

    private async createPatient(patient: IPatient): Promise<boolean> {
        const db: any = Container.get('mysql');
        const sql = 'INSERT INTO Patient VALUES (?)'
        return new Promise((resolve, reject) => {
            db.query(sql, [patient], (error, result) => {
                return error ? reject(error) : resolve(true);
            });
        });
    }

    private async createConfirmed(data: IConfirmed): Promise<boolean> {
        const db: any = Container.get('mysql');
        const sql = 'INSERT INTO Patient VALUES (?, ?)'
        return new Promise((resolve, reject) => {
            db.query(sql, [data], (error, result) => {
                return error ? reject(error) : resolve(true);
            });
        });
    }

    private getUserFromData(userInfo: IPatientData): IUser {
        return { id:'', firstName: userInfo.firstName,
            lastName: userInfo.lastName, phoneNumber: userInfo.phoneNumber,
            address: userInfo.address, email: userInfo.email}
    }

    private getPatientFromData(userInfo: IPatientData): IPatient {
        return {medicalId: userInfo.medicalId, };
    }
}