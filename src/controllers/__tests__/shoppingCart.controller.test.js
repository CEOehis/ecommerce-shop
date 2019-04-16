// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { Product, ShoppingCart } from '../../database/models';
import truncate from '../../test/helpers';

describe('Shopping cart controller', () => {
  beforeEach(async done => {
    done();
  });

  afterEach(async done => {
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
});
