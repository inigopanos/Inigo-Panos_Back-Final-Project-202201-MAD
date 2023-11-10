import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { createToken, verifyToken } from '../services/auth.js';

export async function userLogin(req, res, next) {
    const userData = {
        userName: req.body?.userName,
        password: req.body?.password,
        _id: req.body?.id,
    };

    const loginError = {
        message: 'Error, el usuario o contraseña no existe',
    };

    const resp = await User.findOne({
        userName: userData.userName,
    });

    console.log(resp, resp?.userName, userData?.userName);

    if (
        resp?.userName === userData?.userName &&
        bcrypt.compareSync(userData.password, resp.password)
    ) {
        userData._id = resp._id;
        let userId = userData._id;
        userId = userId.toString();
        console.log(userId);

        const token = createToken(userData);
        console.log('El token es: ', token, ' y el id: ', userId);

        const userFound = await User.findById(userId)
            .populate('comments')
            .populate('favorites', {
                name: 1,
            })
            .populate('visited', {
                name: 1,
            });

        res.json({ token, userId, userFound });
        return;
    } else {
        res.status(401);
        res.json(loginError);
    }
}

export const loginWithToken = async (req, res, next) => {
    const loginError = {
        message: 'Error, el token no existe',
    };

    const authorization = req.get('authorization');

    if (!authorization) {
        next(loginError);
    } else {
        let token;
        let decodedToken;

        if (authorization.toLowerCase().startsWith('bearer')) {
            token = authorization.substring(7);
            decodedToken = verifyToken(token);
            const userFound = await User.findById(decodedToken.userId)
                .populate({
                    path: 'comments',
                    populate: [
                        {
                            path: 'ruin_id', // MODELO COMMENT
                            select: 'name',
                        },
                    ],
                })
                .populate('favorites', {
                    name: 1,
                })
                .populate('visited', {
                    name: 1,
                });

            let userId = userFound._id;
            userId = userId.toString();
            console.log(userFound, ' userFound en loginWith token');
            res.json({ token, userId, userFound });
        }
    }
};

export const getAllUsers = async (req, res, next) => {
    console.log(req.body);
    try {
        const resp = await User.find({});
        res.json(resp);
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    console.log(req.body, 'getUser en userController');
    try {
        const resp = await User.findById(req.params.id)
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'ruin_id', // MODELO COMMENT
                        select: 'name',
                    },
                ],
            })
            .populate('favorites', {
                name: 1,
            })
            .populate('visited', {
                name: 1,
            });

        console.log(resp, ' resp en getUser en back');
        res.status(200);
        res.json(resp);
    } catch (err) {
        next(err, 'no existe el usuario especificado.');
    }
};

export async function userRegister(req, res) {
    console.log(req.body);
    if ((req.body.userName && req.body.password) !== '') {
        const encryptedPasswd = bcrypt.hashSync(req.body.password);

        const userData = { ...req.body, password: encryptedPasswd };

        const result = await User.create(userData);

        res.status(201);
        res.json(result);
    } else {
        res.status(400);
        const registerError = {
            message: 'Error, no ha introducido usuario o contraseña',
        };
        res.json(registerError);
    }
}
