import {Router} from "express";
import {celebrate, Joi} from "celebrate";
import PatientService from "../../services/patient-service";
import {Container} from "typedi";
import middleware from "../middleware";
import {IPatientData} from "../../interfaces/IPatient";

const route = Router();
const admin = require('firebase-admin');

const PATIENT_SCHEMA_MAP = {
    medicalId: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    testResults: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().required(),
    phoneNumber: Joi.string().required()
}


export default (app: Router) => {
    app.use('/patients', route)


    route.post('/create', middleware.authenticateJWT, celebrate({
        body: Joi.object(PATIENT_SCHEMA_MAP)
    }), async (req, res, next) => {
        console.debug("Calling get patient..");
        const userId = await getUserAuth(req.headers);
        const patientServiceInstance = Container.get(PatientService);
        patientServiceInstance.createUser(userId, req.body as IPatientData).then(() => {
            return res.status(200).end();
        }).catch((error) => {
            return next(error);
        });
    });

    route.get('/:id', middleware.authenticateJWT, celebrate({
        params: Joi.object({
            id: Joi.string().required()
        })
    }), async (req, res, next) => {
        console.debug("Calling get patient..");
        try {

        } catch (e) {
            return next(e);
        }
    });
}

const getUserAuth = async (reqHeaders: any): Promise<string> => {
    let jwtToken = reqHeaders && reqHeaders.authorization ? reqHeaders.authorization.split(" ")[1] : '';
    const data = await admin.auth().verifyIdToken(jwtToken);
    return data.uid;
}