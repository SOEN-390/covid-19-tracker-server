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
	gender: gender
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
	gender: gender
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
