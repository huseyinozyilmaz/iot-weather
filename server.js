var app = require('express')();
var engine = require('express-dot-engine');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var url = require('url');
var ip = require('ip');
var os = require("os");
var sensorlib = require('node-dht-sensor');

var config = { 
    protocol: 'http:',
    slashes: true,
    hostname: ip.address(),
    port: 3001
};

app.engine('dot', engine.__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'dot');

server.listen(config.port, function(){
    console.log('App running on ' + url.format(config));
});

app.get('/', function (req, res) {
    res.render('index', { hostname : url.format(config)});
});

io.on('connection', function (socket) {
    var delay = 5000;

    var sensor = {
        initialize: function () {
            return sensorlib.initialize(22, 4);
        },
        read: function () {
            var readout = sensorlib.read();
            var timestamp = new Date();
            var readings = {
                id: os.hostname(),
                temperature : {
                    value: readout.temperature,
                    unit: "°C",
                    timestamp: timestamp
                },
                humidity : {
                    value: readout.humidity,
                    unit: "%",
                    timestamp: timestamp
                }
            };
            console.log("T:" + readout.temperature.toFixed(2) + " | H:" + readout.humidity.toFixed(2));
            socket.send(readings); 
            setTimeout(function () {
                sensor.read();
            }, delay);
        }
    };

    if (sensor.initialize()) {
        sensor.read();
    } else {
        console.warn('Failed to initialize sensor');
        socket.send({error:"Failed to initialize sensor"}); 
    }

    /**
    (function sendData() {
        var readings = {
            id: os.hostname(),
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
        
        setTimeout(sendData, delay);
    })();
    */
});

function random (low, high) {
    return Math.random() * (high - low) + low;
}