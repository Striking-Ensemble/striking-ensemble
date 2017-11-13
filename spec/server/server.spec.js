'use strict';

const request = require('request');
const base_url = 'http://localhost:3000/';
// const router = require('../../src/server/db/influencerRouter.js');

// describe('A suite', function () {
//   it('contains spec with an expectation', function () {
//     expect(true).toBe(true);
//   });
// });

describe('GET Request', () => {
  it('returns status code 200', () => {
    request(base_url, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
  it('should get all influencer info', () => {
    request(base_url + 'influencers', (err, res, body) => {
      expect(body.length).toBe(!0);
      done();
    });
  });
});
