import jwt_decode from "jwt-decode";


const getUserAuth = (reqHeaders: any): any => {
    const jwtToken = reqHeaders && reqHeaders.authorization ? reqHeaders.authorization.split(" ")[1] : '';
    return jwt_decode(jwtToken);
}

export {getUserAuth};