import { Router } from 'express';
import ProductController from '../../controllers/product.controller';
import Authenticator from '../../middlewares/authenticator';

const router = Router();
router.get('/products', ProductController.getAllProducts);

export default router;
