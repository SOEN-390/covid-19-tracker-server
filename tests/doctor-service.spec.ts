import DoctorService from '../src/services/doctor-service';
import { Container } from 'typedi';
import { gender, IPatientReturnData, testResult } from '../src/interfaces/IPatient';
import { ISymptom } from '../src/interfaces/ISymptom';

describe('Doctor service unit-test', () => {

	let userId;
	let testDoctorData;
	let testPatientData: IPatientReturnData;
	let testSymptom: ISymptom;
	let doctorService: DoctorService;
	let mysql;

	let rows;

	beforeEach(() => {

		userId = '1234';

		testDoctorData = {
			licenseId: '12',
			firstName: 'demo',
			lastName: 'doctor',
			address: 'st-laurent',
			email: 'test@gmail.com',
			phoneNumber: '514-555-5555',
		};

		testPatientData = {
			medicalId: '12',
			firstName: 'demo',
			lastName: 'user',
			address: 'st-laurent',
			email: 'test@gmail.com',
			phoneNumber: '514-555-5555',
			testResult: testResult.POSITIVE,
			doctorName: testDoctorData.firstName + ' '+ testDoctorData.lastName,
			dob: '01/01/1996',
			gender: gender.MALE,
			flagged: false
		};

		testSymptom = {
			name: 'fever',
			description: 'heloo'
		}

		doctorService = new DoctorService();

	});

	describe('Get All Doctors', () => {

		beforeEach(() => {
			rows = [testDoctorData, testDoctorData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('get all doctors', async () => {
			const doctors = await doctorService.getAllDoctors(userId);
			expect(doctors).toEqual([testDoctorData, testDoctorData]);
		});

	});

	describe('Get Assigned Patients', () => {

		beforeEach(() => {
			rows = [testPatientData, testPatientData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('get assigned patients of doctor', async () => {
			const doctors = await doctorService.getAssignedPatients(userId, testDoctorData.licenseId);
			expect(doctors).toEqual([testPatientData, testPatientData]);
		});

	});

	describe('Get Patient with Medical ID', () => {

		beforeEach(() => {
			rows = [testPatientData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('get assigned patients of doctor', async () => {
			const doctors = await doctorService.getPatientWithId(userId, testPatientData.medicalId);
			expect(doctors).toEqual(testPatientData);
		});

	});

	describe('Get Symptoms list', () => {

		beforeEach(() => {
			rows = [testSymptom];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('get symptoms', async () => {
			const doctors = await doctorService.getSymptoms(userId);
			expect(doctors).toEqual(rows);
		});

	});

	describe('Request Symptoms From Patient', () => {

		beforeEach(() => {

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([testDoctorData])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('request symptoms', async () => {
			try {
				await doctorService.requestSymptomsFromPatient(userId,
					testPatientData.medicalId, testDoctorData.licenseId, ['fever']);
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});
	});

	describe('Check Pending Requests', () => {

		beforeEach(() => {

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([testDoctorData])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('check pending requests', async () => {
			try {
				await doctorService.checkPendingRequest(testPatientData.medicalId,
					testDoctorData.licenseId);
			}
			catch (e) {
				expect(e).toEqual(new Error('Already requested'));
			}
		});
	});

	describe('Review Patient', () => {

		beforeEach(() => {

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('check pending requests', async () => {
			try {
				await doctorService.reviewPatient(userId, testPatientData.medicalId);
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});
	});

	describe('Un-review Patient', () => {

		beforeEach(() => {

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('un-review patient', async () => {
			try {
				await doctorService.unReviewPatient(userId, testPatientData.medicalId);
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});
	});

});
