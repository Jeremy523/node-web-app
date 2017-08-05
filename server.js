const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// heroku will set an env PORT value
const port = process.env.PORT || 3000;

var app = express();


hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});


app.set('view engine', 'hbs');

// using middleware to add functionality
// NEED next(), this all runs before app renders
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log');
		}
	});
	next();
});

// interrupt site and render maintenance page
// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');
// });

// using a static directory instead of handlers
app.use(express.static(__dirname + '/public'));

// handlers galore!
app.get('/', (req, res) => {
	res.render('home.hbs', {
		pageTitle: 'Home',
		welcomeMessage: 'Welcome!'
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

app.get('/projects', (req, res) => {
	res.render('projects.hbs', {
		pageTitle: 'Personal Projects'
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMsg: 'ERROR: Unable to handle request'
	});
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
