import {Router} from "express";
import middleware from "../middleware";
import {Container} from "typedi";
import UserService from "../../services/user-service";

const route = Router();
const admin = require('firebase-admin');


export default (app: Router) => {
    app.use('/users', route)


    route.get('/', middleware.authenticateJWT,
        async (req, res, next) => {
        console.debug("Calling get user..");
        const userId = await getUserAuth(req.headers);
        const userServiceInstance = Container.get(UserService);
            userServiceInstance.getUser(userId).then((user) => {
            return res.json(user);
        }).catch((error) => {
            return next(error);
        })
    });


}


const getUserAuth = async (reqHeaders: any): Promise<string> => {
    let jwtToken = reqHeaders && reqHeaders.authorization ? reqHeaders.authorization.split(" ")[1] : '';
    const data = await admin.auth().verifyIdToken(jwtToken);
    return data.uid;
}