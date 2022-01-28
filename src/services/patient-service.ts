import {Service} from "typedi";




@Service()
export default class PatientService {

    constructor() {

    }


    helloWorld(): string {
       return "Hello, World!";
    }
}