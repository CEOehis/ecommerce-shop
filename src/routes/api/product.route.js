import { Router } from 'express';
import ProductController from '../../controllers/product.controller';
import redisCache from '../../middlewares/redisCache';

const router = Router();
router.get('/products', redisCache, ProductController.getAllProducts);
router.get('/products/:productId', redisCache, ProductController.getProduct);
router.get(
  '/products/in-category/:categoryId',
  redisCache,
  ProductController.getProductsByCategory
);
router.get(
  '/products/in-department/:departmentId',
  redisCache,
  ProductController.getProductsByDepartment
);
router.get('/departments', redisCache, ProductController.getAllDepartments);
router.get('/departments/:departmentId', redisCache, ProductController.getDepartment);

export default router;
