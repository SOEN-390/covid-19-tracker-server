import {Router} from "express";
import patientRoute from "./patient-route"
import userRoute from "./user-route";

export default () => {
    const app = Router();
    patientRoute(app);
    userRoute(app);
    return app;
}