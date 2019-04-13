// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { resetDB } from '../../test/helpers';

describe('product controller', () => {
  beforeEach(async () => {
    await resetDB();
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
});
