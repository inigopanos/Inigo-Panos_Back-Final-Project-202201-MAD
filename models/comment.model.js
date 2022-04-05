import mongoose from 'mongoose';

export function commentCreator(modelName = 'Comment') {
    const commentSchema = new mongoose.Schema({
        author_id: { type: mongoose.Types.ObjectId, ref: 'User' },
        ruin_id: { type: mongoose.Types.ObjectId, ref: 'Ruin' },
        text: { type: String, required: true },
    });
    commentSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject.__v;
        },
    });

    let Comment;
    if (mongoose.default.models[modelName]) {
        Comment = mongoose.model(modelName);
    } else {
        Comment = mongoose.model(modelName, commentSchema);
    }
    return Comment;
}

export const Comment = commentCreator();
