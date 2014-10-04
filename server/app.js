var restify = require('restify');
var settings = require('./settings');
var os = require('os');
var net = require('net');

var server = restify.createServer({
    name: 'shrek-server',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var checkToken = function(req, res) {
    if (!(typeof req.query.token !== 'undefined' && req.query.token == settings.token)) {
        res.send("INVALID TOKEN");
        return next();
    }
};

server.get('/are/you/alive', function(req, res, next) {
    checkToken(req, res);
    res.send("SHREK LIVES!");
    return next();
});

// forward

server.get('/move/forward', function(req, res, next) {
    checkToken(req, res);
    res.send("Moving forward...");
    return next();
});

// back

server.get('/move/back', function(req, res, next) {
    checkToken(req, res);
    res.send("Moving back...");
    return next();
});

// turn left

server.get('/turn/left', function(req, res, next) {
    checkToken(req, res);
    res.send("Turning left...");
    return next();
});

// turn right
server.get('/turn/right', function(req, res, next) {
    checkToken(req, res);
    res.send("Turning right...");
    return next();
});


server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
    var tcpPort = 9799;
    var ip = null;
    var save_first_ipv4 = function(iface) {
        if (!ip && !iface.internal && 'IPv4' === iface.family) {
            ip = iface.address;
        }
    };
    var interfaces = os.networkInterfaces();
    for (var ifName in interfaces) {
        if (!ip) {
            interfaces[ifName].forEach(save_first_ipv4);
        }
    }

    console.log("OK I'm listening on port " + tcpPort + " here at IP address " + ip + "!");
    console.log("Now run the following curl command in another window,");
    console.log("replacing <DEVICE_ID> and <ACCESS_TOKEN>.");
    console.log("curl https://api.spark.io/v1/devices/<DEVICE_ID>/connect -d access_token=<ACCESS_TOKEN> -d ip=" + ip);
    var tcpS = net.createServer(function(socket) {
        console.log("Someone connected from " + socket.remoteAddress + ":" + socket.remotePort + "!");
        process.stdout.write('>> ');
        process.stdin.on('data', function(d) {
            d = d.toString('utf8', 0, d.length - 1);
            if (/^[0-7][lh]$/i.test(d)) {
                socket.write(d.toLowerCase());
            } else if ('x' === d) {
                process.exit(0);
            } else {
                console.log("Commands: 0h  Set pin D0 high");
                console.log("          7l  Set pin D7 low");
                console.log("              Any pin 0-7 may be set high or low");
                console.log("          x   Exit");
            }
            process.stdout.write('>> ');
        });
    });
    tcpS.listen(tcpPort);
});
