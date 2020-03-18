# simplefarmbench
Simple farm bench to monitor temp and humidity

## Pi setup
Install bcm library found here: https://www.instructables.com/id/Raspberry-Pi-Nodejs-Blynk-App-DHT11DHT22AM2302/

```
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz
tar zxvf bcm2835-1.46.tar.gz
cd bcm2835-1.46
./configure
make
sudo make check
sudo make install
```

## Node setup
You'll want to install node version manager....take your pick on this, I am using: https://github.com/tj/n

I went with version 6.10.3

## Running
You should now be able to do a `npm install`. This may take a little bit depending on what Raspberry Pi you're running.  Once done, you can start the application by running `node index.js`.

