# simplefarmbench
Simple farm bench to monitor temp and humidity

## Pi setup

### Display
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

I went with version 6.10.3.  The reason for the later version is because of the DHT temp sensor and the display.  Even now, I still can't get the display working with this version.  I had it working with Node 4.X but then I ran into 'Segmentaion fault' errors once I enabled the temprature sensor.  As of right now, I am doing withough the display.

### Running as sudo
If you're using the node version manager, you will have to install the same version (same steps) as sudo if you want to be able to not run into permission issues....along with putting this in your `/etc/rc.local` file to run at startup.

## Running
You should now be able to do a `npm install`. This may take a little bit depending on what Raspberry Pi you're running.  Once done, you can start the application by running `node index.js`.

## Other notes 
You'll want to get whatever IP address your Pi is and modify the index.html file appropriately so it calls the right services