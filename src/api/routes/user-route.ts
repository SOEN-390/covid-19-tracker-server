import { Router } from 'express';
import middleware from '../middleware';
import { Container } from 'typedi';
import UserService from '../../services/user-service';
import { getUserAuth } from '../middleware/userAuthData';

const route = Router();

export default (app: Router) => {

	app.use('/users', route);

	route.get('/', middleware.authenticateJWT,
		async (req, res, next) => {
			console.debug('Calling get user..');
			const userId = getUserAuth(req.headers).user_id;
			const userServiceInstance = Container.get(UserService);
			userServiceInstance.getUser(userId).then((user) => {
				return res.json(user);
			}).catch((error) => {
				return next(error);
			});
		}
	);

};
