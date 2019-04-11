class ErrorHandler {
  static validationErrorHandler(req, res) {
    const errors = req.validationErrors();
    let validationErrorStack = {}; // eslint-disable-line prefer-const
    errors.forEach(error => {
      const paramErrorList = validationErrorStack[error.param]
        ? validationErrorStack[error.param]
        : [];
      validationErrorStack[error.param] = [...paramErrorList, error.msg];
    });
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrorStack,
    });
  }
}

export default ErrorHandler;
