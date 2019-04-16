// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { ShippingRegion, Shipping } from '../../database/models';
import truncate from '../../test/helpers';

describe('Shipping controller', () => {
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
    done();
  });

  // afterEach(async done => {
  //   done();
  // });

  afterAll(async done => {
    await server.close();
    done();
  });

  describe('getShippingRegions', () => {
    it('should get all shipping regions', done => {
      request(app)
        .get('/api/v1/shipping/regions')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(typeof res.body.shippingRegions).toEqual('object');
          done();
        });
    });
  });

  describe('getShippingType', () => {
    it('should get all shipping types for a region', done => {
      request(app)
        .get('/api/v1/shipping/regions/2')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(typeof res.body.shippingTypes).toEqual('object');
          done();
        });
    });
  });
});
