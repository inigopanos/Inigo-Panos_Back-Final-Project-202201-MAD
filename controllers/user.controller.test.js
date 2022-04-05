import * as controller from './user.controller.js';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { createToken } from '../services/auth.js';

jest.mock('../models/user.model.js');
jest.mock('../services/auth.js');
jest.mock('bcryptjs');

describe('Given the user controller', () => {
    let req;
    let res;
    let resp;
    let next;

    beforeEach(() => {
        req = { params: {}, body: {}, authorization: {} };
        res = {};
        resp = { userName: '', password: '' };

        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    describe('When getAllUsers is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                User.find.mockReturnValue({
                    populate: jest.fn().mockResolvedValue([]),
                });
            });
            test('Then the call is sent', async () => {
                await controller.getAllUsers(req, res);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And it does not work', () => {
            beforeEach(() => {
                User.find.mockRejectedValue('null');
            });

            test('Then next is called', async () => {
                await controller.getAllUsers(req, res, next);
                expect(next).toHaveBeenCalledWith(err);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When getUser is called', () => {
        describe('And it works', () => {
            beforeEach(() => {
                User.findById.mockResolvedValue([
                    {
                        userName: 'MockName',
                        password: 'MockPassword',
                    },
                ]);
            });

            test('Then call json', async () => {
                await controller.getUser(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });

        describe('And it does not work (promise is rejected)', () => {
            test('Then call next', async () => {
                User.findById.mockRejectedValue('Test error');
                await controller.getUser(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When loginWithToken is called', () => {
        describe('And there is no token', () => {
            test('Then call next', async () => {
                authorization = null;
                await controller.loginWithToken(req, res, next);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Error, el roken no existe',
                });
            });
        });

        describe('And it is correct', () => {
            test('Then populate and return a user', async () => {
                beforeEach(() => {
                    User.findById.mockResolvedValue([
                        {
                            userName: 'MockName',
                            password: 'MockPassword',
                        },
                    ]);
                });

                test('Then call json', async () => {
                    await controller.loginWithToken(req, res, next);
                    expect(res.json).toHaveBeenCalled();
                });
            });
        });
    });

    describe('When loginUser is called', () => {
        describe('And there is no userName', () => {
            beforeEach(() => {
                User.findOne.mockReturnValue({
                    populate: jest.fn().mockResolvedValue(null),
                });
            });

            test('Then call next', async () => {
                await controller.userLogin(req, res, next);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Error, el usuario o contraseña no existe',
                });
            });
        });

        describe('And there is no password', () => {
            beforeEach(() => {
                User.findOne.mockReturnValue({
                    populate: jest.fn().mockResolvedValue(null),
                });
            });
            test('Then call next', async () => {
                await controller.userLogin(req, res, next);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Error, el usuario o contraseña no existe',
                });
            });
        });

        describe('And there are user name or passwd', () => {
            beforeEach(async () => {
                resp.userName = await User.findOne.mockResolvedValue('Pepe');
            });

            describe('And both are correct', () => {
                test('Then create a token', async () => {
                    const user = {
                        name: 'Pepe',
                        id: '1',
                    };
                    await User.findOne.mockResolvedValue(user);
                    bcrypt.compareSync.mockReturnValue(true);
                    createToken.mockReturnValue('mock_token');
                    await controller.userLogin(req, res);
                    expect(res.json).toHaveBeenCalledWith({
                        token: 'mock_token',
                    });
                });
            });
        });
    });

    describe('When registerUser is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                req.body = { email: 'pepe@gmail.com', passwd: '1234' };
                bcrypt.hashSync.mockResolvedValue('encrypted1234');
                User.mockReturnValue({
                    email: 'pepe@gmail.com',
                    passwd: 'encrypted1234',
                    id: 1,
                });
            });
            test('Then call json', async () => {
                const userMock = {
                    email: 'pepe@gmail.com',
                    passwd: '12345',
                };
                User.create.mockResolvedValue(userMock);
                await controller.userRegister(req, res, next);
                await expect(res.json).toHaveBeenCalledWith({
                    email: 'pepe@gmail.com',
                    passwd: '12345',
                });
            });
        });
        describe('And it does not work', () => {
            test('Then return an error', () => {
                 const userMock = {
                    email: '',
                    passwd: '',
                };
                const registerError = {
                    message: 'Error, no ha introducido usuario o contraseña',
                };
                 await controller.userRegister(req, res, next);
                 expect(res.status).toBe(400);
                 expect(res.json).toHaveBeenCalledWith({
                   registerError
                });
            });
        });
    });
});
