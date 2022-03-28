import { Router } from 'express';
import doctorRoute from './doctor-route';
import patientRoute from './patient-route';
import userRoute from './user-route';
import adminRoute from './admin-route';
import immigrationRoute from './immigration-route';

export default () => {
	const app = Router();
	userRoute(app);
	patientRoute(app);
	doctorRoute(app);
	adminRoute(app);
	immigrationRoute(app);
	return app;
};
