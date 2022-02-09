import {Container, Service} from "typedi";
import {IPatientData} from "../interfaces/IPatient";


@Service()
export default class PatientService {

    constructor() {

    }


    async createUser(userInfo: IPatientData): Promise<boolean> {

        const db: any = Container.get('mysql');
        const sql = `INSERT INTO User VALUES (?, ?, ?, ?, ?, ?)`

        return  new Promise((resolve, reject) => {
            db.query(sql, [userInfo.medicalId, userInfo.firstName,
                userInfo.lastName, userInfo.phoneNumber, userInfo.address, userInfo.email], (error, result) => {
                return error ? reject(error) : resolve(true);
            });
        });

    }
}