import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default class Token {
  static generateToken(user) {
    // eslint-disable-next-line camelcase
    const { customer_id, name, email } = user;
    const token = jwt.sign({ customer_id, name, email }, process.env.JWT_KEY, {
      expiresIn: '24h',
    });

    return token;
  }

  static decodeToken(token) {
    return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        const error = new Error(err);
        error.status = 401;
        return error;
      }
      return decoded;
    });
  }
}
