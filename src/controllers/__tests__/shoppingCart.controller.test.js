// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { Product, ShoppingCart, Customer, ShippingRegion, Shipping } from '../../database/models';
import Token from '../../utils/token';
import truncate from '../../test/helpers';

describe('Shopping cart controller', () => {
  let customer;
  beforeEach(async done => {
    await truncate();
    await ShippingRegion.bulkCreate([
      {
        shipping_region_id: 1,
        shipping_region: 'Please Select',
      },
      {
        shipping_region_id: 2,
        shipping_region: 'US / Canada',
      },
      {
        shipping_region_id: 3,
        shipping_region: 'Europe',
      },
      {
        shipping_region_id: 4,
        shipping_region: 'Rest of World',
      },
    ]);

    await Shipping.bulkCreate([
      {
        shipping_id: 1,
        shipping_type: 'Next Day Delivery ($20)',
        shipping_cost: '20.00',
        shipping_region_id: 2,
      },
      {
        shipping_id: 2,
        shipping_type: '3-4 Days ($10)',
        shipping_cost: '10.00',
        shipping_region_id: 2,
      },
      {
        shipping_id: 3,
        shipping_type: '7 Days ($5)',
        shipping_cost: '5.00',
        shipping_region_id: 2,
      },
    ]);
    customer = await Customer.create({
      name: 'Buying User',
      password: 'password',
      email: 'bu@mail.com',
    });
    done();
  });

  afterAll(async done => {
    await server.close();
    done();
  });

  describe('generateUniqueCart', () => {
    it('should generate a new cart id', done => {
      request(app)
        .get('/api/v1/cart/generate')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('cart_id');
          done();
        });
    });
  });

  describe('addItemToCart', () => {
    let product;
    let shoppingCart;
    beforeEach(async done => {
      await truncate();
      product = await Product.create({
        name: 'My product',
        description: 'The product description',
        price: 10,
        discounted_price: 8,
        display: 0,
      });
      shoppingCart = await ShoppingCart.create({
        cart_id: 'lkslfklaifroj',
        product_id: product.product_id,
        attributes: 'L',
        quantity: 4,
      });
      done();
    });

    it('should add a new item to the cart', done => {
      request(app)
        .post('/api/v1/cart')
        .set('Content-Type', 'application/json')
        .send({
          cartId: '67t8q0pjui9rwfm',
          productId: product.product_id,
          attributes: 'LS',
          quantity: 10,
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('cart');
          done();
        });
    });

    it('should update the quantity of an item if it exists in the cart', done => {
      request(app)
        .post('/api/v1/cart')
        .set('Content-Type', 'application/json')
        .send({
          cartId: 'lkslfklaifroj',
          productId: product.product_id,
          attributes: 'LS',
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('cart');
          expect(res.body.cart[0].quantity).toEqual(5);
          done();
        });
    });

    it('should not add a non existent product id to the cart', done => {
      request(app)
        .post('/api/v1/cart')
        .set('Content-Type', 'application/json')
        .send({
          cartId: '67t8q0pjui9rwfm',
          productId: 9999,
          attributes: 'LS',
          quantity: 10,
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Product with product id 9999 does not exist');
          done();
        });
    });
  });

  describe('getCart', () => {
    it('should get items from a cart', done => {
      request(app)
        .get('/api/v1/cart')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('cart');
          done();
        });
    });
    it('should get items from a cart', done => {
      request(app)
        .get('/api/v1/cart/somecartid')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('cart');
          done();
        });
    });
  });

  describe('emptyCart', () => {
    it('should remove all the items in a cart', done => {
      request(app)
        .delete('/api/v1/cart')
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('Successfully emptied cart');
          done();
        });
    });
  });

  describe('removeItemFromCart', () => {
    it('should remove an item from a cart', done => {
      request(app)
        .delete('/api/v1/cart/1')
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('Successfully removed item from cart');
          done();
        });
    });
  });

  describe('createOrder', () => {
    const agent = request.agent(app);
    it('should save cookies', done => {
      agent.get('/api/v1/cart/generate').end(() => {
        done();
      });
    });

    it('should create an order', done => {
      const token = Token.generateToken({
        customer_id: customer.customer_id,
        name: 'Buying User',
      });
      agent
        .post('/api/v1/orders')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          shippingId: 2,
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('Order created successfully');
          done();
        });
    });
  });

  describe('getOrderSummary', () => {
    it('should return not found if order does not exist', done => {
      const token = Token.generateToken({
        customer_id: customer.customer_id,
        name: 'Buying User',
      });
      request(app)
        .get('/api/v1/orders/999')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Order with order id 999 does not exist');
          done();
        });
    });
  });

  describe('getCustomerOrders', () => {
    it('should return a customers orders', done => {
      const token = Token.generateToken({
        customer_id: customer.customer_id,
        name: 'Buying User',
      });
      request(app)
        .get('/api/v1/orders/999')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('orders');
          done();
        });
    });
  });
});
