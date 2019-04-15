import { Router } from 'express';
import ShoppingCartController from '../../controllers/shoppingCart.controller';

const router = Router();
router.get('/cart/generate', ShoppingCartController.generateUniqueCart);
router.post('/cart', ShoppingCartController.addItemToCart);
router.get('/cart', ShoppingCartController.getCart);
router.get('/cart/:cartId', ShoppingCartController.getCart);
router.delete('/cart', ShoppingCartController.emptyCart);
router.delete('/cart/:itemId', ShoppingCartController.removeItemFromCart);

export default router;
