import { Product, Department, AttributeValue, Attribute } from '../database/models';
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
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: AttributeValue,
            as: 'attributes',
            attributes: ['value'],
            through: {
              attributes: [],
            },
            include: [
              {
                model: Attribute,
                as: 'attribute_type',
              },
            ],
          },
        ],
      });
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

  /**
   * get all departments
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and department list
   * @memberof ProductController
   */
  static async getAllDepartments(req, res, next) {
    try {
      const departments = await Department.findAll();
      return res.status(200).json({
        status: true,
        departments,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getDepartment(req, res, next) {
    const { departmentId } = req.params;
    try {
      const department = await Department.findByPk(departmentId);
      if (department) {
        return res.status(200).json({
          status: true,
          department,
        });
      }
      return res.status(404).json({
        status: false,
        message: `Department with id ${departmentId} does not exist`,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ProductController;
