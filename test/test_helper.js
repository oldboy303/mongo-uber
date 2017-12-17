const mongoose = require('mongoose');

before((done) => {
  mongoose.connect(
    'mongodb://localhost/mongo-uber_test', 
    { useMongoClient: true }
  );
  mongoose.connection
    .once('open', () => done())
    .on('error', (error) => console.warn('Warning', error));
});

beforeEach((done) => {
  const { drivers } = mongoose.connection.collections; 
  drivers.drop()
    .then(() => done())
    .catch(() => done());
});