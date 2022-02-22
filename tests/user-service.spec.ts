import { testResult } from '../src/interfaces/IPatient';
import UserService from '../src/services/user-service';
import { Container } from 'typedi';

describe('User service unit-test', () => {

	let userId;

	let userService: UserService;
	let mysql;

	beforeAll(() => {

		userId = '1234';

		userService = new UserService();
		Container.set(UserService, userService);

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
			expect(privilege).toBe('admin');

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

});
