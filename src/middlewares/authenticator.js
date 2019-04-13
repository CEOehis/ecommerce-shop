/* eslint-disable camelcase */
import Token from '../utils/token';

/**
 *
 *
 * @export
 * @class Authenticator
 */
export default class Authenticator {
  /**
   * authenticate a user
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} calls next middleware
   * @memberof Authenticator
   */
  static authenticateUser(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
      const error = new Error('No token provided');
      error.status = 403;
      return next(error);
    }
    if (authorization.split(' ')[0] !== 'Bearer') {
      // invalid auth format
      const error = new Error('Invalid authorization format');
      error.status = 401;
      return next(error);
    }
    const token = authorization.split(' ')[1];
    const decoded = Token.decodeToken(token);
    if (typeof decoded.customer_id === 'undefined') {
      return next(decoded);
    }
    // set user ID in request object for next middlewares use
    // extract payload from decoded jwt
    const { customer_id, name, email } = decoded;
    req.customerId = customer_id;
    req.name = name;
    req.email = email;
    // user authorised to access resource
    return next();
  }
}
