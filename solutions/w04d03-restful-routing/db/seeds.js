const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const dbURI = 'mongodb://localhost/restful-routing';
mongoose.connect(dbURI);

const Book = require('../models/book');

Book.collection.drop();

Book
  .create([{
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'The Great Gatsby is a 1925 novel written by American author F. Scott Fitzgerald that follows a cast of characters living in the fictional town of West Egg on prosperous Long Island in the summer of 1922.'
  },{
    title: 'Of Mice and Men',
    author: 'John Steinbeck',
    description: 'Of Mice and Men is a novella written by author John Steinbeck. Published in 1937, it tells the story of George Milton and Lennie Small, two displaced migrant ranch workers, who move from place to place in California in search of new job opportunities during the Great Depression in the United States.'
  }])
  .then((books) => {
    console.log(`${books.length} books created!`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });

