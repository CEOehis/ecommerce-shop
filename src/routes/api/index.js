import { Router } from 'express';
import welcomeRoute from './welcome.route';
import customerRoute from './customer.route';
import productRoute from './product.route';
import shoppingCartRoute from './shoppingCart.route';
import shippingRoute from './shipping.route';

const routes = Router();

routes.use('/', welcomeRoute);
routes.use('/', customerRoute);
routes.use('/', productRoute);
routes.use('/', shoppingCartRoute);
routes.use('/', shippingRoute);

export default routes;
