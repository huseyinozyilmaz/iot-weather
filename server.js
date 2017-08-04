var app = require('express')()
var engine = require('express-dot-engine')
var server = require('http').Server(app)
var io = require('socket.io')(server)
var url = require('url')
var ip = require('ip')
var os = require("os")
var dateFormat = require('dateformat')
var sensorlib = require('node-dht-sensor')

var config = {
  protocol: 'http:',
  slashes: true,
  hostname: ip.address(),
  port: 3001,
  frequency: 5000
}

app.engine('dot', engine.__express)
app.set('views', __dirname + '/views')
app.set('view engine', 'dot')

server.listen(config.port, function() {
  console.log('App running on ' + url.format(config))
  readSensor()
})

app.get('/', function (req, res) {
  res.render('index', { hostname : url.format(config)})
});

var sensor = {
  initialize: function () {
    return sensorlib.initialize(22, 4)
  },
  read: function () {
    var readout = sensorlib.read()
    var timestamp = new Date()
    var readings = {
      id: os.hostname(),
      temperature : {
        value: readout.temperature.toFixed(2),
        unit: '°C',
        timestamp: timestamp
      },
      humidity : {
        value: readout.humidity.toFixed(2),
        unit: '%',
        timestamp: timestamp
      }
    }
    return readings
  }
}

io.on('connection', function (socket) {
    var delay = 5000;

    if (sensor.initialize()) {
        sensor.read();
    } else {
        console.warn('Failed to initialize sensor');
        socket.send({error:"Failed to initialize sensor"});
    }
})

function random (low, high) {
  return Math.random() * (high - low) + low;
}

function readSensor() {
  if (sensor.initialize()) {
    setTimeout(function () {
      var readings = sensor.read()
      console.clear()
      console.log('%s [%s] Temperature: %d%s | Humidity: %d%%',
        dateFormat(timestamp, 'isoDateTime'),
        readings.id,
        readings.temperature.value,
        readings.temperature.unit,
        readings.humidity.value
      )
    }, config.frequency)
  }
}
