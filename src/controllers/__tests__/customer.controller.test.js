// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { Customer } from '../../database/models';
import { resetDB } from '../../test/helpers';
import Token from '../../utils/token';

describe('customer controller', () => {
  let customer;
  beforeEach(async done => {
    await resetDB();
    customer = await Customer.create({
      name: 'Test user',
      password: 'password',
      email: 'testuser@mail.com',
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

  describe('updateCustomerProfile', () => {
    it('should update a customers profile', done => {
      const token = Token.generateToken({ customer_id: 1, name: 'Test user' });
      request(app)
        .put('/api/v1/customer')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test user',
          password: 'password',
          dayPhone: '09091239898',
        })
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('customer');
          expect(res.body.customer.day_phone).toEqual('09091239898');
          done();
        });
    });

    it('should return an error if customer does not exist', done => {
      const token = Token.generateToken({ customer_id: 1999, name: 'Test user' });
      request(app)
        .put('/api/v1/customer')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test user',
          password: 'password',
          dayPhone: '09091239898',
        })
        .end((error, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Customer with id 1999 does not exist');
          done();
        });
    });

    it('should return an error if customer provides invalid password', done => {
      const token = Token.generateToken({ customer_id: 1, name: 'Test user' });
      request(app)
        .put('/api/v1/customer')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test user',
          password: 'wrontpassword',
          dayPhone: '09091239898',
        })
        .end((error, res) => {
          expect(res.status).toEqual(403);
          expect(res.body.message).toEqual('Invalid password supplied. Unable to update profile');
          done();
        });
    });
  });

  describe('updatePassword', () => {
    it('should update a customers password', done => {
      const token = Token.generateToken({ customer_id: 1, name: 'Test user' });
      request(app)
        .put('/api/v1/customer/password')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: 'password',
          newPassword: 'newpassword',
        })
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('Password successfully updated');
          done();
        });
    });

    it('should return an error if customer does not exist', done => {
      const token = Token.generateToken({ customer_id: 1999, name: 'Test user' });
      request(app)
        .put('/api/v1/customer/password')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: 'password',
          newPassword: 'newpassword',
        })
        .end((error, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Customer with id 1999 does not exist');
          done();
        });
    });

    it('should return an error if customer provides invalid password', done => {
      const token = Token.generateToken({ customer_id: 1, name: 'Test user' });
      request(app)
        .put('/api/v1/customer/password')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: 'wrongoldpassword',
          newPassword: 'newpassword',
        })
        .end((error, res) => {
          expect(res.status).toEqual(403);
          expect(res.body.message).toEqual('Invalid password supplied');
          done();
        });
    });
  });

  describe('updateBillingInfo', () => {
    it('should update a customers billing information', done => {
      const token = Token.generateToken({ customer_id: 1, name: 'Test user' });
      request(app)
        .put('/api/v1/customer/billing-info')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'password',
          creditCard: '5399 8888 8888 8888',
          address1: '58, New place street',
          address2: 'By old place station',
          city: 'Kigali',
          region: 'North-West',
          postalCode: '88929',
          country: 'Newark',
        })
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('customer');
          done();
        });
    });

    it('should return an error if customer does not exist', done => {
      const token = Token.generateToken({ customer_id: 1999, name: 'Test user' });
      request(app)
        .put('/api/v1/customer/billing-info')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'password',
          creditCard: '5399 8888 8888 8888',
          address1: '58, New place street',
          address2: 'By old place station',
          city: 'Kigali',
          region: 'North-West',
          postalCode: '88929',
          country: 'Newark',
        })
        .end((error, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.message).toEqual('Customer with id 1999 does not exist');
          done();
        });
    });

    it('should return an error if customer provides invalid password', done => {
      const token = Token.generateToken({ customer_id: 1, name: 'Test user' });
      request(app)
        .put('/api/v1/customer/billing-info')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'invalidpassword',
          creditCard: '5399 8888 8888 8888',
          address1: '58, New place street',
          address2: 'By old place station',
          city: 'Kigali',
          region: 'North-West',
          postalCode: '88929',
          country: 'Newark',
        })
        .end((error, res) => {
          expect(res.status).toEqual(403);
          expect(res.body.message).toEqual(
            'Invalid password supplied. Unable to update billing information'
          );
          done();
        });
    });
  });
});
