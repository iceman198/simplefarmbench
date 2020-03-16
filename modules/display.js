"use strict";

let i2c = require('i2c-bus'),
    i2cBus = i2c.openSync(1),
    OLED = require('oled-i2c-bus'),
    font = require('oled-font-5x7');;

let opts = {
    width: 128,
    height: 32,
    address: 0x3C
};

let oled = new OLED(i2cBus, opts);

exports.write = function(text) {
    oled.setCursor(1, 1);
    oled.writeString(font, 1, text, 1, true);
    //oled.update();
}
