import { Comment } from '../models/comment.model.js';
import { Ruin } from '../models/ruin.model.js';
import { User } from '../models/user.model.js';

export const deleteComment = async (req, res, next) => {
    console.log(req.body);
    try {
        const { id: ruinId, commentId } = req.params;
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        console.log(deletedComment, ' Comentario borrado');

        const resposne = await Ruin.findByIdAndUpdate(
            ruinId,
            {
                $pull: { comments: commentId },
            },
            { new: true }
        );

        const userId = req.tokenPayload.userId;
        console.log(userId, 'ID DEL USUARIO DEL COMENTARIO');
        const responseUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: { comments: commentId },
            },
            { new: true }
        );

        const response = await Ruin.findById(ruinId).populate({
            path: 'comments',
            populate: [
                {
                    path: 'author_id', // MODELO COMMENT
                    select: 'userName',
                },
                {
                    path: 'ruin_id', // MODELO COMMENT
                    select: 'name',
                },
            ],
        });

        const resultOfPopulates = {
            response,
            responseUser,
        };
        res.status(202);
        res.json(resultOfPopulates);
    } catch (err) {
        next(err, 'no se ha podido borrar el comentario especificado.');
    }
};

export const addComment = async (req, res, next) => {
    // console.log(req.tokenPayload, 'req recibido en addComment');
    console.log(req.body, 'req.body recibido en addComment');
    try {
        const ruinId = req.body.ruin_id;
        const userId = req.tokenPayload.userId;

        const result = await Comment.create(req.body);

        const commentId = result._id.toString();
        const resp = await Ruin.findByIdAndUpdate(
            ruinId,
            {
                $push: { comments: commentId },
            },
            { new: true }
        ).populate('comments');

        const responseUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: { comments: commentId },
            },
            { new: true }
        );
        const response = await Ruin.findById(ruinId).populate({
            path: 'comments',
            populate: [
                {
                    path: 'author_id', // MODELO COMMENT
                    select: 'userName',
                },
                {
                    path: 'ruin_id', // MODELO COMMENT
                    select: 'name',
                },
            ],
        });

        const resultOfPopulates = {
            response,
            responseUser,
        };
        console.log('Comentario creado: ', resp);
        console.log('Ruina actualizada, ', response);
        console.log('Usuario actualizado, ', responseUser);
        res.status(201);
        res.json(resultOfPopulates);
    } catch (err) {
        next(err, 'no se ha podido crear el comentario especificado.');
    }
};
