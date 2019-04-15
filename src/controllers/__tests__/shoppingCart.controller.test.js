// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { Product, ShoppingCart } from '../../database/models';
import { resetDB } from '../../test/helpers';

describe('Shopping cart controller', () => {
  beforeEach(async done => {
    await resetDB();
    done();
  });

  afterEach(async done => {
    await resetDB();
    done();
  });

  afterAll(async done => {
    await resetDB();
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
});
