import { Customer } from '../database/models';
import Token from '../utils/token';

/**
 *
 *
 * @class CustomerController
 */
class CustomerController {
  /**
   * create a customer record
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, customer data and access token
   * @memberof CustomerController
   */
  static async create(req, res, next) {
    const { email } = req.body;
    const existingUser = await Customer.findOne({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: 'User with this email already exists',
      });
    }
    try {
      const customer = await Customer.create(req.body);
      const token = Token.generateToken(customer);
      const { password, ...data } = customer.dataValues;
      return res.status(201).json({
        status: true,
        customer: data,
        token,
      });
    } catch (e) {
      return next(e);
    }
  }

  /**
   * log in a customer
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, and access token
   * @memberof CustomerController
   */
  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const foundCustomer = await Customer.findOne({
        where: {
          email,
        },
      });
      if (foundCustomer) {
        const isValid = await foundCustomer.validatePassword(password);
        if (isValid) {
          const token = Token.generateToken(foundCustomer);
          // eslint-disable-next-line no-shadow
          const { password, ...data } = foundCustomer.dataValues;
          return res.status(200).json({
            status: true,
            customer: data,
            token,
          });
        }
      }
      return res.status(401).json({
        status: true,
        message: 'Invalid email or password',
      });
    } catch (e) {
      return next(e);
    }
  }

  /**
   * get customer profile data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async getCustomerProfile(req, res, next) {
    const { customerId } = req;
    try {
      const customer = await Customer.findByPk(customerId, {
        attributes: {
          exclude: ['password', 'credit_card'],
        },
      });
      return res.status(200).json({
        status: true,
        customer,
      });
    } catch (error) {
      return next(error);
    }
  }
}
export default CustomerController;
