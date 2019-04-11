import jwt from 'jsonwebtoken';
import Token from '../token';

describe('token utility', () => {
  it('should have a method: generateToken', () => {
    expect(typeof Token.generateToken).toEqual('function');
  });

  describe('generateToken()', () => {
    const payload = {
      name: 'johndoe',
      customer_id: 1,
      email: 'jd@mail.com',
    };

    let generatedToken;

    beforeAll(() => {
      generatedToken = Token.generateToken(payload);
    });

    it('should return a token', () => {
      expect(typeof generatedToken).toEqual('string');
    });

    it('should take a payload and return a jwt token', () => {
      const verifiedToken = jwt.verify(generatedToken, process.env.JWT_KEY);
      const { exp, iat, ...actual } = verifiedToken;
      expect(actual).toEqual(payload);
    });
  });

  describe('decodeToken()', () => {
    const payload = {
      username: 'johndoe',
      customer_id: 1,
    };

    let generatedToken;

    beforeAll(() => {
      generatedToken = Token.generateToken(payload);
    });

    it('should take a token and return it decoded', () => {
      const decoded = Token.decodeToken(generatedToken);
      expect(decoded.customer_id).toEqual(payload.customer_id);
    });
  });

  describe('decodeToken method', () => {
    it('should return error object if invalid token supplied', () => {
      const decoded = Token.decodeToken('invalid token ;)');
      expect(typeof decoded).toEqual('object');
    });
  });
});
