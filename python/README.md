# simplefarmbench
Simple farm bench to monitor temp and humidity

## Pi setup
Update your pi:
```
sudo apt-get update
```

Install a bunch of stuff and Python 3.7 (something 3.5 or better is needed for the blynka libraries):
```
sudo apt-get install build-essential libc6-dev
sudo apt-get install libncurses5-dev libncursesw5-dev libreadline6-dev
sudo apt-get install libdb5.3-dev libgdbm-dev libsqlite3-dev libssl-dev
sudo apt-get install libbz2-dev libexpat1-dev liblzma-dev zlib1g-dev
cd ~
wget https://www.python.org/ftp/python/3.7.0/Python-3.7.0.tgz
tar -zxvf Python-3.7.0.tgz
cd Python-3.7.0
./configure       # 3 min 13 s
# Let's use 4 threads
make -j4          # 8 min 29 s
sudo make install # ~ 4 min
cd ..
sudo rm -fr ./Python-3.7.0*
# upgrade:
sudo pip3 install -U pip
sudo pip3 install -U setuptools
```

Install GPIO library
```
pip3 install RPi.GPIO
```

Install the Adafruit SD11306 library (read more here: https://learn.adafruit.com/monochrome-oled-breakouts/python-setup)
```
pip3 install adafruit-circuitpython-ssd1306
```

### Wiring

DHT11 <> Pi