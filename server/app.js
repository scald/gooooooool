var restify = require('restify');
var settings = require('./settings');

var server = restify.createServer({
    name: 'shrek-server',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var checkToken = function(req,res) {
	if (!( typeof req.query.token !== 'undefined' && req.query.token == settings.token )) {
    	res.send("INVALID TOKEN");
    	return next();
	}
};

server.get('/are/you/alive', function(req, res, next) {
	checkToken(req,res);
    res.send("SHREK LIVES!");
    return next();
});

// forward

server.get('/move/forward', function(req, res, next) {
    res.send("Moving forward...");
    return next();
});

// back

server.get('/move/back', function(req, res, next) {
    res.send("Moving back...");
    return next();
});

// turn left

server.get('/turn/left', function(req, res, next) {
    res.send("Turning left...");
    return next();
});

// turn right
server.get('/turn/right', function(req, res, next) {
    res.send("Turning right...");
    return next();
});


server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
