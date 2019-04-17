import { Router } from 'express';
import ProductController from '../../controllers/product.controller';

const router = Router();
router.get('/products', ProductController.getAllProducts);
router.get('/products/:productId', ProductController.getProduct);
router.get('/products/in-category/:categoryId', ProductController.getProductsByCategory);
router.get('/products/in-department/:departmentId', ProductController.getProductsByDepartment);
router.get('/departments', ProductController.getAllDepartments);
router.get('/departments/:departmentId', ProductController.getDepartment);

export default router;
