import ErrorHandler from './errorHandler';

/**
 *
 *
 * @class CustomerValidator
 */
class CustomerValidator {
  /**
   * validata sign up data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} calls next middleware
   * @memberof CustomerValidator
   */
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

  /**
   * validate login data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} calls next middleware
   * @memberof CustomerValidator
   */
  static validateLogin(req, res, next) {
    req
      .checkBody('email', 'Please provide your registered email')
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

  /**
   * validate update profile data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} calls next middleware
   * @memberof CustomerValidator
   */
  static validateUpdateProfile(req, res, next) {
    req
      .checkBody('name', 'Name is required')
      .notEmpty()
      .trim()
      .len({ min: 4 })
      .withMessage('Name should be more than 4 characters')
      .len({ max: 50 })
      .withMessage('Name cannot be more than 50 characters');

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

  /**
   * validate update password data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} calls next middleware
   * @memberof CustomerValidator
   */
  static validateUpdatePassword(req, res, next) {
    req.checkBody('oldPassword', 'Old password is required').notEmpty();

    req
      .checkBody('newPassword', 'Password is required')
      .notEmpty()
      .len({ min: 6 })
      .withMessage('Password cannot be less that 6 characters');

    if (req.validationErrors()) {
      return ErrorHandler.validationErrorHandler(req, res);
    }

    return next();
  }

  /**
   * validate update billing info data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} calls next middleware
   * @memberof CustomerValidator
   */
  static validateUpdateBillingInfo(req, res, next) {
    req.checkBody('password', 'Password is required').notEmpty();

    if (req.validationErrors()) {
      return ErrorHandler.validationErrorHandler(req, res);
    }

    return next();
  }
}

export default CustomerValidator;
