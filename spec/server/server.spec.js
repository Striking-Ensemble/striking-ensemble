'use strict';

const request = require('request');
const base_url = 'http://localhost:3000/';
// const router = require('../../src/server/db/influencerRouter.js');

// describe('A suite', function () {
//   it('contains spec with an expectation', function () {
//     expect(true).toBe(true);
//   });
// });

describe('Striking Ensemble Server and DB', () => {
  describe('GET request on all influencers', () => {
    it('returns status code 200', (done) => {
      request(base_url, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it('should get all influencer info', (done) => {
      request(base_url + 'api/influencers', (err, res, body) => {
        expect(JSON.parse(body).length).toBe(6);
        done();
      });
    });
  });
});
