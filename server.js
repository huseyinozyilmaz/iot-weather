var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var url = require('url');
var ip = require('ip');

var config = { 
    protocol: 'http:',
    slashes: true,
    hostname: ip.address(),
    port: 3001
};

server.listen(config.port, function(){
    console.log('App running on ' + url.format(config));
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    setInterval(function() {
        var readings = {
            temperature : {
                value: random(20,25),
                unit: "°C",
                timestamp: new Date()
            },
            humidity : {
                value: random(50,75),
                unit: "%",
                timestamp: new Date()
            }
        };
        console.log(readings);
        socket.send(readings);    
    }, 5000);
});

function random (low, high) {
    return Math.random() * (high - low) + low;
}