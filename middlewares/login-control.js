import { verifyToken } from '../services/auth.js';

export const loginRequired = (req, res, next) => {
    const authorization = req.get('authorization');
    let token;
    const tokenError = {
        message: 'token missing or invalid',
        status: '401',
        name: 'Unauthorized',
    };
    let decodedToken;

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
        decodedToken = verifyToken(token);
        if (typeof decodedToken === 'string') {
            next(tokenError);
        } else {
            req.tokenPayload = decodedToken;
            next();
        }
    } else {
        next(tokenError);
    }
};
