import mongoose from 'mongoose';

export function coordCreator(modelName = 'Coords') {
    const coordsSchema = new mongoose.Schema([{
       lng: {type: Number},
       lat: {type: Number}
    }]);
    coordsSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject.__v;
        },
    });

    let coords;
    if (mongoose.default.models[modelName]) {
        coords = mongoose.model(modelName);
    } else {
        coords = mongoose.model(modelName, coordsSchema);
    }
    return coords;
}

export const coords = coordsCreator();
