let display = require('./modules/display.js');

let myIp = "";

startup();

function startup() {
    getIP();
    display.write(["myIp"]);
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
                    console.log(ifname + ':' + alias, iface.address);
                    myIp = iface.address;
                } else {
                    // this interface has only one ipv4 adress
                    console.log(ifname, iface.address);
                    myIp = iface.address;
                }
                ++alias;
            });
        }
    });
}