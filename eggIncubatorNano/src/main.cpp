#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_I2CDevice.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define DHTPIN 2
#define DHTTYPE    DHT11     // DHT 11
DHT_Unified dht(DHTPIN, DHTTYPE);

int maxTemp = 108;
int minTemp = 102;

int relayPin = 3;
String lamp = "OFF";

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     4 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  Serial.begin(9600);

  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW);

  dht.begin();
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
    dht.temperature().getSensor(&sensor);
  Serial.println(F("------------------------------------"));
  Serial.println(F("Temperature Sensor"));
  Serial.print  (F("Sensor Type: ")); Serial.println(sensor.name);
  Serial.print  (F("Driver Ver:  ")); Serial.println(sensor.version);
  Serial.print  (F("Unique ID:   ")); Serial.println(sensor.sensor_id);
  Serial.print  (F("Max Value:   ")); Serial.print(sensor.max_value); Serial.println(F("°C"));
  Serial.print  (F("Min Value:   ")); Serial.print(sensor.min_value); Serial.println(F("°C"));
  Serial.print  (F("Resolution:  ")); Serial.print(sensor.resolution); Serial.println(F("°C"));
  Serial.println(F("------------------------------------"));
  // Print humidity sensor details.
  dht.humidity().getSensor(&sensor);
  Serial.println(F("Humidity Sensor"));
  Serial.print  (F("Sensor Type: ")); Serial.println(sensor.name);
  Serial.print  (F("Driver Ver:  ")); Serial.println(sensor.version);
  Serial.print  (F("Unique ID:   ")); Serial.println(sensor.sensor_id);
  Serial.print  (F("Max Value:   ")); Serial.print(sensor.max_value); Serial.println(F("%"));
  Serial.print  (F("Min Value:   ")); Serial.print(sensor.min_value); Serial.println(F("%"));
  Serial.print  (F("Resolution:  ")); Serial.print(sensor.resolution); Serial.println(F("%"));
  Serial.println(F("------------------------------------"));

  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { //Ive changed the address //already chill
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  // Show initial display buffer contents on the screen --
  // the library initializes this with an Adafruit splash screen.
  display.display();
  delay(2000); // Pause for 2 seconds

  // Clear the buffer
  display.clearDisplay();
  display.setTextSize(2); // Draw 2X-scale text
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 0);
  display.println(F("Loading..."));
  display.display();      // Show initial text
  delay(100);


  // Invert and restore display, pausing in-between
  //display.invertDisplay(true);
  //delay(1000);
  //display.invertDisplay(false);
  //delay(1000);
}

void loop() {
  delay(2000);
  int tempF = 0;
  int tempC = 0;
  int hum = 0;

  sensors_event_t event;
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println(F("Error reading temperature!"));
  }
  else {
    tempC = (int)(event.temperature+0.5f);
    tempF = (int)(((tempC * 1.8) + 32)+0.5f);

    //Serial.print(F("Temperature: "));
    //Serial.print(tempC);
    //Serial.println(F("°C"));
    //Serial.print(tempF);
    //Serial.println(F("°F"));
  }
  // Get humidity event and print its value.
  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    Serial.println(F("Error reading humidity!"));
  }
  else {
    hum = (int)(event.relative_humidity+0.5f);
    //Serial.print(F("Humidity: "));
    //Serial.print(hum);
    //Serial.println(F("%"));
  }

  if (tempF > maxTemp) {
    lamp = "OFF";
    digitalWrite(relayPin, LOW);
  }
  if (tempF < minTemp) {
    lamp = "ON";
    digitalWrite(relayPin, HIGH);
  }
  String tempStr = "";
  tempStr.concat(tempF);
  tempStr.concat("F");

  String humStr = "";
  humStr.concat(hum);
  humStr.concat("% Hum");

  String lampStr = "";
  lampStr.concat("Lamp: ");
  lampStr.concat(lamp);

  Serial.println(tempStr);
  Serial.println(humStr);
  Serial.println(lampStr);

  display.clearDisplay();
  display.setTextSize(2); // Draw 2X-scale text
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println(tempStr);
  display.setCursor(0,20);
  display.println(humStr);
  display.setCursor(0,40);
  display.println(lampStr);
  display.display();      // Show initial text

}
