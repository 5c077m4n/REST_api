'use strict';
const express = require('express');
const jsonParser = require('body-parser').json;
const logger = require('morgan');
const mongoose = require("mongoose");
const middleware = require('./middleware');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(jsonParser());

mongoose.connect("mongodb://localhost:27017/qa");
const db = mongoose.connection;
db.on("error", (err) => {console.error("connection error: " + err)});
db.once("open", () => {console.log("You have been successfully connected to the database.")});

app.use(middleware.cors);
app.use('/questions', require('./routes'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('The requested page cannot be found.');
	err.status = 404;
	next(err);
});

// Error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message,
			status: err.status
		}
	});
});

app.listen(PORT, () => {
	console.log(`Express is now running on port ${PORT}`);
});