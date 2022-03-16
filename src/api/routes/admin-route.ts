import { Router } from 'express';
import middleware from '../middleware';
import { Container } from 'typedi';
import { getUserAuth } from '../middleware/userAuthData';
import { celebrate, Joi } from 'celebrate';
import AdminService from '../../services/admin-service';

const route = Router();

export default (app: Router) => {
	app.use('/admins', route);

	route.patch(
		'/patient/:medicalId/doctor/:licenseId/assign',
		middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				licenseId: Joi.string().required(),
				medicalId: Joi.string().required(),
			}),
		}),
		async (req, res, next) => {
			try {
				const userId = getUserAuth(req.headers).user_id;
				const adminServiceInstance = Container.get(AdminService);

				await adminServiceInstance.assignDoctor(
					userId,
					req.params.medicalId,
					req.params.license
				);

				return res.status(200).end();
			} catch (error) {
				return next(error);
			}
		}
	);

	route.patch(
		'/patient/:medicalId/doctor/:licenseId/unassign',
		middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				licenseId: Joi.string().required(),
				medicalId: Joi.string().required(),
			}),
		}),
		async (req, res, next) => {
			try {
				const userId = getUserAuth(req.headers).user_id;
				const adminServiceInstance = Container.get(AdminService);

				await adminServiceInstance.unassignDoctor(
					userId,
					req.params.medicalId,
					req.params.license
				);

				return res.status(200).end();
			} catch (error) {
				return next(error);
			}
		}
	);
};