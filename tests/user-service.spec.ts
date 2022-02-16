import {testResult} from "../src/interfaces/IPatient";
import UserService from "../src/services/user-service";
import {Container} from "typedi";


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

            let Mysql = jest.fn(() => ({
                query: jest.fn().mockReturnValue([[]])
            }));

            mysql = new Mysql();
            Container.set('mysql', mysql);
        });

        test('User does not exist error', async () => {
            try {
                await userService.getUser(userId)
            }
            catch (error) {
                expect(error).toEqual(new Error('User does not exist'));
            }

        });
    });


    describe('Get Authority', () => {

        beforeEach(() => {
            let rows = [{privilege: 'admin'}];
            let Mysql = jest.fn(() => ({
                query: jest.fn().mockReturnValue([rows])
            }));

            mysql = new Mysql();
            Container.set('mysql', mysql);
        });


        test('get admin',  async () => {
            let privilege = await userService.getAuthority(userId);
            expect(privilege).toBe('admin');

        });
    });

    describe('Get Patient', () => {

        beforeEach(() => {
            let rows = [{testResult: testResult.POSITIVE}]
            let Mysql = jest.fn(() => ({
                query: jest.fn().mockReturnValue([rows])
            }));

            mysql = new Mysql();
            Container.set('mysql', mysql);
        });


        test('get patient',  async () => {
            let testResult = await userService.getPatient(userId);
            expect(testResult).toBe('positive');

        });
    });

    describe('Get Doctor', () => {

        beforeEach(() => {
            let rows = [{firstName: 'doctor'}];
            let Mysql = jest.fn(() => ({
                query: jest.fn().mockReturnValue([rows])
            }));

            mysql = new Mysql();
            Container.set('mysql', mysql);
        });


        test('get doctor',  async () => {
            try {
                await userService.getDoctor(userId)
            } catch (e) {
                expect(e).toBeNaN();
            }

        });


    });


});