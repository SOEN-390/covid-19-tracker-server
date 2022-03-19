import { testResult } from './IPatient';

export interface IUser {
	id: string,
	firstName: string,
	lastName: string,
	address: string
	email: string
	phoneNumber: string
}

export interface IUserReturnData {
	id: string,
	medicalId?: string,
	licenseId?: string,
	firstName: string,
	lastName: string,
	address: string,
	email: string,
	phoneNumber: string,
	testResult?: testResult,
	role: string,
	flagged?: boolean,
	dob?: string,
	gender?: string
}



