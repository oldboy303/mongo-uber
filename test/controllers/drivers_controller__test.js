const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

// we must require the driver model via mongoose because every time the test suite
// reruns mocha will try to initialize the model again and mongoose will throw an 
// error that we are trying to model a model that already exists
const Driver = mongoose.model('driver');

describe('Drivers controller', () => {

  it('POST request to /api/drivers creates a new driver', (done) => {
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

  it('GET to /api/drivers finds drivers near a location', (done) => {
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: { type: 'Point', coordinates: [-122.475, 47.614] }
    });
    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: { type: 'Point', coordinates: [-80.253, 25.791] }
    });

    Promise.all([ seattleDriver.save(), miamiDriver.save() ])
      .then(() => {
        request(app)
          .get('/api/drivers?lng=-80.25&lat=25.79')
          .end((err, response) => {
            assert(response.body.length === 1);
            assert(response.body[0].obj.email === 'miami@test.com');
            done();
          })
      })

  });

  it('PUT to /api/drivers/:id edits an existing driver', (done) => {
    const driver = new Driver({ email: 'jd@test.com' });

    driver.save()
      .then(() => {
        request(app)
          .put(`/api/drivers/${driver._id}`)
          .send({ driving: true })
          .end(() => {
            Driver.findById(driver._id).then((editedDriver) => {
              assert(editedDriver.driving === true);
              done();
            });
          });
      });
  });

  it('DELETE to /api/drivers/:id deletes an existing driver', (done) => {
    const driver = new Driver({ email: 'jd@test.com' });

    driver.save()
      .then(() => {
        request(app)
          .delete(`/api/drivers/${driver._id}`)
          .end(() => {
            Driver.findOne({ email: 'js@test.com' })
              .then((driver) => {
                assert(driver === null);
                done();
              });
          });
      });
  });

});