import { Container } from 'typedi';
import AdminService from '../src/services/admin-service';
import { gender, testResult } from '../src/interfaces/IPatient';
import ImmigrationService from '../src/services/immigration-service';


describe('Immigration service unit-test', () => {

	let userId: string;
	let testPatientData;
	let mysql;
	let immigrationService: ImmigrationService;

	beforeEach(() => {

		userId = '1234';

		testPatientData = {
			medicalId: '12',
			firstName: 'demo',
			lastName: 'user',
			address: 'st-laurent',
			email: 'test@gmail.com',
			phoneNumber: '514-555-5555',
			testResult: testResult.POSITIVE,
			doctorName: 'demo doctor',
			dob: '01/01/1996',
			gender: gender.MALE,
			flagged: false,
			reminded: false,
			lastUpdated: new Date()
		};


		let rows = [testPatientData, testPatientData];

		const Mysql = jest.fn(() => ({
			query: jest.fn().mockReturnValue([rows])
		}));

		mysql = new Mysql();

		Container.set('mysql', mysql);

		immigrationService = new ImmigrationService();

	});

	describe('Get Flagged Patients', () => {

		test('get flagged patients', async () => {
			const patients = await immigrationService.getFlaggedPatients(userId);
			expect(patients).toEqual([testPatientData, testPatientData]);
		});
	});


	describe('Verify User', () => {

		test('verify user', async () => {
			try {
				await immigrationService.verifyUser(userId)
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});

	});
});
