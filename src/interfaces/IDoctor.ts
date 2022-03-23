export interface IDoctorData {
	licenseId: string,
	firstName: string,
	lastName: string,
	address: string,
	email: string,
	phoneNumber: string
}

export interface IDoctor {
	licenseId: string,
	emergencyLeave: boolean
}

export interface IDoctorReturnData {
	firstName: string,
	lastName: string,
	licenseId: string,
	phoneNumber: string,
	address: string,
	email: string,
	assignedPatientsCount: string
}

