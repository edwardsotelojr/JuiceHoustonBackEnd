const mongoose = require('mongoose');

const removeCollection = (collection) => {
    return new Promise((resolve, reject) => {
      collection
        .deleteMany()
        .then(resolve)
        .catch((err) => {
          return reject(err);
        });
    });
  };

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongoose.uri, config.mongoose.options);
  });

  beforeEach(async () => {
    await Promise.all(_.map(mongoose.connection.collections, (c) => removeCollection(c)));;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;