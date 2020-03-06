const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbURI }  = require('../config/environment');
const User       = require('../models/user');

mongoose.connect(dbURI);

User.collection.drop();

User
  .create([{
    username: 'raidendilan',
    email: 'raiden18@me.com',
    password: 'password',
    passwordConfirmation: 'password'
  }])
  .then((users) => console.log(`${users.length} users created!`))
  .catch((err) => console.log(err))
  .finally(() => mongoose.connection.close());
