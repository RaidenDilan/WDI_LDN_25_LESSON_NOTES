const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const { dbURI } = require('../config/environment');
mongoose.connect(dbURI);

const User = require('../models/user');
const Film = require('../models/film');

User.collection.drop();
Film.collection.drop();

User
  .create([{
    username: 'mickyginger',
    email: 'mike.hayden@ga.co',
    password: 'password',
    passwordConfirmation: 'password'
  },{
    username: 'eisacke',
    email: 'emily.isacke@ga.co',
    password: 'password',
    passwordConfirmation: 'password'
  }])
  .then((users) => {
    console.log(`${users.length} users created!`);

    return Film
      .create([{
        name: 'The Bourne Identity',
        releaseDate: '2002-06-14',
        synopsis: 'A man is picked up by a fishing boat, bullet-riddled and suffering from amnesia, before racing to elude assassins and regain his memory.',
        genre: 'Action',
        wikipedia: 'https://en.wikipedia.org/wiki/The_Bourne_Identity_(2002_film)',
        images: [
          'https://upload.wikimedia.org/wikipedia/en/a/ae/BourneIdentityfilm.jpg',
          'http://cdn2.thr.com/sites/default/files/imagecache/scale_crop_768_433/2013/04/the_bourne_identity.jpg',
          'http://static.guim.co.uk/sys-images/Film/Pix/pictures/2008/06/06/bourneidentity460.jpg'
        ]
      }, {
        name: 'Run Lola Run',
        releaseDate: '1999-06-18',
        synopsis: 'After a botched money delivery, Lola has 20 minutes to come up with 100,000 Deutschmarks.',
        genre: 'Thriller',
        wikipedia: 'https://en.wikipedia.org/wiki/Run_Lola_Run',
        images: [
          'http://cdn.miramax.com/media/assets/Run-Lola-Run1.png',
          'https://assets.mubi.com/images/film/124/image-w856.jpg?1481117473',
          'https://www.jonathanrosenbaum.net/wp-content/uploads/2010/04/run_lola_run-5.jpg'
        ]
      }]);
  })
  .then((films) => {
    console.log(`${films.length} films created!`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });