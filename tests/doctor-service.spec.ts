import DoctorService from '../src/services/doctor-service';
import { Container } from 'typedi';
import { gender, IPatientReturnData, testResult } from '../src/interfaces/IPatient';
import { ISymptom, ISymptomResponse } from '../src/interfaces/ISymptom';

describe('Doctor service unit-test', () => {

	let userId;
	let testDoctorData;
	let testPatientData: IPatientReturnData;
	let testSymptom: ISymptom;
	let testSymptomsResponse: ISymptomResponse;
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
			doctorName: testDoctorData.firstName + ' ' + testDoctorData.lastName,
			dob: '01/01/1996',
			gender: gender.MALE,
			flagged: false,
			reminded: false,
			lastUpdated: new Date()
		};

		testSymptom = {
			name: 'fever',
			description: 'heloo'
		}

		testSymptomsResponse = {
			name: 'fever',
			description: 'heloo',
			response: false,
			onDate: new Date()
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


	describe('Get Patients Symptoms History', () => {

		beforeEach(() => {

			let rows = [testSymptomsResponse];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('get patients symptoms history', async () => {
			const symptomResponses = await doctorService.getPatientSymptomsHistory(userId,
				testDoctorData.licenseId, testPatientData.medicalId);
			expect(symptomResponses).toEqual([testSymptomsResponse])
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

	describe('Declare Emergency Leave', () => {

		beforeEach(() => {

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([testPatientData])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('declare emergency leave', async () => {
			try {
				await doctorService.declareEmergencyLeave(userId, testDoctorData.licenseId);
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});
	});

	describe('Book an appointment with Patient', () => {

		beforeEach(() => {
			jest.spyOn(doctorService, 'verifyAppointment').mockImplementation(async ()=> {
				return;
			});

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([testPatientData])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('book an appointment', async () => {
			try {
				await doctorService.bookAppointment(userId, testDoctorData.licenseId,
					testPatientData.medicalId, {date: '', subject: 'test'})
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});
	});

	describe('Verify Appointment', () => {

		beforeEach(() => {

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([[]])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('verify appointment', async () => {
			try {
				await doctorService.verifyAppointment(testDoctorData.licenseId, testPatientData.medicalId);
			}
			catch (e) {
				expect(e).toEqual(new Error('No upcoming appointments'));
			}
		});
	});

	describe('Get upcoming Appointments for Doctor', () => {

		beforeEach(() => {
			jest.spyOn(doctorService, 'verifyUser').mockImplementation(async ()=> {
				return;
			});

			let rows = [{date: '1995-01-01', subject: 'test'}];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('get upcoming appointments', async () => {
			const appointments = await doctorService.getUpcomingAppointments(userId, testDoctorData.licenseId);
			expect(appointments).toEqual([{date: '1995-01-01', subject: 'test'}]);
		});
	});

	describe('Verify User', () => {

		beforeEach(() => {

			let rows = [testDoctorData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('verify user', async () => {
			try {
				await doctorService.verifyUser(userId)
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});

	});



});
