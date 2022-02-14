import PatientService from "../src/services/patient-service";
import {Container} from "typedi";
import {testResult} from "../src/interfaces/IPatient";
import mysql from 'mysql'
import {callbackify} from "util";

describe('Patient service unit-test', () => {


    let userId;
    let testPatientData;
    let testPatient;
    let testConfirmed;
    let testUser;

    let patientService: PatientService;

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

        patientService = new PatientService();
        Container.set(PatientService, patientService);


        mysql.query = jest.fn(() => callbackify(args));

        Container.set('mysql', mysql);

    });

    describe("Create User", () => {

        test('create user', async () => {
            await expect(patientService.createUser(userId, testPatientData)).resolves.toThrowError()
        });

    });

    describe("Get Patient with Medical ID", () => {


        test('get patient with id', () => {

        });

        test('verify user', () => {

        });

    });


});