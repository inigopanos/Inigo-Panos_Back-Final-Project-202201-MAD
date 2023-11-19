import mongoose from 'mongoose';

export function ruinCreator(modelName = 'Ruin') {
    const ruinSchema = new mongoose.Schema({
        name: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String, required: true },
        link: {type: String, required: true},
        images: [{ type: String, required: true, sparse: true }],
        score: { type: Number, sparse: true },
        comments: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Comment',
                sparse: true,
            },
        ],
        coords:[{
            type: String
        }]
    });

    ruinSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject.__v;
        },
    });

    let Ruin;
    if (mongoose.default.models[modelName]) {
        Ruin = mongoose.model(modelName);
    } else {
        Ruin = mongoose.model(modelName, ruinSchema);
    }
    return Ruin;
}

export const Ruin = ruinCreator();
