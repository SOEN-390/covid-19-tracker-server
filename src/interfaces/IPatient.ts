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
    medicalId: string
}

export interface IConfirmed {
    medicalId: string
}

export interface IConfirmed {
    medicalId: string,
    flagged: boolean
}

export enum testResult {
    POSITIVE  = "positive",
    NEGATIVE = "negative"
}