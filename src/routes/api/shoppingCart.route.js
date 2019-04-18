import { Router } from 'express';
import ShoppingCartController from '../../controllers/shoppingCart.controller';
import Authenticator from '../../middlewares/authenticator';

const router = Router();
router.get('/cart/generate', ShoppingCartController.generateUniqueCart);
router.post('/cart', ShoppingCartController.addItemToCart);
router.get('/cart', ShoppingCartController.getCart);
router.get('/cart/:cartId', ShoppingCartController.getCart);
router.delete('/cart', ShoppingCartController.emptyCart);
router.delete('/cart/:itemId', ShoppingCartController.removeItemFromCart);
router.post('/orders', Authenticator.authenticateUser, ShoppingCartController.createOrder);
router.get('/orders', Authenticator.authenticateUser, ShoppingCartController.getCustomerOrders);
router.get(
  '/orders/:orderId',
  Authenticator.authenticateUser,
  ShoppingCartController.getOrderSummary
);

export default router;
