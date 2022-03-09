const admin = require('firebase-admin');

const authenticateJWT = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const idToken = authHeader.split(' ')[1];
		if (!idToken) {
			return res.sendStatus(403);
		}
		admin
			.auth()
			.verifyIdToken(idToken)
			.then(function (decodedToken) {
				return next();
			})
			.catch(function (error) {
				console.log(error);
				return res.sendStatus(403);
			});
	} else {
		res.sendStatus(401);
	}
};

export default authenticateJWT;
