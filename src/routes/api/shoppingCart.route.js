import { Router } from 'express';
import ShoppingCartController from '../../controllers/shoppingCart.controller';

const router = Router();
router.get('/cart/generate', ShoppingCartController.generateUniqueCart);
router.post('/cart', ShoppingCartController.addItemToCart);

export default router;
