import {Router} from "express";
import {celebrate, Joi} from "celebrate";
import DoctorService from "../../services/doctor-service";
import {Container} from "typedi";
import middleware from "../middleware";
import {IDoctorData} from "../../interfaces/IDoctor";
import {getUserAuth} from "../middleware/userAuthData";

const route = Router();


const Doctor_SCHEMA_MAP = {
    licenseId: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().required(),
    phoneNumber: Joi.string().required()
}


export default (app: Router) => {
    app.use('/doctors', route)

    route.get('/all', middleware.authenticateJWT, async (req, res, next) => {
        console.debug("Calling get all..");
        const userId = getUserAuth(req.headers).user_id;
        const doctorServiceInstance = Container.get(DoctorService);
        doctorServiceInstance.getDoctors(userId).then((doctor) => {
            return res.json(doctor);
        }).catch((error) => {
            return next(error);
        })
    });


   
    
}



