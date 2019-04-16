import { Router } from 'express';
import ShippingController from '../../controllers/shipping.controller';

const router = Router();

router.get('/shipping/regions', ShippingController.getShippingRegions);
router.get('/shipping/regions/:shippingRegionId', ShippingController.getShippingType);

export default router;
