import {Container, Service} from "typedi";
import {IUserReturnData} from "../interfaces/IUser";
import {testResult} from "../interfaces/IPatient";


@Service()
export default class UserService {

    constructor() {
    }

    async getUser(userId: string): Promise<IUserReturnData> {
        let user: IUserReturnData;
        const db: any = Container.get('mysql');
        const sql = 'SELECT * FROM User WHERE id=?';
        return new Promise((resolve, reject) => {
            db.query(sql, userId, (error,result)=> {
                if (error) {
                    return reject(error);
                }
                user.firstName = result[0].firstName;
                user.lastName = result[0].lastName;
                user.address = result[0].address;
                user.email = result[0].email;
                user.phoneNumber = result[0].phoneNumber;
                this.getAuthority(userId).then((privilege) => {
                    user.role = privilege;
                    return resolve(user);
                }).catch((error) => {});
                this.getDoctor(userId).then(() => {
                    user.role = 'doctor';
                    return resolve(user);
                }).catch((error) => {});
                this.getPatient((userId)).then((testResult) => {
                    user.testResult = testResult;
                    user.role = 'patient';
                    return resolve(user);
                }).catch((error) => {});
            });
        });
    }

    async getAuthority(userId: string): Promise<string> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT privilege FROM Authority WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, userId, (error, result) => {
                return error ? reject(error) : resolve(result[0].privilege);
            });
        });
    }

    async getPatient(userId: string): Promise<testResult> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT testResult FROM User WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, userId, (error, result) => {
                return error ? reject(error) : resolve(result[0].testResult);
            });
        });

    }

    async getDoctor(userId: string): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT * FROM Doctor WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, userId, (error, result) => {
                return error ? reject(error) : resolve();
            });
        });
    }


}