import {Router, NextFunction} from "express";
import {celebrate, Joi} from "celebrate";
import PatientService from "../../services/patient-service";
import {Container} from "typedi";
import middleware from "../middleware";
import {IUser} from "../../interfaces/IUser";
import {IPatientData} from "../../interfaces/IPatient";

const route = Router();

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
            const patientServiceInstance = Container.get(PatientService);
            patientServiceInstance.createUser(req.body as IPatientData).then(() => {
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

