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

int loopTracker = 0;
int loopTrackerMax = 50;
int loopDelay = 200; // in miliseconds

int maxTemp = 100.0;
int minTemp = 99.6;

bool atHomeScreen = true;
int buttons[] = {12, 11, 10, 9};
int buttonDownPin = 11;
int buttonSelectPin = 10;
int buttonMenuPin = 9;
int buttonCount = 4; // since we have 4 buttons

int relayPin = 3;
String lamp = "OFF";

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     4 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void initSensors() {
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
}

void initDisplay() {
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

void updateDisplay(String line1, String line2, String line3) {
    display.clearDisplay();
    display.setTextSize(2);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println(line1);
    display.setCursor(0,20);
    display.println(line2);
    display.setCursor(0,40);
    display.println(line3);
    display.display();
}

int checkButtons() {
  int bp = 0;
  for (int i = 0; i < buttonCount; i++) {
    if (digitalRead(buttons[i]) == 0) {
      bp = buttons[i];
      //Serial.print("Button "); Serial.print(buttons[i]); Serial.println(" was 0");
    } else {
      //Serial.print("Button "); Serial.print(buttons[i]); Serial.println(" was 1");
    }
  }
  return bp;
}

void setupButtons() {
  for (int t = 0; t < buttonCount; t++) {
    pinMode(buttons[t], INPUT_PULLUP);
  }
}

void setup() {
  Serial.begin(9600);
  setupButtons();
  initSensors();
  initDisplay();
}

void loop() {
  if (!atHomeScreen) {
    loopTracker++;
  }
  delay(loopDelay);

  int tempF = 0;
  int tempC = 0;
  int hum = 0;

/*
  int b = checkButtons();
  if (b > 0) {
    atHomeScreen = false;
  }

  switch (b) {
    case 12:
      Serial.println("Button 12 was pressed");
      break;
    case 11:
      Serial.println("Button 11 was pressed");
      break;
    case 10:
      Serial.println("Button 10 was pressed");
      break;
    case 9:
      Serial.println("Button 9 was pressed");
      break;
    default:
      break;
  }
*/

  sensors_event_t event;
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println(F("Error reading temperature!"));
  }
  else {
    tempC = (int)(event.temperature+0.5f);
    tempF = (int)(((tempC * 1.8) + 32)+0.5f);
  }

  // Get humidity event and print its value.
  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    Serial.println(F("Error reading humidity!"));
  }
  else {
    hum = (int)(event.relative_humidity+0.5f);
  }

  if (tempF > 10) {
    if (tempF > maxTemp) {
      lamp = "OFF";
      digitalWrite(relayPin, LOW);
    }
    if (tempF < minTemp) {
      lamp = "ON";
      digitalWrite(relayPin, HIGH);
    }
  } else {
    lamp = "ERR";
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

  if (atHomeScreen) {
    updateDisplay(tempStr, humStr, lampStr);
  }

  if (loopTracker > loopTrackerMax) {
    loopTracker = 0;
    atHomeScreen = true;
  }
}
