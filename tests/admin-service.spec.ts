import { ISymptom } from '../src/interfaces/ISymptom';
import { Container } from 'typedi';
import AdminService from '../src/services/admin-service';


describe('Admin service unit-test', () => {

	let userId: string;
	let medicalId: string;
	let testDoctorData;
	let symptom: ISymptom;
	let mysql;
	let adminService: AdminService;

	beforeEach(() => {

		userId = '1234';
		medicalId = '55';
		symptom = {
			name: 'test',
			description: 'symptom'
		};

		testDoctorData = {
			licenseId: '12',
			firstName: 'demo',
			lastName: 'doctor',
			address: 'st-laurent',
			email: 'test@gmail.com',
			phoneNumber: '514-555-5555',
		};

		let rows = [testDoctorData, testDoctorData];

		const Mysql = jest.fn(() => ({
			query: jest.fn().mockReturnValue([rows])
		}));

		mysql = new Mysql();

		Container.set('mysql', mysql);

		adminService = new AdminService();

	});

	describe('Un-Assign Doctor From Patient', () => {

		test('unassign doctors', async () => {
			try {
				await adminService.unassignDoctor(userId, medicalId, testDoctorData.licenseId);
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});

	});

	describe('Assign Doctor to Patient', () => {

		test('assign doctors', async () => {
			try {
				await adminService.assignDoctor(userId, medicalId, testDoctorData.licenseId);
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});

	});

	describe('Add new Symptom', () => {

		test('add new symptoms', async () => {
			try {
				await adminService.addNewSymptom(userId, symptom);
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});

	});

	describe('Verify User', () => {

		test('verify user', async () => {
			try {
				await adminService.verifyUser(userId)
			}
			catch (e) {
				expect(e).toBeNaN();
			}
		});

	});

});
