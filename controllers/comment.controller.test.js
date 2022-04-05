import * as controller from './comment.controller.js';
import { Ruin } from '../models/ruin.model.js';
import { Comment } from '../models/comment.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

jest.mock('../models/ruin.model.js');
jest.mock('../models/comment.model.js');
jest.mock('../models/user.model.js');
jest.mock('../services/auth.js');

describe('Given the ruin controller', () => {
    let req;
    let res;
    let next;
    let mockComment;
    let userId;

    beforeEach(() => {
        req = { params: {}, tokenPayload: {}, body: {} };

        res = {};

        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();

        userId = '6230785357282c2abf249e6b';

        mockComment = {
            author_id: '1234',
            ruin_id: '6789',
            text: 'mockText',
        };

        // mockUser = {
        //     userName: 'pepe',
        //     password: '1111',
        // };
    });

    describe('When addComment is called', () => {
        describe('And it works', () => {
            test('should return the posted comment', async () => {
                Comment.create.mockResolvedValue([mockComment]);
                await controller.addComment(req, res);

                const resp = User.findByIdAndUpdate.mockResolvedValue({
                    userName: 'pepe',
                    password: '1111',
                });
                const respRuin = Ruin.findById.mockResolvedValue({
                    name: 'Segovia',
                    description: 'Acueducto',
                });
                const resultOfPopulates = {
                    resp,
                    respRuin,
                };
                expect(res.json).toHaveBeenCalled();
                expect(res.status).toBe(201);
                expect(res.json).toHaveBeenCalledWith(resultOfPopulates);
            });
        });

        describe('And it does not work (promise is rejected)', () => {
            test('Then call next', async () => {
                Comment.create.mockRejectedValue('Test error');
                await controller.addComment(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When deleteComment is called', () => {
        describe('And it works', () => {
            beforeEach(() => {
                Comment.findByIdAndDelete.mockResolvedValue([
                    {
                        'Delete Comment': 12,
                    },
                ]);
            });

            test('Then call json', async () => {
                await controller.deleteComment(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });

        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                Comment.findByIdAndDelete.mockRejectedValue('Test error');
                await controller.deleteComment(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
