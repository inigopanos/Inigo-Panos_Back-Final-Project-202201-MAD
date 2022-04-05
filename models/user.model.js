import mongoose from 'mongoose';

export function userCreator(modelName = 'User') {
    const userSchema = new mongoose.Schema({
        userName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean },
        comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
        favorites: [{ type: mongoose.Types.ObjectId, ref: 'Ruin' }],
        visited: [{ type: mongoose.Types.ObjectId, ref: 'Ruin' }],
    });
    userSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject.__v;
            delete returnedObject.passwd;
        },
    });

    let User;
    if (mongoose.default.models[modelName]) {
        User = mongoose.model(modelName);
    } else {
        User = mongoose.model(modelName, userSchema);
    }
    return User;
}

export const User = userCreator();
