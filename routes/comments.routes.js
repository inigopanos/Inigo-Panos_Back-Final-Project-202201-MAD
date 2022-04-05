import express from 'express';
import { addComment } from '../controllers/comment.controller.js';
import { adminRequired } from '../middlewares/isAdmin-control.js';
import { loginRequired } from '../middlewares/login-control.js';

const router = express.Router();

router.post('/', loginRequired, adminRequired, addComment);

export default router;
