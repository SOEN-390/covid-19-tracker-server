import { gender, testResult, UserType } from '../src/interfaces/IPatient';
import UserService from '../src/services/user-service';
import { Container } from 'typedi';
import { IUserReturnData } from '../src/interfaces/IUser';

describe('User service unit-test', () => {

	let userId;
	let testUserData: IUserReturnData;
	let userService: UserService;
	let mysql;

	beforeAll(() => {

		userId = '1234';

		testUserData = {
			firstName: 'test',
			lastName: 'testian',
			id: userId,
			address: 'helo',
			email: 'demo@demo.com',
			phoneNumber: '000000',
			role: 'admin'
		}

		userService = new UserService();

	});


	describe('User Not found', () => {

		beforeEach(() => {
			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([[]])
			}));

			mysql = new Mysql();
			Container.set('mysql', mysql);
		});

		test('User does not exist error', async () => {
			try {
				await userService.getUser(userId);
			} catch (error) {
				expect(error).toEqual(new Error('User does not exist'));
			}
		});

	});


	describe('Get Authority', () => {

		beforeEach(() => {
			const rows = [{privilege: 'admin'}];
			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();
			Container.set('mysql', mysql);
		});

		test('get admin', async () => {
			const privilege = await userService.getAuthority(userId);
			expect(privilege).toEqual('admin');

		});

	});

	describe('Get Patient', () => {

		beforeEach(() => {
			const rows = [{medicalId: '1', testResult: testResult.POSITIVE}];
			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();
			Container.set('mysql', mysql);
		});

		test('get patient', async () => {
			const testResult = await userService.getPatient(userId);
			expect(testResult).toEqual({'medicalId': '1', 'testResult': 'positive'});

		});

	});

	describe('Get Doctor', () => {

		beforeEach(() => {
			const rows = [{firstName: 'doctor'}];
			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();
			Container.set('mysql', mysql);
		});

		test('get doctor', async () => {
			try {
				await userService.getDoctor(userId);
			} catch (e) {
				expect(e).toBeNaN();
			}

		});

	});


	describe('Get User Authority', () => {

		beforeEach(() => {

			jest.spyOn(userService, "getAuthority").mockImplementation(async ()=> {
				return 'admin';
			});

			const rows = [testUserData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();
			Container.set('mysql', mysql);
		});

		test('get user that is authority', async () => {


			const user = await userService.getUser(userId);
			expect(user).toEqual(testUserData);

		});

		afterEach(()=> {
			jest.clearAllMocks();
		});

	});

	describe('Get User Doctor', () => {

		beforeEach(() => {

			jest.spyOn(userService, "getDoctor").mockImplementation(async ()=> {
				return '123';
			});

			jest.spyOn(userService, "getAuthority").mockImplementation(async ()=> {
				throw new Error('Not Authority');
			});

			const rows = [testUserData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();
			Container.set('mysql', mysql);
		});

		test('get user that is doctor', async () => {

			testUserData.licenseId = '123';
			testUserData.role = 'doctor'

			const user = await userService.getUser(userId);
			expect(user).toEqual(testUserData);

		});

		afterEach(()=> {
			jest.clearAllMocks();
		});

	});

	describe('Get User Patient', () => {

		beforeEach(() => {

			jest.spyOn(userService, "getDoctor").mockImplementation(async ()=> {
				throw new Error('Not Doctor');
			});

			jest.spyOn(userService, "getAuthority").mockImplementation(async ()=> {
				throw new Error('Not Authority');
			});

			jest.spyOn(userService, "getPatient").mockImplementation(async ()=> {
				return {medicalId: '1',
					testResult: testResult.POSITIVE,
					dob: '00',
					gender: gender.MALE}
			});

			const rows = [testUserData];

			const Mysql = jest.fn(() => ({
				query: jest.fn().mockReturnValue([rows])
			}));

			mysql = new Mysql();
			Container.set('mysql', mysql);
		});

		test('get user that is patient', async () => {

			const user = await userService.getUser(userId);
			expect(user).toEqual({
				firstName: 'test',
				lastName: 'testian',
				id: userId,
				address: 'helo',
				email: 'demo@demo.com',
				phoneNumber: '000000',
				role: 'patient',
				medicalId: '1',
				testResult: testResult.POSITIVE,
				dob: '00',
				gender: gender.MALE
			});

		});

		afterEach(()=> {
			jest.clearAllMocks();
		});

	});

});
