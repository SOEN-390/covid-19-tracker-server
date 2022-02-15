import {testResult} from "../src/interfaces/IPatient";


describe('User service unit-test', () => {

    let userId;
    let testPatient;
    let testDoctor;
    let testImmigrationOfficer;
    let testAdmin;
    let testHealthOfficial;

    beforeEach(() => {

        userId = '1234';

        testPatient = {
            firstName: 'demo',
            lastName: 'patient',
            address: 'boul. demo',
            email: 'demo@demo.com',
            phoneNumber: '000-000-0000',
            testResult: testResult.POSITIVE,
            role: 'patient'
        }

        testDoctor = {
            firstName: 'demo',
            lastName: 'doctor',
            address: 'boul. demo',
            email: 'doctor@demo.com',
            phoneNumber: '000-000-0000',
            role: 'doctor'
        }

        testImmigrationOfficer = {
            firstName: 'demo',
            lastName: 'officer',
            address: 'boul. demo',
            email: 'immigration@demo.com',
            phoneNumber: '000-000-0000',
            role: 'immigration_officer'
        }

        testAdmin = {
            firstName: 'demo',
            lastName: 'admin',
            address: 'boul. demo',
            email: 'admin@demo.com',
            phoneNumber: '000-000-0000',
            role: 'admin'
        }

        testHealthOfficial = {
            firstName: 'demo',
            lastName: 'official',
            address: 'boul. demo',
            email: 'official@demo.com',
            phoneNumber: '000-000-0000',
            role: 'health_official'
        }


    });

    describe('Get User with UserID (token)', () => {

        test('get admin',  () => {

        });

        test('get immigration officer',  () => {

        });

        test('get health official',  () => {

        });

        test('get doctor',  () => {

        });

        test('get patient',  () => {

        });

    });




});