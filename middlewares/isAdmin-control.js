import { User } from '../models/user.model.js';

export const adminRequired = async (req, res, next) => {
    let token = req.tokenPayload;
    const user = await User.findById(token.userId);
    if (user.isAdmin) {
        next();
    } else {
        const userError = new Error('not authorized user');
        console.log(res.status);
        res.status(401);
        res.json(userError);
    }
};
