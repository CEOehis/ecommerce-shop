import { ShippingRegion, Shipping } from '../database/models';

class ShippingController {
  /**
   * get all shipping regions
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and shipping regions data
   * @memberof ShippingController
   */
  static async getShippingRegions(req, res, next) {
    try {
      const shippingRegions = await ShippingRegion.findAll();
      return res.status(200).json({
        status: true,
        shippingRegions,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get get shipping region shipping types
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and shipping types data
   * @memberof ShippingController
   */
  static async getShippingType(req, res, next) {
    const { shippingRegionId } = req.params;
    try {
      const shippingTypes = await Shipping.findAll({
        where: {
          shipping_region_id: shippingRegionId,
        },
      });

      return res.status(200).json({
        status: true,
        shippingTypes,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ShippingController;
