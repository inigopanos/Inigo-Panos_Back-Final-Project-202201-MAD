import { Ruin } from '../models/ruin.model.js';
import { User } from '../models/user.model.js';

// USER
export const getAllRuins = async (req, res, next) => {
    try {
        const resp = await Ruin.find({});
        res.status(200);
        res.json(resp);
    } catch (err) {
        next(err);
    }
};

export const addFavorite = async (req, res, next) => {
    try {
        let currentUser = await User.findById({ _id: req.tokenPayload.userId });

        const currentUserFavorites = currentUser.favorites.map((e) =>
            e.toString()
        );
        const isInFavorites = currentUserFavorites.some(
            (e) => e === req.params.id
        );

        let updatedUserFavorites;
        if (isInFavorites) {
            updatedUserFavorites = await User.findByIdAndUpdate(
                req.tokenPayload.userId,
                {
                    $pull: { favorites: req.params.id },
                },
                { new: true }
            );
        } else {
            updatedUserFavorites = await User.findByIdAndUpdate(
                req.tokenPayload.userId,
                {
                    $addToSet: { favorites: req.params.id },
                },
                { new: true }
            );
        }

        res.status(200);
        res.json(updatedUserFavorites);
    } catch (error) {
        next(error);
    }
};

export const addVisited = async (req, res, next) => {
    
    try {
        let currentUser = await User.findById({ _id: req.tokenPayload.userId });

        const currentUserVisited = currentUser.visited.map((e) => e.toString());
        const isInVisited = currentUserVisited.some((e) => e === req.params.id);
        let updatedUserVisited;

        if (isInVisited) {
            updatedUserVisited = await User.findByIdAndUpdate(
                req.tokenPayload.userId,
                {
                    $pull: { visited: req.params.id },
                },
                { new: true }
            );
        } else {
            updatedUserVisited = await User.findByIdAndUpdate(
                req.tokenPayload.userId,
                {
                    $addToSet: { visited: req.params.id },
                },
                { new: true }
            );
        }

        res.status(200);
        res.json(updatedUserVisited);
    } catch (error) {
        next(error);
    }
};

export const getRuin = async (req, res, next) => {
    try {
        const resp = await Ruin.findById(req.params.id).populate({
            path: 'comments',
            populate: [
                {
                    path: 'author_id',
                    select: 'userName',
                },
                {
                    path: 'ruin_id',
                    select: 'name',
                },
            ],
        });

        res.status(200);    
        res.json(resp);
    } catch (err) {
        next(err, 'no existe la ruina especificada.');
    }
};

export const deleteRuin = async (req, res, next) => {
    try {
        await Ruin.findByIdAndDelete(req.params.id);
        res.status(202);
        res.json({ 'Deleted Ruin': req.params.id });
    } catch (err) {
        next(err, 'no se ha podido borrar la ruina especificada.');
    }
};

export const updateRuin = async (req, res, next) => {
    try {
        const resp = await Ruin.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(201);
        res.json(resp);
    } catch (err) {
        next(err, 'no se ha podido actualizar la ruina especificada.');
    }
};

export const addRuin = async (req, res, next) => {
    try {
        const result = await Ruin.create(req.body);
        res.status(201);
        res.json(result);
    } catch (err) {
        next(err, 'no se ha podido crear la ruina especificada.');
    }
};
