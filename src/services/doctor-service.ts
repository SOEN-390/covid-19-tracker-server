import {Container, Service} from "typedi";
import {IDoctorReturnData} from "../interfaces/IDoctor";


@Service()
export default class DoctorService {

    constructor() {
    }

    public async getAllDoctors(userId: string): Promise<IDoctorReturnData[]> {
        const doctorsArray: IDoctorReturnData[] = [];
        const db: any = Container.get('mysql');

        await this.verifyUser(userId)
        const sql = 'SELECT firstName, lastName, licenseId, phoneNumber, address, email FROM User, Doctor WHERE User.id = Doctor.id';
        const results = await db.query(sql);
        if (results.length === 0) {
            throw new Error('Zero Doctors exist');
        }
        results[0].forEach(doctor => {
            doctorsArray.push(doctor)
        });
        return doctorsArray;
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
