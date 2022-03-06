

export interface IPatientData {
	medicalId: string,
	firstName: string,
	lastName: string,
	testResult: testResult,
	address: string,
	email: string,
	phoneNumber: string,
	dob: string,
	gender: gender
}

export interface IPatient {
	medicalId: string,
	testResult: testResult,
	dob: string,
	gender: gender,
	flagged?: boolean
}

export interface IPatientReturnData {
	medicalId: string,
	firstName: string,
	lastName: string,
	testResult: testResult,
	phoneNumber: string,
	address: string,
	email: string,
	dob: string,
	gender: gender,
	flagged: boolean
}

export interface IReportPatient {
	fistName: string,
	lastName: string,
	email: string,
	phoneNumber: string
}

export interface IContact {
	fistName: string,
	lastName: string,
	testResult: testResult
}


export enum testResult {
	POSITIVE = 'positive',
	NEGATIVE = 'negative',
	PENDING = 'pending'
}

export enum gender {
	MALE = 'male',
	FEMALE = 'female',
	NONE = 'Prefer not to say'
}

export enum UserType {
	PATIENT = 'patient',
	DOCTOR = 'doctor',
	IMMIGRATION_OFFICER = 'immigration_officer',
	HEALTH_OFFICIAL = 'health_official',
	ADMIN = 'admin'
}

