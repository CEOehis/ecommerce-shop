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
      return res.status(201).json({
        status: true,
        customer: customer.getSafeDataValues(),
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
          return res.status(200).json({
            status: true,
            customer: foundCustomer.getSafeDataValues(),
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

  /**
   * update customer profile data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomerProfile(req, res, next) {
    const { customerId } = req;
    const { name, password, dayPhone, evePhone, mobPhone } = req.body;
    try {
      const customer = await Customer.findByPk(customerId);
      if (customer) {
        // make sure the updating is authorised by thee user
        const isValid = await customer.validatePassword(password);
        if (isValid) {
          // if password supplied is correct then we proceed
          const updatedCustomer = await customer.update({
            name,
            day_phone: dayPhone || customer.day_phone,
            eve_phone: evePhone || customer.eve_phone,
            mob_phone: mobPhone || customer.mob_phone,
          });
          return res.status(200).json({
            status: true,
            customer: {
              name: updatedCustomer.name,
              email: updatedCustomer.email,
              day_phone: updatedCustomer.day_phone,
              eve_phone: updatedCustomer.eve_phone,
              mob_phone: updatedCustomer.mob_phone,
            },
          });
        }
        return res.status(403).json({
          status: false,
          message: 'Invalid password supplied. Unable to update profile',
        });
      }
      return res.status(404).json({
        status: false,
        message: `Customer with id ${customerId} does not exist`,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer password
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updatePassword(req, res, next) {
    const { customerId } = req;
    const { oldPassword, newPassword } = req.body;
    try {
      const customer = await Customer.findByPk(customerId);
      if (customer) {
        // make sure the updating is authorized by thee user
        const isValid = await customer.validatePassword(oldPassword);
        if (isValid) {
          // if password supplied is correct then we proceed
          // first reassign password to supplied string on the customer instance,
          // then generate the hash and update the customer
          customer.password = newPassword;
          const hashedPassword = await customer.generatePasswordHash();
          await customer.update({
            password: hashedPassword,
          });
          return res.status(200).json({
            status: true,
            message: 'Password successfully updated',
          });
        }
        return res.status(403).json({
          status: false,
          message: 'Invalid password supplied',
        });
      }
      return res.status(404).json({
        status: false,
        message: `Customer with id ${customerId} does not exist`,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer billing info data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateBillingInfo(req, res, next) {
    const { customerId } = req;
    const {
      password,
      creditCard,
      address1,
      address2,
      city,
      region,
      postalCode,
      country,
      shippingRegionId,
    } = req.body;
    try {
      const customer = await Customer.findByPk(customerId);
      if (customer) {
        // make sure the updating is authorised by thee user
        const isValid = await customer.validatePassword(password);
        if (isValid) {
          // if password supplied is correct then we proceed
          const updatedCustomer = await customer.update({
            credit_card: creditCard || customer.credit_card,
            address_1: address1 || customer.address_1,
            address_2: address2 || customer.address_2,
            city: city || customer.city,
            region: region || customer.region,
            postal_code: postalCode || customer.postal_code,
            country: country || customer.country,
            shipping_region_id: shippingRegionId || customer.shipping_region_id,
          });
          return res.status(200).json({
            status: true,
            customer: updatedCustomer.getSafeDataValues(),
          });
        }
        return res.status(403).json({
          status: false,
          message: 'Invalid password supplied. Unable to update billing information',
        });
      }
      return res.status(404).json({
        status: false,
        message: `Customer with id ${customerId} does not exist`,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default CustomerController;
