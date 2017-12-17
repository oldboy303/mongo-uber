const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

// we must require the driver model via mongoose because every time the test suite
// reruns mocha will try to initialize the model again and mongoose will throw an 
// error that we are trying to model a model that already exists
const Driver = mongoose.model('driver');

describe('Drivers controller', () => {

  it('post request to /api/drivers creates a new driver', (done) => {
    Driver.count().then((count) => {
      request(app)
      .post('/api/drivers')
      .send({ email: 'test@test.com' })
      .end(() => {
        Driver.count().then((newCount) => {
          assert(count + 1 === newCount);
          done();
        });
      });
    });
  });

});