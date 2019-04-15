import uniqid from 'uniqid';
import { ShoppingCart, Product } from '../database/models';
/**
 *
 *
 * @class shoppingCartController
 */
class ShoppingCartController {
  /**
   * generate random unique id for cart identifier
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart_id
   * @memberof shoppingCartController
   */
  static generateUniqueCart(req, res) {
    let { cartId } = req.session;
    if (!cartId) {
      cartId = uniqid();
      req.session.cartId = cartId;
    }
    return res.status(200).json({
      status: true,
      cart_id: cartId,
    });
  }

  static async addItemToCart(req, res, next) {
    const { cartId, productId, attributes, quantity } = req.body;
    try {
      // first check if product exists
      const product = await Product.findByPk(productId);
      if (product) {
        // check if product has been added to cart using find or create
        // if it exists then update the quantity
        const [item, created] = await ShoppingCart.findOrCreate({
          where: {
            product_id: productId,
            cart_id: cartId,
          },
          defaults: {
            cart_id: cartId,
            product_id: productId,
            attributes,
            quantity: quantity || 1,
          },
        });

        if (!created) {
          // if it already existed, then just bump the quantity
          await item.update({
            quantity: quantity || item.quantity + 1,
            attributes: attributes || item.attributes,
          });
        }

        const cart = await ShoppingCart.findAll({
          where: {
            cart_id: item.cart_id,
          },
        });

        return res.status(200).json({
          status: true,
          cart,
        });
      }
      // product does not exist return error message
      return res.status(404).json({
        status: false,
        message: `Product with product id ${productId} does not exist`,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ShoppingCartController;
