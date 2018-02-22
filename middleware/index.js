module.exports.validVote = (req, res, next) => {
	if(req.params.direction.search(/^(up|down)$/) === -1)
	{
		const err = new Error('The requested page cannot be found.');
		err.status = 404;
		return next(err);
	}
	else
	{
		req.vote = req.params.direction;
		return next();
	}
};

module.exports.cors = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accepted');
	if(req.method.toUpperCase() === 'OPTIONS')
	{
		res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
		return res.status(200).json({});
	}
	next();
};