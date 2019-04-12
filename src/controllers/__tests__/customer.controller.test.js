// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { Customer } from '../../database/models';
import { resetDB } from '../../test/helpers';
import Token from '../../utils/token';

describe('customer controller', () => {
  let customer;
  beforeEach(async () => {
    await resetDB();
    customer = await Customer.create({
      name: 'Test user',
      password: 'password',
      email: 'testuser@mail.com',
    });
  });

  afterEach(async () => {
    await resetDB();
  });

  afterAll(done => {
    server.close();
    done();
  });
  describe('create user', () => {
    it('should successfully register a new user', done => {
      request(app)
        .post('/api/v1/customers')
        .set('Content-Type', 'application/json')
        .send({
          name: 'new user',
          email: 'newuser@email.com',
          password: 'password',
        })
        .end((err, res) => {
          expect(res.status).toEqual(201);
          expect(res.body.customer).toHaveProperty('email');
          expect(res.body.customer).toHaveProperty('name');
          done();
        });
    });

    it('should return error if email already exists in database', done => {
      request(app)
        .post('/api/v1/customers')
        .send({
          name: 'Test user',
          password: 'password',
          email: 'testuser@mail.com',
        })
        .end((error, res) => {
          expect(res.status).toEqual(409);
          expect(res.body.message).toEqual('User with this email already exists');
          done();
        });
    });
    it('should return error if email is invalid', done => {
      request(app)
        .post('/api/v1/customers')
        .send({
          name: 'Test user',
          password: 'password',
          email: 'testuser@mail',
        })
        .end((error, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.errors).toHaveProperty('email');
          done();
        });
    });
  });

  describe('login', () => {
    it('should successfully login a registered user', done => {
      request(app)
        .post('/api/v1/customers/login')
        .send({
          password: 'password',
          email: 'testuser@mail.com',
        })
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.customer).toHaveProperty('email');
          expect(res.body).toHaveProperty('token');
          done();
        });
    });
    it('should send error if user supplies the wrong email', done => {
      request(app)
        .post('/api/v1/customers/login')
        .send({
          password: 'password',
          email: 'wrongemail@mail.com',
        })
        .end((error, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.message).toEqual('Invalid email or password');
          done();
        });
    });
    it('should send error if user supplies the wrong password', done => {
      request(app)
        .post('/api/v1/customers/login')
        .send({
          password: 'invalidpassword',
          email: 'testuser@mail.com',
        })
        .end((error, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.message).toEqual('Invalid email or password');
          done();
        });
    });
  });

  describe('getCustomerProfile', () => {
    it('should return the logged in customers profile', done => {
      const token = Token.generateToken({ customer_id: 1, name: 'Test user' });
      request(app)
        .get('/api/v1/customer')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('customer');
          done();
        });
    });
  });
});
