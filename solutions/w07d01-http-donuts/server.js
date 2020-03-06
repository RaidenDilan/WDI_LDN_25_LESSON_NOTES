const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.plugin(require('./lib/globalToJSON'));
mongoose.Promise = require('bluebird');
const routes = require('./config/routes');
const customResponses = require('./lib/customResponses');
const errorHandler = require('./lib/errorHandler');

const { port, env, dbURI } = require('./config/environment');

mongoose.connect(dbURI);

const app = express();

// serve our static files from the public folder
app.use(express.static(`${__dirname}/public`));

// only use morgan in dev AND production
if(env !== 'test') app.use(morgan('dev'));

app.use(customResponses);

// set up bodyParser to use JSON
app.use(bodyParser.json());
app.use(routes);

// global errorHandler goes AFTER routes
app.use(errorHandler);

app.listen(port, () => console.log(`API online - port ${port}`));
