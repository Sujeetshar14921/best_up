const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gfsBucket;

const initGridFS = () => {
  const connection = mongoose.connection;
  if (!connection || !connection.db) {
    throw new Error('Mongoose connection DB is not ready. Cannot initialize GridFS.');
  }

  gfsBucket = new GridFSBucket(connection.db, {
    bucketName: 'phones'
  });
  return gfsBucket;
};

const getGridFS = () => {
  if (!gfsBucket) {
    throw new Error('GridFS not initialized');
  }
  return gfsBucket;
};

module.exports = {
  initGridFS,
  getGridFS
};
