'use strict';
const express = require('express');
const middleware = require('../middleware');
const Question = require('../models').Question;
const router = express.Router();

router.param('questionID', (req, res, next, questionID) => {
	Question.findById(req.params.questionID, (err, question) => {
		if(err) return next(err);
		if(!question)
		{
			const err404 = new Error('The requested question cannot be found.');
			err404.status = 404;
			return next(err404);
		}
		req.question = question;
		return next();
	});
});
router.param('answerID', (req, res, next, answerID) => {
	req.answer = req.question.answers.id(answerID);
	if(!req.answer)
	{
		const err404 = new Error('The requested answer cannot be found.');
		err404.status = 404;
		return next(err404);
	}
	return next();
});

router.get('/', (req, res, next) => {
	// Question.find({}, null, {sort: {createdAt: -1}}, (err, questions) => {
	// 	if(err) return next(err);
	// 	res.json(questions);
	Question.find({}).sort({createdAt: -1}).exec((err, questions) => {
		if(err) return next(err);
		res.json(questions);
	});
});
router.post('/', (req, res, next) => {
	const question = new Question(req.body);
	question.save((err, question) => {
		if(err) return next(err);
		res.status(201);
		res.json(question);
	});
});

router.get('/:questionID', (req, res, next) => {
	res.json(req.question);
});
router.post('/:questionID', (req, res, next) => {
	res.json({
		response: `This is a POST request for question #${req.params.questionID}.`,
		body: req.body
	});
});
router.delete('/:questionID', (req, res, next) => {
	req.question.remove((err, question) => {
		if(err) return next(err);
		res.json(question);
	});
});

router.get('/:questionID/answers', (req, res, next) => {
	res.json({response: `This is a GET request for all answers in question #${req.params.questionID}`});
});
router.post('/:questionID/answers', (req, res, next) => {
	req.question.answers.push(req.body);
	req.question.save((err, question) => {
		if(err) return next(err);
		res.status(201);
		res.json(question);
	});
});

router.get('/:questionID/answers/:answerID', (req, res, next) => {
	res.json({
		response: `This is a GET request for answer #${req.params.answerID} in question #${req.params.questionID}`
	});
});
router.put('/:questionID/answers/:answerID', (req, res, next) => {
	req.answer.update(req.body, (err, result) => {
		if(err) return next(err);
		res.json(result);
	});
});
router.delete('/:questionID/answers/:answerID', (req, res, next) => {
	req.answer.remove((err) => {
		req.question.save((err, question) => {
			if(err) return next(err);
			res.json(question);
		});
	});
});

router.get('/:questionID/answers/:answerID/vote-:direction', middleware.validVote, (req, res, next) => {
	res.json({
		response: `This is a GET request for voting ${req.params.direction.toUpperCase()} for answer #${req.params.answerID} in question #${req.params.questionID}`
	});
});
router.post('/:questionID/answers/:answerID/vote-:direction', middleware.validVote, (req, res, next) => {
	req.answer.vote(req.vote, (err, question) => {
		if(err) return next(err);
		res.json(question);
	});
});

module.exports = router;