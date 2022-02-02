import {Router, NextFunction} from "express";
import {celebrate, Joi} from "celebrate";
import PatientService from "../services/patient-service";
import {Container} from "typedi";

const route = Router();

export default (app: Router) => {
    app.use('/patients', route)


    route.get('/:id', celebrate({
        params: Joi.object({
            id: Joi.string().required()
        })
    }), async (req, res, next) => {
        console.debug("Calling get patient..");
        try {
            const patientServiceInstance = Container.get(PatientService);
            const result = await patientServiceInstance.helloWorld();
            return res.json(result);
        } catch (e) {
            return next(e);
        }
    });

}

