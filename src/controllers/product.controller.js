import { Product } from '../database/models';
import Pagination from '../utils/pagination';

/**
 *
 *
 * @class ProductController
 */
class ProductController {
  /**
   * get all products
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getAllProducts(req, res, next) {
    const { query } = req;
    const { page, limit, offset } = Pagination.init(query);
    const sqlQueryMap = {
      limit,
      offset,
    };
    try {
      const products = await Product.findAndCountAll(sqlQueryMap);
      return res.status(200).json({
        status: true,
        products,
        meta: Pagination.getPaginationMeta(products, page, limit),
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get single product details
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product details
   * @memberof ProductController
   */
  static async getProduct(req, res, next) {
    const { productId } = req.params;
    try {
      const product = await Product.findByPk(productId);
      if (product) {
        return res.status(200).json({
          status: true,
          product,
        });
      }
      return res.status(404).json({
        status: false,
        message: `Product with id ${productId} does not exist`,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ProductController;
