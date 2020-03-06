// require modules
const express = require('express');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const routes = require('./config/routes');
const authUser = require('./lib/authUser');
const customResponses = require('./lib/customResponses');
const errorHandler = require('./lib/errorHandler');

const { port, env, dbURI } = require('./config/environment');

// setup Express app
const app = express();
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

// setup database
mongoose.connect(dbURI);

// middleware
if(env !== 'test') app.use(morgan('dev'));

app.use(expressLayouts);
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride(function (req) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use(customResponses);
app.use(authUser);
app.use(routes);
app.use(errorHandler);

app.listen(port, () => console.log(`Express is listening on port ${port}`));