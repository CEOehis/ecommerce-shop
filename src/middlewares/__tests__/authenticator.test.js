import Authenticator from '../authenticator';
import Token from '../../utils/token';

const { authenticateUser } = Authenticator;

describe('authenticator middleware', () => {
  describe('authenticateUser', () => {
    const req = {
      headers: {},
    };
    const res = {};

    it('should always call next()', () => {
      const nextSpy = jest.fn();
      authenticateUser(req, res, nextSpy);
      expect(nextSpy).toHaveBeenCalled();
    });

    it('should call next() with an error if no token is provided in authorization header', () => {
      req.headers = {};
      const nextSpy = jest.fn();
      authenticateUser(req, res, nextSpy);
      expect(nextSpy.mock.calls[0][0].message).toBe('no token provided');
    });

    it('should call next() with an error if token not supplied as Bearer', () => {
      req.headers = {
        authorization: 'NotBearer some.token',
      };
      const nextSpy = jest.fn();
      authenticateUser(req, res, nextSpy);
      expect(nextSpy).toHaveBeenCalled();
      expect(nextSpy.mock.calls[0][0].message).toBe('Invalid authorization format');
    });

    it('should call next() with a jwt error if malformed/invalid token provided', () => {
      req.headers = {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTM1NzkyNDUxLCJleHAiOjE1MzU4MDY4NTF9.YRbv4jmOgacT2gA4glNZwKBYybaMODbObtkN6-z_1hQ',
      };
      const nextSpy = jest.fn();
      authenticateUser(req, res, nextSpy);
      expect(nextSpy).toHaveBeenCalled();
      expect(nextSpy.mock.calls[0][0].message.split(' ')[0]).toBe('JsonWebTokenError:');
    });

    it('should set the customer_id of the customer in the current session to the req body', done => {
      const token = Token.generateToken({ customer_id: 1, name: 'johndoe' });
      req.headers = {
        authorization: `Bearer ${token}`,
      };
      const nextSpy = jest.fn();
      authenticateUser(req, res, nextSpy);
      expect(nextSpy).toHaveBeenCalled();
      expect(req.customerId).toBe(1);
      done();
    });
  });
});
