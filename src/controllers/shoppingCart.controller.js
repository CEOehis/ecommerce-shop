import uniqid from 'uniqid';
import stripe from 'stripe';
import { ShoppingCart, Product, Shipping, Order, OrderDetail } from '../database/models';
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

  /**
   * adds item to a cart with cart_id
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
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

  /**
   * gets items in a cart, if cartId is supplied in req params it uses that to query
   * otherwise, it uses the cartId stored in the session
   * if neither exists it creates a new id and stores it in session
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async getCart(req, res, next) {
    // if the cartId is not supplied in the query param, use the cart in the session
    let cartId;
    if (!req.params.cartId) {
      // eslint-disable-next-line prefer-destructuring
      cartId = req.session.cartId;
      if (!cartId) {
        // generate a new cartId and set in seession
        cartId = uniqid();
        req.session.cartId = cartId;
      }
    } else {
      // eslint-disable-next-line prefer-destructuring
      cartId = req.params.cartId;
    }
    try {
      const cart = await ShoppingCart.findAll({
        where: {
          cart_id: cartId,
        },
      });

      return res.status(200).json({
        status: true,
        cart,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * removes all items in a cart
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with cart
   * @memberof ShoppingCartController
   */
  static async emptyCart(req, res, next) {
    const { cartId } = req.session;
    try {
      await ShoppingCart.destroy({
        where: {
          cart_id: cartId || '',
        },
      });

      return res.status(200).json({
        status: 200,
        message: 'Successfully emptied cart',
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * remove single item from cart
   * cart id is obtained from current session
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with message
   * @memberof ShoppingCartController
   */
  static async removeItemFromCart(req, res, next) {
    const { cartId } = req.session;
    const { itemId } = req.params;

    try {
      await ShoppingCart.destroy({
        where: {
          cart_id: cartId || '',
          item_id: itemId,
        },
      });

      return res.status(200).json({
        status: 200,
        message: 'Successfully removed item from cart',
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * create an order from a cart
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with created order
   * @memberof ShoppingCartController
   */
  static async createOrder(req, res, next) {
    const { shippingId } = req.body;
    const { cartId } = req.session;
    try {
      const shippingType = await Shipping.findByPk(shippingId);
      if (shippingType) {
        const cart = await ShoppingCart.findAll({
          where: {
            cart_id: cartId,
          },
          include: [
            {
              model: Product,
            },
          ],
        });
        let totalPrice = 0;
        let totalDiscount = 0;
        cart.forEach(item => {
          totalPrice += parseFloat(item.quantity * item.Product.price);
          totalDiscount += parseFloat(item.quantity * item.Product.discounted_price);
        });

        const finalPrice = totalPrice + parseFloat(shippingType.shipping_cost) - totalDiscount;

        const order = await Order.create({
          total_amount: finalPrice,
          comments: 'order for customer',
          customer_id: req.customerId,
          auth_code: 'TURING',
          reference: cartId,
          shipping_id: shippingId,
        });

        const orderDetails = [];
        cart.forEach(item => {
          // eslint-disable-next-line camelcase
          const { item_id, ...data } = item.dataValues;
          orderDetails.push({
            order_id: order.order_id,
            ...data,
            product_name: data.Product.name,
            unit_cost: data.Product.price,
          });
        });

        await OrderDetail.bulkCreate(orderDetails);
        return res.status(200).json({
          status: true,
          order,
          message: 'Order created successfully',
        });
      }
      return res.status(400).json({
        status: false,
        message: 'Invalid shipping type provided',
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with order summary
   * @memberof ShoppingCartController
   */
  static async getOrderSummary(req, res, next) {
    const { orderId } = req.params;
    const { customerId } = req;
    try {
      const order = await Order.findOne({
        where: {
          order_id: orderId,
          customer_id: customerId,
        },
        attributes: {
          exclude: ['auth_code'],
        },
        include: [
          {
            model: OrderDetail,
            as: 'orderItems',
          },
        ],
      });
      if (order) {
        return res.status(200).json({
          status: true,
          order,
        });
      }
      return res.status(404).json({
        status: false,
        message: `Order with order id ${orderId} does not exist`,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   *
   * @static
   * @param {obj} req express request object
   * @param {obj} res express response object
   * @returns {json} returns json response with customer's orders
   * @memberof ShoppingCartController
   */
  static async getCustomerOrders(req, res, next) {
    const { customerId } = req;
    try {
      const orders = await Order.findAll({
        where: {
          customer_id: customerId,
        },
      });
      return res.status(200).json({
        status: true,
        orders,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async processStripePayment(req, res, next) {
    const { email, stripeToken, orderId } = req.body;
    const { customerId } = req;
    try {
      const order = await Order.findOne({
        where: {
          order_id: orderId,
          customer_id: customerId,
          status: 0,
        },
      });

      if (order) {
        const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

        const customer = await stripeInstance.customers.create({
          email,
          card: stripeToken,
        });

        const charge = await stripeInstance.charges.create({
          amount: order.total_amount * 100,
          description: order.comments,
          currency: 'usd',
          customer: customer.id,
        });

        // empty out shopping cart
        await ShoppingCart.destroy({
          where: {
            cart_id: order.reference,
          },
        });

        // update order status
        await order.update({
          status: 1,
          reference: charge.id,
        });

        return res.status(201).json({
          status: true,
          charge,
          message: `Order paid successfully`,
        });
      }
      return res.status(404).json({
        status: false,
        message: `Order with order id ${orderId} does not exist`,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ShoppingCartController;
