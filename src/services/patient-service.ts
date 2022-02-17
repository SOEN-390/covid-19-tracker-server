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

        return new Promise((resolve, reject) => {
            db.query(sql, [userId, user.firstName, user.lastName, user.phoneNumber, user.address, user.email],
                async (error, result) => {
                    if (error) {
                        return reject(error);
                    }
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
                });
        });
    }

    private async createPatient(userId: string, patient: IPatient): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'INSERT INTO Patient VALUES (?, ?, ?)'
        return new Promise((resolve, reject) => {
            db.query(sql, [patient.medicalId, userId, patient.testResult], (error, result) => {
                return error ? reject(error) : resolve();
            });
        });
    }

    private async createConfirmed(data: IConfirmed): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'INSERT INTO Confirmed VALUES (?, ?)';
        return new Promise((resolve, reject) => {
            db.query(sql, [data.medicalId, data.flagged], (error, result) => {
                return error ? reject(error) : resolve();
            });
        });
    }

    private getUserFromData(userInfo: IPatientData): IUser {
        return {
            id: '', firstName: userInfo.firstName,
            lastName: userInfo.lastName, phoneNumber: userInfo.phoneNumber,
            address: userInfo.address, email: userInfo.email
        }
    }

    private getPatientFromData(userInfo: IPatientData): IPatient {
        return {medicalId: userInfo.medicalId, testResult: userInfo.testResult};
    }

    public async getPatientWithId(userId: string, medicalId: string): Promise<IPatientReturnData> {
        const db: any = Container.get('mysql');
        return new Promise((resolve, reject) => {
            this.verifyUser(userId).then(() => {
                const sql = 'SELECT firstName, lastName, testResult FROM User, Patient ' +
                    'WHERE User.id = Patient.userId AND medicalId=?';
                db.query(sql, medicalId, (error, result) => {
                    console.log(result)

                    return resolve({
                        firstName: result[0].firstName,
                        lastName: result[0].lastName,
                        testResult: result[0].testResult
                    });
                });
            }).catch((error) => {
                return reject(error);
            })
        });
    }


    public async getPatients(userId: string): Promise<IPatientReturnData[]> {
        const patientsArray:IPatientReturnData[] = [];
        const db: any = Container.get('mysql');
        return new Promise(( resolve, reject) => {
            this.verifyUser(userId).then(() => {
                const sql = 'SELECT firstName, lastName, testResult FROM User, Patient '+
                ' WHERE User.id = Patient.userId';
                db.query(sql, (error, result) => 
                {
                    result.forEach(patient => {
                        patientsArray.push(patient)
                    });
                    return resolve (patientsArray);
  
                });
            }).catch((error) => {
                return reject(error);
            })
        });
    }


    // To be used for almost all functions to verify the requester user exists in our db
    private async verifyUser(userId: string): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT * FROM User WHERE id=?';
        return new Promise((resolve, reject) => {
            db.query(sql, userId, (error, result) => {
                return error ? reject(error) : resolve();
            });
        })
    }
}
