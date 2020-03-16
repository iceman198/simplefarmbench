"use strict";

let OLED = require('oled-ssd1306-i2c'); // https://github.com/perjg/oled_ssd1306_i2c
let font = require('oled-font-5x7');

let oled_opts = {
    width: 128, // screen width
    height: 32, // screen height
    address: 0x3C, // Pass I2C address of screen if it is not the default of 0x3C
    device: '/dev/i2c-1', // Pass your i2c device here if it is not /dev/i2c-1
    microview: true, // set to true if you have a microview display
};

let oled = new OLED(oled_opts);
oled.turnOnDisplay();

function writeOled(lines) {
    oled.clearDisplay();
    for (let i = 0; i < lines.length; i++) {
        let cursorInt = (i * 8);
        //console.log("Set cursorInt to " + cursorInt);
        oled.setCursor(1, 1 + cursorInt);
        let linetxt = lines[i];
        //console.log(`linetxt: ${linetxt}`);
        oled.writeString(font, 1, linetxt, 1, false);
    }
    oled.update();
}

exports.write = function(mylines) {
    //console.log(`my lines are : ${mylines}`);
    writeOled(mylines);
}
