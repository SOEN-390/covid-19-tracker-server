import {Container, Service} from "typedi";
import {errors} from "celebrate";


@Service()
export default class PatientService {

    constructor() {

    }


    async helloWorld(): Promise<any> {

        // example on how to interact with the database
        const db: any = Container.get('mysql');

        await db.query("INSERT INTO Authority VALUES('helo@gmail.com', 'admin')");

        return  new Promise((resolve, reject) => {
            db.query("SELECT email FROM Authority WHERE privilege = 'admin';", (error, result) => {
                if (error) {
                    console.debug("ERROR:", error);
                }
                if (result) {
                    console.debug("SUCCESS: ", result);
                }
                return error ? reject(error) : resolve(result);
            });
        });

    }
}