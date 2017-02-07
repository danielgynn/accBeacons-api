// Set MongoDB database URL.
module.exports = {
  'development': {
    'secret': 'secretsecretsecret',
    'url': 'mongodb://localhost/access-beacons'
  },
  'production': {
    'secret': 'secretsecretsecret',
    'url': 'mongodb://heroku_w92xlp2q:8u7g1qtjoc8tef43huv2jtuhej@ds135049.mlab.com:35049/heroku_w92xlp2q'  
  }
};
