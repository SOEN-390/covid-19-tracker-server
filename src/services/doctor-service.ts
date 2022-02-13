import {Container, Service} from "typedi";
import {IDoctor, IDoctorData, IDoctorReturnData} from "../interfaces/IDoctor";
import {IUser} from "../interfaces/IUser";


@Service()
export default class DoctorService {

    constructor() {
    }

    public async getDoctors(userId: string): Promise<IDoctorReturnData[]> {
        const doctorssArray:IDoctorReturnData[] = [];
        const db: any = Container.get('mysql');
        return new Promise(( resolve, reject) => {
            this.verifyUser(userId).then(() => {
                const sql = 'SELECT * FROM User, Doctor WHERE User.id = Doctor.id';
                db.query(sql, (error, result) => 
                {
                    result.forEach(doctor => {
                        doctorssArray.push(doctor)
                    });
                    return resolve (doctorssArray);
  
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
