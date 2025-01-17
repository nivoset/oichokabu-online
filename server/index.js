const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const session = require('./db/session');
const sockets = require('./sockets');
const { passport } = require('./passport');

app.use(cors({
	origin: process.env.DEV_ORIGIN,
	credentials: true,
}));

// get cards as static images
app.use(express.static(path.join(__dirname, '..', 'public/cards')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session);
app.sockets = sockets;

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes'));

app.get('*', function(req, res, next) {
	res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

// 404 error catcher
app.use(function(req, res, next) {
	res.status(404).send("Unable to find requested resource");
});

// handler for other errors
app.use((err, req, res, next) => {
	if (err) {
		req.logout();
		next();
	}
	console.error(err.stack);
	res.status(err.status || 500).send(err.message);
});

module.exports = app;