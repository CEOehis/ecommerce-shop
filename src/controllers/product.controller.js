import { Product } from '../database/models';
import Pagination from '../utils/pagination';

class ProductController {
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
}

export default ProductController;
