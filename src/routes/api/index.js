import { Router } from 'express';
import welcomeRoute from './welcome.route';
import customerRoute from './customer.route';

const routes = Router();

routes.use('/', welcomeRoute);
routes.use('/', customerRoute);

export default routes;
