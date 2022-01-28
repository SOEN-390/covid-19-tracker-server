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
    }), (req,res,next) => {
        const patientServiceInstance = Container.get(PatientService);
        const result = patientServiceInstance.helloWorld();
        res.send(result);
    });

}

