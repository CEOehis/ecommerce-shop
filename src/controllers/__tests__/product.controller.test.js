// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { Product, Department } from '../../database/models';
import { resetDB } from '../../test/helpers';

describe('product controller', () => {
  let product;
  let department;
  beforeEach(async done => {
    await resetDB();
    product = await Product.create({
      name: 'New T shirt',
      description: 'Simple T shirt',
      price: 14.99,
    });
    department = await Department.create({
      name: 'Groceries',
      description: 'Daily groceries',
    });
    done();
  });

  afterEach(async done => {
    await resetDB();
    done();
  });

  afterAll(async done => {
    await resetDB();
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

  describe('getAllDepartments', () => {
    it('should return a list of departments', done => {
      request(app)
        .get('/api/v1/departments')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('departments');
          expect(typeof res.body.departments).toEqual('object');
          done();
        });
    });
  });

  describe('getDepartment', () => {
    it('should get the details of a department', done => {
      request(app)
        .get(`/api/v1/departments/${department.department_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('department');
          done();
        });
    });

    it('should return appropriate message if department is not found', done => {
      request(app)
        .get('/api/v1/departments/999999')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Department with id 999999 does not exist');
          done();
        });
    });
  });
});
