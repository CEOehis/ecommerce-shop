import { Router } from 'express';
import CustomerController from '../../controllers/customer.controller';
import CustomerValidator from '../../middlewares/customerValidator';

const router = Router();
router.post('/auth/signup', CustomerValidator.validateSignUp, CustomerController.create);

export default router;
