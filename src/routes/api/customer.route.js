import { Router } from 'express';
import CustomerController from '../../controllers/customer.controller';
import CustomerValidator from '../../middlewares/customerValidator';

const router = Router();
router.post('/customers', CustomerValidator.validateSignUp, CustomerController.create);
router.post('/customers/login', CustomerValidator.validateLogin, CustomerController.login);

export default router;
