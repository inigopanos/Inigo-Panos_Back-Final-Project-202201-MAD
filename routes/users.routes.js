import express from 'express';
import {
    userLogin,
    userRegister,
    getAllUsers,
    getUser,
    loginWithToken,
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/login/token', loginWithToken);
router.get('/', getAllUsers);
router.get('/:id', getUser);
export default router;
