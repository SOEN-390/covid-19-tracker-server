import { Router } from 'express';
import doctorRoute from './doctor-route';
import patientRoute from './patient-route';
import userRoute from './user-route';
import adminRoute from './admin-route';

export default () => {
	const app = Router();
	patientRoute(app);
	doctorRoute(app);
	userRoute(app);
	adminRoute(app);
	return app;
};
