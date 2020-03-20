# simplefarmbench
Simple farm bench to monitor temp and humidity

## Pi setup
Update your pi:
```
sudo apt-get update
```

Install build-essentials:
```
sudo apt-get install build-essential
```

Install python3
```
sudo apt-get install python3
```

Install pip3
```
sudo apt-get install python3-pip
```

Install GPIO library
```
pip3 install RPi.GPIO
```

Install Pillow library
```
sudo apt-get install python3-pil
```

Install the Adafruit SD11306 library (read more here: https://learn.adafruit.com/monochrome-oled-breakouts/python-setup)
```
pip3 install adafruit-circuitpython-ssd1306
```

### Wiring

DHT11 <> Pi