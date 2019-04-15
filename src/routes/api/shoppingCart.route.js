import { Router } from 'express';
import ShoppingCartController from '../../controllers/shoppingCart.controller';

const router = Router();
router.get('/cart/generate', ShoppingCartController.generateUniqueCart);
router.post('/cart', ShoppingCartController.addItemToCart);
router.get('/cart', ShoppingCartController.getCart);
router.get('/cart/:cartId', ShoppingCartController.getCart);

export default router;
