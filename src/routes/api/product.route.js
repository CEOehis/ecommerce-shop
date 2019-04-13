import { Router } from 'express';
import ProductController from '../../controllers/product.controller';

const router = Router();
router.get('/products', ProductController.getAllProducts);
router.get('/products/:productId', ProductController.getProduct);

export default router;
