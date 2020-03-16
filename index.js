"use strict";
let exec = require('child_process').exec;
let display = require('./modules/display.js');
const express = require('express');
let sensorLib = require('node-dht-sensor');

let sensorType = 11; // 11 for DHT11, 22 for DHT22 and AM2302
let sensorPin  = 4;  // The GPIO pin number for sensor signal

//const url = require('url');
const app = express();
const port = 8080;

let myIp = "";
let dispInterval;
let mycount = 0;

startup();
console.log('Ready');

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
});

app.get('/service/', (request, response) => {
    //var url_parts = url.parse(request.url, true);
    //var query = url_parts.query;
    let cmd = request.query.cmd;
    console.log(`app()/service ~ cmd is ${cmd}`);
    if (cmd) {
        if (cmd == "shutdown") {
            console.log('app()/service ~ sending command: ' + cmd);
            response.sendStatus(`Shutdown initiated`);
            shutdown();
        } else {
            response.sendStatus(`Command not recognized`);
        }

    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log('app().listen ~ something bad happened', err)
    }

    console.log(`app().listen ~ server is listening on ${port}`)
});

function shutdown() {
    let lines = [{ "text": "Shutting down" }];
    display.write(1, lines);
    let dir = exec(`shutdown now`, function (err, stdout, stderr) {
        if (err) {
            console.log('shutdown() ~ error sending command: ', err);
        }
        console.log(`shutdown() ~ stdout: ${stdout}`);
    });

    dir.on('exit', function (code) {
        console.log('shutdown() ~ exit complete with code ', code);
    });
}

function startup() {
    getIP();
    let mytext = `IP: ${myIp}`;
    console.log(`startup() ~ IP: ${myIp}`);

    if (!sensorLib.initialize(sensorType, sensorPin)) {
        console.warn('Failed to initialize sensor');
        process.exit(1);
    }

    dispInterval = setInterval(function() {
        let readout = sensorLib.read();
        blynk.virtualWrite(3, readout.temperature.toFixed(1));
        blynk.virtualWrite(4, readout.humidity.toFixed(1));
        
        console.log('Temperature:', readout.temperature.toFixed(1) + 'C');
        console.log('Humidity:   ', readout.humidity.toFixed(1)    + '%');
        
        display.write([mytext, `Temp: ${readout.temperature.toFixed(1)}C`, `Humidity: ${readout.humidity.toFixed(1)}%`, `${mycount}`]);
        mycount++;
    }, 2000);
}

function getIP() {
    let os = require('os');
    let ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
        if (ifname.indexOf("wlan") > -1) {
            let alias = 0;

            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }

                if (alias >= 1) {
                    // this single interface has multiple ipv4 addresses
                    console.log(`getIP() ~ ${ifname}:${alias} - ${iface.address}`);
                    myIp = iface.address;
                } else {
                    // this interface has only one ipv4 adress
                    console.log(`getIP() ~ ${ifname} - ${iface.address}`);
                    myIp = iface.address;
                }
                ++alias;
            });
        }
    });
}