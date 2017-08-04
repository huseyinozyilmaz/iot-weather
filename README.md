# IOT Weather

## Development
IOT Weather application is built with Node.js and Socket.io
### Upgrading dependencies
You can use ```npm-check-updates``` to update application dependencies.
**Install**
```npm install -g npm-check-updates```
**Check dependencies**
```ncu```
**Update dependencies**
```
ncu -u
ncu -a
```

## Testing
To test the application run:
```npm test```
## Setup

### RasberryPi Setup
iot-weather application can be used in a raspberry pi capable of running Node.js.
#### Headless Raspberry Pi Setup in Mac OS
1. Format your SD Card with SDFormatter
2. Download Raspberry Pi OS image from https://downloads.raspberrypi.org/raspbian_lite_latest
3. Checksum the image file downloaded: ```shasum ~/Downloads/2017-04-10-raspbian-jessie-lite.zip```
4. Get the list of disks: ```diskutil list```
5. Identify the disk used by SD Card
6. First unmount the disk: ```diskutil unmountDisk /dev/disk2```
7. Flash the disk with the image file: ```sudo dd bs=1m if=~/Downloads/2017-04-10-raspbian-jessie-lite.img of=/dev/rdisk2```
8. You can check your wireless configuration: ```/System/Library/PrivateFrameworks/Apple80211.framework/Versions/A/Resources/airport -I en1```
9. Create a wpa_supplicant file:
```
cat > /Volumes/boot/wpa_supplicant.conf << EOF
network={
    ssid="WIRELESSSID"
    psk="WIRELESSPASSWORD"
}
EOF
```
10. Enable ssh by creating a empty file: ```touch /Volumes/boot/ssh```
11. Eject your SD card from Mac
12. Connect to your rapsberrypi. You can list all devices in your network: ```ifconfig | grep broadcast | arp -a```. Find the ip address of your raspberrypi and connect via ssh: ```ssh pi@192.168.1.112```
13. Change the default hostname and password using raspi-config. Update it before you exit: ```sudo raspi-config```
14. Encrypt plain wireless password in wpa_supplicant.conf file
15. Generate the encrypted psk: ```wpa_passphrase "WIRELESSSID" "WIRELESSPASSWORD"```
16. Copy the encrypted psk. Edit wpa_supplicant.conf and replace the plain psk with the encrypted one: ```sudo nano /etc/wpa_supplicant/wpa_supplicant.conf```
17. Update system's package list, upgrade all installed packages to their latest versions and clean downloaded package files:
```
sudo apt-get -y update
sudo apt-get -y dist-upgrade
sudo apt-get clean
```
18. Reboot the machine: ```sudo reboot```
#### Configure Raspberry Pi for IOT Weather
1. Open Raspberry Pi configuration tool: ```sudo raspi-config```
2. Force audio to headphone jack
3. Change default boot option to **Console Autologin** to allow Raspberry Pi to automatically login as pi user on start up.
4. Change **Timezone** in Localisation Options setting
5. Reboot the machine.

#### Node.js Installation
In default, Node.js requires a Pi system based on the newer ARMv7 or ARMv8 chip. This can be checked by running:
```uname -m```
If you are running on ARMv6 chip you can still install Node.js using the right bundle. Check https://nodejs.org/dist/latest-v6.x/ and download the right package.
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install nodejs
```
Check the version ```node -v``` and you should see ```v6.11.2```

#### Install Git
```
sudo apt-get install git
```

## Installation
### Prerequisites
1. BCM 2835 Library
```
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.52.tar.gz
tar zxvf bcm2835-1.52.tar.gz
cd bcm2835-1.52
./configure
make
sudo make check
sudo make install
cd..
rm bcm2835-1.52.tar.gz
```
2. Connect DHT22 sensor to Raspberry Pi
```
DHT22  Raspberry Pi
-----  ---------------
 DAT -> PIN 7 (GPIO4)
 VCC -> PIN 1 (3V)
 GND -> PIN 6 (Ground)
```
### Clone Project
Clone the application from https://github.com/huseyinozyilmaz/iot-weather.git and install all the dependencies:
```
git clone https://github.com/huseyinozyilmaz/iot-weather.git
cd iot-weather
npm install
```
### Install as a startup application
Edit **/etc/rc.local** file and add the following line before 0
```su pi -c 'node /home/pi/iot-weather/app.js < /dev/null &'```

### Install as a service:
```
sudo npm install forever -g
sudo npm install forever-service -g
sudo forever-service install iot-weather-service
```
If the service installation is successful then you should be able to start, stop, restart the service:
```
sudo service iot-weather-service start
sudo service iot-weather-service stop
sudo service iot-weather-service restart
sudo service iot-weather-service status
```
To run the service at the startup, open the file **/etc/rc.local** :
```
sudo nano /etc/rc.local
```
and add the following line before 0:
```
sudo service iot-weather-service start
```
