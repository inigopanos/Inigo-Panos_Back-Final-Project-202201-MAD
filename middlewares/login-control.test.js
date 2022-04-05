import { loginRequired } from './login-control.js';
import { verifyToken } from '../services/auth.js';

jest.mock('../services/auth.js');

describe('Given a route intercepted by loginRequired', () => {
    let req;
    let res;
    let next;
    let tokenError;
    beforeEach(() => {
        tokenError = {
            message: 'token missing or invalid',
            status: '401',
            name: 'Unauthorized',
        };
        req = { params: {} };
        res = {};
        req.get = jest.fn();
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });
    describe('When authorization token is present', () => {
        describe('And token is valid', () => {
            test('Then call next', () => {
                req.get.mockReturnValue('bearer token');
                verifyToken.mockReturnValue({});
                loginRequired(req, res, next);
                expect(next).toHaveBeenCalledWith();
            });
        });
        describe('And token is not valid', () => {
            test('Then call next with error', () => {
                req.get.mockReturnValue('bearer token');
                verifyToken.mockReturnValue('bad token');
                loginRequired(req, res, next);
                expect(next).toHaveBeenCalledWith(tokenError);
            });
        });
    });
    describe('When authorization token is not present', () => {
        test('Then call next with error', () => {
            req.get.mockReturnValue('');
            loginRequired(req, res, next);
            expect(next).toHaveBeenCalledWith(tokenError);
        });
    });
});
