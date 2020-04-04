const express = require('express');
const app = express();
const morgan = require('morgan');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('bot', { direction: 'Do you have a test for that?', yes: '/pass', no: '/write_test' }));
app.get('/pass', (req, res) => res.render('bot', { direction: 'Does the test pass?', yes: '/refactor', no: '/write_code' }));
app.get('/write_test', (req, res) => res.render('done', { direction: 'Write a test', yes: '/pass' }));
app.get('/refactor', (req, res) => res.render('bot', { direction: 'Need to refactor?', yes: '/do_refactor', no: '/new_feature' }));
app.get('/do_refactor', (req, res) => res.render('done', { direction: 'Refactor the code.', yes: '/pass' }));
app.get('/write_code', (req, res) => res.render('done', { direction: 'Write just enough code for the test to pass.', yes: '/pass' }));
app.get('/new_feature', (req, res) => res.render('done', { direction: 'Select a new feature to implement.', yes: '/' }));

app.listen(3000, () => console.log('Express is up and running on port 3000'));
