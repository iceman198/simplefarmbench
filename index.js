"use strict";
let exec = require('child_process').exec;
//let display = require('./modules/display.js');
const express = require('express');
let sensorLib = require('node-dht-sensor');
let rgpio = require('rpi-gpio');

let sensorType = 11; // 11 for DHT11, 22 for DHT22 and AM2302
let sensorPin = 4;  // The GPIO pin number for sensor signal

let relayPin = 12; // for this library, it is really GPIO-18

//const url = require('url');
const app = express();
const port = 8080;

let myIp = "";
let dispInterval;
let mycount = 0;
let lampStatus = "off";
let tempF = "0";
let humidity = "0";


startup();
console.log('Ready');

app.use(express.static('public'));

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
        } else if (cmd == "gethumidity") {
            // return the humidity
        } else if (cmd == "gettemp") {
            // return the temp
        } else if (cmd == "getlamp") {
            // return the lamp status
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
    let lines = ["Shutting down"];
    //display.write(lines);
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
    rgpio.setup(relayPin, rgpio.DIR_LOW);

    getIP();
    let mytext = `IP: ${myIp}`;
    console.log(`startup() ~ IP: ${myIp}`);

    if (!sensorLib.initialize(sensorType, sensorPin)) {
        console.warn('Failed to initialize sensor');
        process.exit(1);
    }

    dispInterval = setInterval(function () {
        if (mycount > 100) { mycount = 0; }
        let readout = sensorLib.read();
        let f = (readout.temperature.toFixed(1) * 1.8) + 32;
        //console.log('Temperature:', readout.temperature.toFixed(1) + 'C');
        //console.log('Humidity:   ', readout.humidity.toFixed(1)    + '%');

        //display.write([mytext, `T: ${readout.temperature.toFixed(1)} C | ${f}F`, `Humidity: ${readout.humidity.toFixed(1)}%`, `${mycount}`]);

        if (f > 77) {
            setLamp(false);
        } else {
            setLamp(true);
        }
        mycount++;
    }, 2000);
}

async function setLamp(on) {
    if (on) {
        console.log(`setLamp() ~ turning it on`);
        lampStatus = "ON";
        await setPin(relayPin, 1);
        // set the lamp on
    } else {
        console.log(`setLamp() ~ turning it off`);
        lampStatus = "OFF";
        await setPin(relayPin, 0);
        // set the lamp off
    }
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

function setPin(pin, stat) {
    return Promise((resolve, reject) => {
        try {
            let value = false;
            if (stat == 1) { value = true; }
            rgpio.write(pin, value, function (err) {
                if (err) throw err;
                console.log(`setPin() ~ Set pin ${pin} to ${value}`);
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    }).catch((err) => {});
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
});
