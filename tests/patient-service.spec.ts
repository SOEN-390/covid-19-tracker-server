import PatientService from '../src/services/patient-service';
import { Container } from 'typedi';
import { testResult, UserType } from '../src/interfaces/IPatient';

describe('Patient service unit-test', () => {

	let userId;
	let testPatientData;

	let patientService: PatientService;
	let mysql;

	let rows;

	beforeEach(() => {

		userId = '1234';

		testPatientData = {
			medicalId: '12',
			firstName: 'demo',
			lastName: 'user',
			address: 'st-laurent',
			email: 'test@gmail.com',
			phoneNumber: '514-555-5555',
			testResult: testResult.POSITIVE
		};

		patientService = new PatientService();

	});

	describe('Create User', () => {

		beforeEach(() => {

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('create user', async () => {
			try {
				await patientService.createUser(userId, testPatientData);
			} catch (e) {
				expect(e).toBeNaN();
			}
		});
	});

	describe('Get Patient with Medical ID', () => {

		beforeEach(() => {

			rows = [{
				firstName: 'demo',
				lastName: 'user', testResult: testResult.POSITIVE
			}];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('get patient with id', async () => {
			const profile = await patientService.getPatientWithId(userId, testPatientData.medicalId);
			expect(profile).toEqual({
				firstName: 'demo',
				lastName: 'user', testResult: testResult.POSITIVE
			});

		});
	});

	describe('Get User From Data', () => {

		test('get user from data', () => {
			const data = patientService.getUserFromData(testPatientData);
			expect(data).toEqual({
				id: '', firstName: testPatientData.firstName,
				lastName: testPatientData.lastName, phoneNumber: testPatientData.phoneNumber,
				address: testPatientData.address, email: testPatientData.email
			});
		});
	});

	describe('Get Patient From Data', () => {

		test('get patient from data', () => {
			const data = patientService.getPatientFromData(testPatientData);
			expect(data).toEqual({
				medicalId: testPatientData.medicalId,
				testResult: testPatientData.testResult,
				dob: testPatientData.dob,
				gender: testPatientData.gender,
				flagged: false,
				reviewed: false,
				reminded: false
			});
		});
	});

	describe('Get All Patient', () => {

		beforeEach(() => {

			rows = [testPatientData, testPatientData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('get all patients', async () => {
			const patients = await patientService.getAllPatients(userId);
			expect(patients).toEqual([testPatientData, testPatientData]);

		});
	});

	describe('Update Test Result', () => {

		beforeEach(() => {

			rows = [testPatientData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('update test result', async () => {
			try {
				await patientService.updateTestResult(userId, testPatientData.medicalId, 'true');
			} catch (e) {
				expect(e).toBeNaN();
			}
		});
	});

	describe('Flag Patient', () => {

		beforeEach(() => {

			rows = [testPatientData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('flag patient as doctor', async () => {
			try {
				await patientService.flagPatient(userId, testPatientData.medicalId, UserType.DOCTOR);
			} catch (e) {
				expect(e).toBeNaN();
			}

		});

		test('flag patient as authority', async () => {
			try {
				await patientService.flagPatient(userId, testPatientData.medicalId, UserType.HEALTH_OFFICIAL);
			} catch (e) {
				expect(e).toBeNaN();
			}

		});
	});

	describe('UnFlag Patient', () => {

		beforeEach(() => {

			rows = [testPatientData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('unflag patient as doctor', async () => {
			try {
				await patientService.unFlagPatient(userId, testPatientData.medicalId, UserType.DOCTOR);
			} catch (e) {
				expect(e).toBeNaN();
			}

		});

		test('unflag patient as authority', async () => {
			try {
				await patientService.unFlagPatient(userId, testPatientData.medicalId, UserType.HEALTH_OFFICIAL);
			} catch (e) {
				expect(e).toBeNaN();
			}

		});
	});

	describe('Report In Contact With', () => {

		beforeEach(() => {

			rows = [testPatientData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('report in contact with', async () => {
			try {
				await patientService.reportInContactWith(userId, testPatientData.medicalId,
					[{firstName: 'test', lastName: 'test', email: 'test', phoneNumber: 'test'}]);
			} catch (e) {
				expect(e).toBeNaN();
			}

		});
	});


	describe('Report In Contact With Error', () => {

		beforeEach(() => {

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([[]])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('report in contact with error', async () => {
			try {
				await patientService.reportInContactWith(userId, testPatientData.medicalId,
					[{firstName: 'test', lastName: 'test', email: 'test', phoneNumber: 'test'}]);
			} catch (e) {
				expect(e).toEqual(new Error('User does not exist'));
			}
		});
	});

	describe('Get My (patient) requested Symptoms', () => {

		beforeEach(() => {

			rows = [{name: 'fever', description: 'test'}];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('get my requested symptoms', async () => {
			const symptoms = await patientService.getMyRequestedSymptoms(userId, testPatientData.medicalId);
			expect(symptoms).toEqual([{name: 'fever', description: 'test'}]);
		});
	});

	describe('Submit Symptoms Response', () => {

		beforeEach(() => {

			rows = [testPatientData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();

			Container.set('mysql', mysql);
		});

		test('submit symptoms response', async () => {
			try {
				await patientService.submitSymptomsResponse(userId, testPatientData.medicalId,
					[{name: 'fever', description: 'test'}]);
			} catch (e) {
				expect(e).toBeNaN();
			}
		});
	});



});
