'use strict';

const request = require('request');
const mongoose = require('mongoose');
const app = require('../../src/server/server.js');
const Influencer = require('../../src/server/db/Influencer.js');
const base_url = 'http://localhost:3000/';
const dbURI = 'mongodb://localhost/influencers';
const mock_user = require('../../mock_user.json');

var clearDB = function (done) {
  // Mongoose doesn't know how to pluralize 'influencer'
  mongoose.connection.collections['influencers'].remove(done);
};

// Test Structure:
// describe('A suite', function () {
//   it('contains spec with an expectation', function () {
//     expect(true).toBe(true);
//   });
// });

describe('Influencer API', () => {
  let server;

  beforeAll((done) => {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbURI, { useMongoClient: true }, done);
  });

  beforeEach((done) => {
    server = app.listen(3000, () => clearDB(done));
  });

  afterEach(() => server.close());

  describe('GET requests', () => {
    beforeEach((done) => {
      Influencer.create(mock_user, done);
    })
    describe('GET /api/influencers', () => {
      it('returns status code 200', (done) => {
        request(base_url, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          done();
        });
      });

      it('should get all influencer info', (done) => {
        request(base_url + 'api/influencers', (err, res, body) => {
          let user = JSON.parse(body);
          expect(user[0].username).toBe('snoopdogg');
          done();
        });
      });

      it('should return influencer info by username query', (done) => {
        request(base_url + 'api/influencer/snoopdogg', (err, res, body) => {
          let user = JSON.parse(body);
          expect(user[0].full_name).toBe('Snoop Dogg');
          expect(user[0].profile_picture).toBe('http://distillery.s3.amazonaws.com/profiles/profile_1574083_75sq_1295469061.jpg');
          expect(user[0].bio).toBe('This is my bio');
          expect(user[0].website).toBe('http://snoopdogg.com');
          done();
        })
      });
    });
  });
});
