import express from 'express';
import {
    getAllRuins,
    updateRuin,
    addRuin,
    deleteRuin,
    getRuin,
    addFavorite,
    addVisited,
} from '../controllers/ruin.controller.js';
import {
    addComment,
    deleteComment,
} from '../controllers/comment.controller.js';
import { loginRequired } from '../middlewares/login-control.js';
import { adminRequired } from '../middlewares/isAdmin-control.js';

const router = express.Router();

router.get('/', getAllRuins);
router.get('/:id', getRuin);

router.post('/add', loginRequired, adminRequired, addRuin); //adminRequired
router.patch('/:id', loginRequired, adminRequired, updateRuin); //adminRequired
router.delete('/:id', loginRequired, adminRequired, deleteRuin); //adminRequired

router.patch('/:id/comment', loginRequired, addComment); //loginRequired
router.delete('/:id/comment/:commentId', loginRequired, deleteComment); //loginRequired

router.patch('/:id/user/favorites', loginRequired, addFavorite); //loginRequired
router.patch('/:id/user/visited', loginRequired, addVisited);
export default router;
