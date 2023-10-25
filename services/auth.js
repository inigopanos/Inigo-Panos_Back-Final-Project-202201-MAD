import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export function createToken(user) {
    console.log(user, ' user de createToken');
    const payload = { userName: user.userName, userId: user._id };
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret);
    return token;
}

/**
 * @description Función que devuelve un JWS token
 * @param {string} user
 * @returns {string} token
 * @author Íñigo
 */

export function verifyToken(token) {
    const secret = process.env.SECRET;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return error.message;
    }
}
