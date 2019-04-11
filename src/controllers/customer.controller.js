import { Customer } from '../database/models';
import Token from '../utils/token';

class CustomerController {
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
}

export default CustomerController;
