import PatientService from "../src/services/patient-service";
import {Container} from "typedi";
import {testResult} from "../src/interfaces/IPatient";

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
        }


        rows = [{
            firstName: 'demo',
            lastName: 'user', testResult: testResult.POSITIVE
        }];

        let Mysql = jest.fn(() => ({
            query: jest.fn().mockReturnValue([rows])
        }));

        mysql = new Mysql();

        Container.set('mysql', mysql);

        patientService = new PatientService();
        Container.set(PatientService, patientService);

    });

    describe("Create User", () => {

        test('create user', async () => {

            try {
                await patientService.createUser(userId, testPatientData);
            } catch (e) {
                expect(e).toBeNaN();
            }

        });

    });

    describe("Get Patient with Medical ID", () => {


        test('get patient with id', async () => {
            let profile = await patientService.getPatientWithId(userId, testPatientData.medicalId);
            expect(profile).toEqual({
                firstName: 'demo',
                lastName: 'user', testResult: testResult.POSITIVE
            });

        });


    });

    describe("Get All Patient", () => {


        test('get all patients', async () => {
            let patients = await patientService.getAllPatients(userId);
            expect(patients).toEqual([{
                firstName: 'demo',
                lastName: 'user', testResult: testResult.POSITIVE
            }]);

        });


    });


});