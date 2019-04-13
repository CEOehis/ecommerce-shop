// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { Product } from '../../database/models';
import { resetDB } from '../../test/helpers';

describe('product controller', () => {
  let product;
  beforeEach(async () => {
    await resetDB();
    product = await Product.create({
      name: 'New T shirt',
      description: 'Simple T shirt',
      price: 14.99,
    });
  });

  afterEach(async () => {
    await resetDB();
  });

  afterAll(done => {
    server.close();
    done();
  });
  describe('getAllProducts', () => {
    it('should return a list of products', done => {
      request(app)
        .get('/api/v1/products')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          done();
        });
    });
  });

  describe('getProduct', () => {
    it('should get the details of a product', done => {
      request(app)
        .get(`/api/v1/products/${product.product_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('product');
          done();
        });
    });

    it('should return appropriate message if product is not found', done => {
      request(app)
        .get('/api/v1/products/999999')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Product with id 999999 does not exist');
          done();
        });
    });
  });
});
