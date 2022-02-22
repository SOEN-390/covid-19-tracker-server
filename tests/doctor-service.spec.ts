import PatientService from '../src/services/patient-service';
import DoctorService from '../src/services/doctor-service';
import { Container } from 'typedi';

describe('Doctor service unit-test', () => {

	let userId;
	let testDoctorData;
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

		rows = [testDoctorData, testDoctorData];

		const Mysql = jest.fn(() => ({
			query: jest.fn().mockReturnValue([rows])
		}));

		mysql = new Mysql();

		Container.set('mysql', mysql);

		doctorService = new DoctorService();
		Container.set(PatientService, doctorService);

	});

	describe('Get All Doctors', () => {

		test('get all doctors', async () => {
			const doctors = await doctorService.getAllDoctors(userId);
			expect(doctors).toEqual([testDoctorData, testDoctorData]);
		});

	});

});
