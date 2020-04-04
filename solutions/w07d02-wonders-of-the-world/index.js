const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.plugin(require('./lib/globalToJSON'));
mongoose.Promise = require('bluebird');
const { port, env, dbURI } = require('./config/environment');
const routes = require('./config/routes');
const customResponses = require('./lib/customResponses');
const errorHandler = require('./lib/errorHandler');
const dest = `${__dirname}/public`;

mongoose.connect(dbURI);

const app = express();

if(env !== 'test') app.use(morgan('dev'));

app.use(express.static(dest));
app.use(customResponses);
app.use(bodyParser.json());

app.use('/api', routes);
app.get('/*', (req, res) => res.sendFile(`${dest}/index.html`));

app.use(errorHandler);

app.listen(port, () => console.log(`Express has started on port: ${port}`));
