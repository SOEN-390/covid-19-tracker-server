import { Router } from 'express';
import middleware from '../middleware';
import { Container } from 'typedi';
import { getUserAuth } from '../middleware/userAuthData';
import { celebrate, Joi } from 'celebrate';
import AdminService from '../../services/admin-service';
import { ISymptom } from '../../interfaces/ISymptom';

const route = Router();

export default (app: Router) => {
	app.use('/admins', route);

	
	route.patch('/patient/:medicalId/doctor/:licenseId/assign', middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				licenseId: Joi.string().required(),
				medicalId: Joi.string().required(),
			}),
		}),
		async (req, res, next) => {
			console.debug('Calling assign patient to doctor..');
			try {
				const userId = getUserAuth(req.headers).user_id;
				const adminServiceInstance = Container.get(AdminService);

				await adminServiceInstance.assignDoctor(
					userId,
					req.params.medicalId,
					req.params.licenseId
				);

				return res.status(200).end();
			} catch (error) {
				return next(error);
			}
		}
	);

	route.patch(
		'/patient/:medicalId/doctor/:licenseId/un-assign',
		middleware.authenticateJWT,
		celebrate({
			params: Joi.object({
				licenseId: Joi.string().required(),
				medicalId: Joi.string().required(),
			}),
		}),
		async (req, res, next) => {
			console.debug('Calling un-assign patient from doctor..');
			try {
				const userId = getUserAuth(req.headers).user_id;
				const adminServiceInstance = Container.get(AdminService);

				await adminServiceInstance.unassignDoctor(
					userId,
					req.params.medicalId,
					req.params.licenseId
				);

				return res.status(200).end();
			} catch (error) {
				return next(error);
			}
		}
	);

	route.post('/symptom', middleware.authenticateJWT, celebrate({
		body: Joi.object({
			symptom: Joi.object({
				name: Joi.string().required(),
				description: Joi.string().required(),
			})
		}),
	}),
	async (req, res, next) => {
		console.debug('Calling add symptom as admin..');
		try {
			const userId = getUserAuth(req.headers).user_id;
			const adminServiceInstance = Container.get(AdminService);
			await adminServiceInstance.addNewSymptom(userId, req.body.symptom as ISymptom);
			return res.status(200).end();
		} catch (error) {
			return next(error);
		}
	}
	);

};
