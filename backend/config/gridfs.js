const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let phoneBucket;
let bannerBucket;

const initGridFS = () => {
  const connection = mongoose.connection;
  if (!connection || !connection.db) {
    throw new Error('Mongoose connection DB is not ready. Cannot initialize GridFS.');
  }

  phoneBucket = new GridFSBucket(connection.db, {
    bucketName: 'phones'
  });

  bannerBucket = new GridFSBucket(connection.db, {
    bucketName: 'banners'
  });

  return { phoneBucket, bannerBucket };
};

const getGridFS = (bucketType = 'phones') => {
  if (bucketType === 'banners') {
    if (!bannerBucket) {
      throw new Error('Banner GridFS not initialized');
    }
    return bannerBucket;
  }

  if (!phoneBucket) {
    throw new Error('Phone GridFS not initialized');
  }
  return phoneBucket;
};

module.exports = {
  initGridFS,
  getGridFS
};
