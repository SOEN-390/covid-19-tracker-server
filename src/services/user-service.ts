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
        try {
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
                console.log("Not an Authority");
            }
            try {
                await this.getDoctor(userId);
                user.role = 'doctor';
                return user;
            } catch (e) {
                console.log("Not a Doctor");
            }
            try {
                user.testResult = await this.getPatient(userId);
                user.role = 'patient';
                return user;
            } catch (e) {
                // A user but not found in any type tables.
                console.log("Not a Patient");
                throw e;
            }
        } catch (error) {
            throw error;
        }
    }

    async getAuthority(userId: string): Promise<string> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT privilege FROM Authority WHERE id = ?';
        try {
            const [rows] = await db.query(sql, userId);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
            return rows[0].privilege;
        } catch (error) {
            throw error;
        }
    }

    async getPatient(userId: string): Promise<testResult> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT testResult FROM Patient WHERE userId = ?';
        try {
            const [rows] = await db.query(sql, userId);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
            return rows[0].testResult;
        } catch (error) {
            throw error;
        }
    }

    async getDoctor(userId: string): Promise<void> {
        const db: any = Container.get('mysql');
        const sql = 'SELECT * FROM Doctor WHERE id = ?';
        try {
            const [rows] = await db.query(sql, userId);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
        } catch (error) {
            throw error;
        }

    }

}