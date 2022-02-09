

export interface IUser {
    medicalId: string,
    firstName: string,
    lastName: string,
    testResults: testResult
    address: string
    email: string
    phoneNumber: string
}


export enum testResult {
    POSITIVE  = "positive",
    NEGATIVE = "negative"
}
