import {Router} from "express";
import patientRoute from "./patient-route"

export default () => {
    const app = Router();
    patientRoute(app);
    return app;
}