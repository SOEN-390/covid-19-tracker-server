import {testResult} from "./IPatient";

export interface IUser {
    id: string,
    firstName: string,
    lastName: string,
    address: string
    email: string
    phoneNumber: string
}


export interface IUserReturnData {
    firstName: string,
    lastName: string,
    address: string,
    email: string,
    phoneNumber: string,
    testResult?: testResult,
    role: string
}



