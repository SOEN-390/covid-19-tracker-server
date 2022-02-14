import PatientService from "../src/services/patient-service";
import {Container} from "typedi";
import {testResult} from "../src/interfaces/IPatient";

describe('Patient service unit-test', () => {

    let userId;
    let testPatientData;
    let testPatient;
    let testConfirmed;
    let testUser;

    let patientService: PatientService;
    let mysql;

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

        testUser = [testPatientData.id, testPatientData.firstName,
            testPatientData.lastName, testPatientData.phoneNumber,
            testPatientData.address, testPatientData.email];

        testPatient = {
            medicalId: testPatientData.medicalId,
            testResult: testPatientData.testResult
        }

        testConfirmed = {
            medicalId: testPatientData.medicalId,
            flagged: false
        }

        let Mysql = jest.fn(() => ({
            query: jest.fn(async () => { return Object})
        }));

        mysql = new Mysql();

        Container.set('mysql', mysql);

        patientService = new PatientService();
        Container.set(PatientService, patientService);

    });

    describe("Create User", () => {

        test('create user', async () => {

            expect(await patientService.createUser(userId, testPatientData)).not.toThrowError();
        });

    });

    describe("Get Patient with Medical ID", () => {


        test('get patient with id', () => {

        });

        test('verify user', () => {

        });

    });


});