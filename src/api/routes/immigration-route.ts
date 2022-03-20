import { Router } from 'express';
import middleware from '../middleware';
import { Container } from 'typedi';
import { getUserAuth } from '../middleware/userAuthData';
import { celebrate, Joi } from 'celebrate';
import ImmigrationService from '../../services/immigration-service';

const route = Router();

export default (app: Router) => {

	app.use('/immigrations', route);

	route.get('/:userId/patients/flagged', middleware.authenticateJWT,
		async (req, res, next) => {
			console.debug('Calling get flagged patients for immigration..');
			const userId = getUserAuth(req.headers).user_id;
			const immigrationServiceInstance = Container.get(ImmigrationService);
			immigrationServiceInstance.getFlaggedPatients(userId).then((user) => {
				return res.json(user);
			}).catch((error) => {
				return next(error);
			});
		}
	);

};
