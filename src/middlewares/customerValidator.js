import ErrorHandler from './errorHandler';

class CustomerValidator {
  static validateSignUp(req, res, next) {
    req
      .checkBody('name', 'Name is required')
      .notEmpty()
      .trim()
      .len({ min: 4 })
      .withMessage('Name should be more than 4 characters')
      .len({ max: 50 })
      .withMessage('Name cannot be more than 50 characters');

    req
      .checkBody('email', 'Email is required')
      .notEmpty()
      .trim()
      .isEmail()
      .withMessage('Email provided is not valid');

    req
      .checkBody('password', 'Password is required')
      .notEmpty()
      .len({ min: 6 })
      .withMessage('Password cannot be less that 6 characters');

    if (req.validationErrors()) {
      return ErrorHandler.validationErrorHandler(req, res);
    }

    return next();
  }
}

export default CustomerValidator;
