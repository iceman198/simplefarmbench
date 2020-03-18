"use strict";

let OLED = require('oled-ssd1306-i2c'); // https://github.com/perjg/oled_ssd1306_i2c
//let OLED = require('oled-i2c-bus');
//let OLED = require('oled-js-pi');
let font = require('oled-font-5x7');
//let i2c = require('i2c-bus');
//let i2cBus = i2c.openSync(1);

let oled_opts = {
    width: 128, // screen width
    height: 32, // screen height
    address: 0x3C, // Pass I2C address of screen if it is not the default of 0x3C
    device: '/dev/i2c-1', // Pass your i2c device here if it is not /dev/i2c-1
    microview: true, // set to true if you have a microview display
};

let oled = new OLED(oled_opts);
//let oled = new OLED(i2cBus, oled_opts);
oled.turnOnDisplay();

function writeOled(lines) {
    console.log(`writeOled() ~ clearing the display`);
    oled.clearDisplay();
    console.log(`writeOled() ~ done clearing the display`);

    for (let i = 0; i < lines.length; i++) {
        let cursorInt = (i * 8);
        console.log(`writeOled() ~ Set cursorInt to ${cursorInt}`);
        oled.setCursor(1, 1 + cursorInt);
        let linetxt = lines[i];
        console.log(`writeOled() ~ linetxt: ${linetxt}`);
        oled.writeString(font, 1, linetxt, 1, false);
    }
    console.log(`writeOled() ~ updating`);
    oled.update();
}

exports.write = function(mylines) {
    console.log(`display.write ~ my lines are : ${mylines}`);
    writeOled(mylines);
}
