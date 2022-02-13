import {Container, Service} from "typedi";
import {IUserReturnData} from "../interfaces/IUser";
import {testResult} from "../interfaces/IPatient";


@Service()
export default class UserService {

    constructor() {
    }

    async getUser(userId: string): Promise<IUserReturnData> {
        let user = {} as IUserReturnData;
        const db: any = Container.get('mysql');
        const sql = 'SELECT * FROM User WHERE id=?';
        return new Promise((resolve, reject) => {
            db.query(sql, userId, async (error, result) => {
                if (error) {
                    return reject(error);
                }
                user.firstName = result[0].firstName;
                user.lastName = result[0].lastName;
                user.address = result[0].address;
                user.email = result[0].email;
                user.phoneNumber = result[0].phoneNumber;
                try {
                    const privilege = await this.getAuthority(userId);
                    if (privilege) {
                        user.role = privilege;
                        return resolve(user);
                    }
                } catch (e) {
                    console.log("Not an Authority");
                }
                try {
                    const success = await this.getDoctor(userId);
                    if (success) {
                        user.role = 'doctor';
                        return resolve(user);
                    }
                } catch (e) {
                    console.log("Not a Doctor");
                }
                try {
                    const privilege = await this.getAdmin(userId);
                    if (privilege) {
                        user.role = 'admin';
                        return resolve(user);
                    }
                } catch (e) {
                    console.log("Not an Admin");
                }
                try {
                    const testResult = await this.getPatient(userId);
                    if (testResult) {
                        user.testResult = testResult;
                        user.role = 'patient';
                        return resolve(user);
                    }
                } catch (e) {
                    // A user but not found in any type tables.
                    console.log("Not a Patient");
                    return reject(e);
                }
            });
        });
    }

    async getAuthority(userId: string): Promise<string> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT privilege FROM Authority WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, userId, (error, result) => {
                if (error || result?.length === 0) {
                    return reject(error);
                }
                return resolve(result[0].privilege);
            });
        });
    }

    async getAdmin (userId: string): Promise<boolean> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT idAdmin FROM Admin WHERE idAdmin = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, userId, (error, result) => {
                if (error || result?.length === 0) {
                    return reject(error);
                }
                return resolve(true);
            });
        });
    }

    async getPatient(userId: string): Promise<testResult> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT testResult FROM Patient WHERE userId = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, userId, (error, result) => {
                return error ? reject(error) : resolve(result[0].testResult);
            });
        });

    }

    async getDoctor(userId: string): Promise<boolean> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT * FROM Doctor WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, userId, (error, result) => {
                if (error || result?.length === 0) {
                    return reject(error);
                }
                return resolve(true);
            });
        });
    }


}