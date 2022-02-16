export interface IPatientData {
    medicalId: string,
    firstName: string,
    lastName: string,
    testResult: testResult,
    address: string,
    email: string,
    phoneNumber: string
}

export interface IPatient {
    medicalId: string,
    testResult: testResult,
}

export interface IPatientReturnData {
    firstName: string,
    lastName: string,
    testResult: testResult
}

export enum testResult {
    POSITIVE  = 'positive',
    NEGATIVE = 'negative',
    PENDING = 'pending'
}