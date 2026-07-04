#include <WiFiS3.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Adafruit_INA219.h>
#include <SolarCalculator.h>
#include <ArduinoJson.h>
#include "Arduino_LED_Matrix.h"

char ssid[] = "Patricku";
char pass[] = "12345678";

char server[] = "10.39.104.75";
int port = 4000;

const double LATITUDINE  = 45.7922;
const double LONGITUDINE = 21.2447;
const int FUS_ORAR      = 3;

const int pinSS = 6;
const int pinDS = 7;
const int pinSJ = 3;
const int pinDJ = 4;

Servo servoBaza;
Servo servoSus;

int unghiH = 90;
int unghiV = 64;

int ultimulUnghiH = 90;
int ultimulUnghiV = 64;
const int PRAG_TREMURAT = 2;
bool bazaCuplata = false;
unsigned long timpCuplareBaza = 0;
const int TIMP_RELAXARE_BAZA = 1000;

#define ONE_WIRE_BUS 2
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature senzoriTemp(&oneWire);

LiquidCrystal_I2C lcd(0x27, 16, 2);
Adafruit_INA219 ina219;
WiFiClient client;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 60000);

unsigned long ultimulTimpSenzori = 0;
unsigned long ultimulTimpAfisaj = 0;
unsigned long precedentMillis = 0;
const long interval = 1200;

float tempPanou = 0.0;
float tempRadiator = 0.0;
float tensiune_V = 0.0;
float curent_mA = 0.0;

int paginaCurenta = 0;
int stareMod = 2;
String statusMesaj = "Urmarire activa";

double azimut = 180.0;
double elevatie = 0.0;

ArduinoLEDMatrix matrix;

const uint32_t frame_soare[] = {
  0x0602040F,
  0x09F99F90,
  0xF0204060
};

const uint32_t frame_luna[] = {
  0x0701E03C,
  0x03803803,
  0xC01E0070
};

int stareMatrice = -1;

void setup() {
  Serial.begin(9600);

  pinMode(pinSS, INPUT); pinMode(pinDS, INPUT);
  pinMode(pinSJ, INPUT); pinMode(pinDJ, INPUT);

  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("  SYSTEM START  ");
  lcd.setCursor(0, 1);
  lcd.print(" TRACKER SOLAR  ");
  delay(2000);
  lcd.clear();
  lcd.print("Conectare WiFi..");

  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

 lcd.clear();
  lcd.print("WiFi Connected!");
  delay(1000);

  timeClient.begin();
  senzoriTemp.begin();
  senzoriTemp.setWaitForConversion(false);
  ina219.begin();

  servoSus.write(unghiV);
  servoSus.attach(9);

  servoBaza.write(unghiH);
  servoBaza.attach(8);
  bazaCuplata = true;
  timpCuplareBaza = millis();

  matrix.begin();
  matrix.loadFrame(frame_soare);
  stareMatrice = 1;

  lcd.clear();
}

void loop() {
  timeClient.update();

  if (millis() - ultimulTimpSenzori > 5000) {
    ultimulTimpSenzori = millis();

    senzoriTemp.requestTemperatures();
    tempPanou = senzoriTemp.getTempCByIndex(0);
    tempRadiator = senzoriTemp.getTempCByIndex(1);

    tensiune_V = ina219.getBusVoltage_V();
    curent_mA = ina219.getCurrent_mA();
  }

  if (stareMod == 1) {
    statusMesaj = "Mod Astronomic";
    unsigned long epochTime = timeClient.getEpochTime();
    calcHorizontalCoordinates(epochTime, LATITUDINE, LONGITUDINE, azimut, elevatie);

    if (elevatie < 0) {
      unghiH = 90;
      unghiV = 64;
      statusMesaj = "Parcat - Noapte";
    } else {
      unghiH = map((int)azimut, 90, 270, 15, 165);
      unghiH = constrain(unghiH, 15, 165);

      unghiV = map((int)elevatie, 0, 67, 30, 65);
      unghiV = constrain(unghiV, 30, 65);
    }
  }

  else if (stareMod == 2) {
    statusMesaj = "Urmarire LDR";

    int stareSS = digitalRead(pinSS);
    int stareDS = digitalRead(pinDS);
    int stareSJ = digitalRead(pinSJ);
    int stareDJ = digitalRead(pinDJ);

    int umbraStanga  = stareSS + stareSJ;
    int umbraDreapta = stareDS + stareDJ;

    if (umbraStanga > umbraDreapta) {
      if (unghiH < 165) unghiH += 2;
    }
    else if (umbraDreapta > umbraStanga) {
      if (unghiH > 15) unghiH -= 2;
    }

    int umbraSus = stareSS + stareDS;
    int umbraJos = stareSJ + stareDJ;

    if (umbraSus > umbraJos) {
      if (unghiV > 30) unghiV -= 2;
    }
    else if (umbraJos > umbraSus) {
      if (unghiV < 65) unghiV += 2;
    }
  }

  else if (stareMod == 3) {
    statusMesaj = "Control Manual Activat";
  }

  if (stareMod == 1 && elevatie < 0) {
    if (stareMatrice != 2) {
      matrix.loadFrame(frame_luna);
      stareMatrice = 2;
    }
  } else {
    if (stareMatrice != 1) {
      matrix.loadFrame(frame_soare);
      stareMatrice = 1;
    }
  }

  bool bazaAreDeMiscat = (abs(unghiH - ultimulUnghiH) >= PRAG_TREMURAT);
  if (bazaAreDeMiscat) {
    if (!bazaCuplata) {
      servoBaza.attach(8);
      bazaCuplata = true;
    }
    servoBaza.write(unghiH);
    ultimulUnghiH = unghiH;
    timpCuplareBaza = millis();
  }

  if (bazaCuplata && !bazaAreDeMiscat && (millis() - timpCuplareBaza > TIMP_RELAXARE_BAZA)) {
    servoBaza.detach();
    bazaCuplata = false;
  }

  servoSus.write(unghiV);
  ultimulUnghiV = unghiV;

  if (millis() - ultimulTimpAfisaj > 3000) {
    ultimulTimpAfisaj = millis();
    lcd.clear();

    if (paginaCurenta == 0) {

      lcd.setCursor(0, 0);
      if (stareMod == 1) {
        lcd.print("MOD 1.ASTRONOMIC ");
      } else if (stareMod == 2) {
        lcd.print("MOD 2. AUTOMAT LDR");
      } else if (stareMod == 3) {
        lcd.print("MOD 3. MANUAL ");
      }

      lcd.setCursor(0, 1);
      lcd.print("H:"); lcd.print(unghiH); lcd.print("  V:"); lcd.print(unghiV);

      if (stareMod == 1) {
        paginaCurenta = 1;
      } else {
        paginaCurenta = 2;
      }
    }
    else if (paginaCurenta == 1) {

      lcd.setCursor(0, 0);
      lcd.print("SOARE (ASTRO):");
      lcd.setCursor(0, 1);
      lcd.print("Az:"); lcd.print((int)azimut); lcd.print("  El:"); lcd.print((int)elevatie);
      paginaCurenta = 2;
    }
    else {

      lcd.setCursor(0, 0);
      lcd.print("U:"); lcd.print(tensiune_V, 1); lcd.print("V  I:"); lcd.print((int)curent_mA); lcd.print("mA ");

      lcd.setCursor(0, 1);
      lcd.print("Tp:"); lcd.print((int)tempPanou); lcd.print("C Tr:"); lcd.print((int)tempRadiator); lcd.print("C ");
      paginaCurenta = 0;
    }
  }

  unsigned long curentMillis = millis();
  if (WiFi.status() == WL_CONNECTED && (curentMillis - precedentMillis >= interval)) {
    precedentMillis = curentMillis;
    comunicaCuServerul(tensiune_V, curent_mA, tempPanou, tempRadiator);
  }

  delay(45);
}

void comunicaCuServerul(float tensiune, float curent, float tempP, float tempR) {
  if (client.connect(server, port)) {
    String url = "/api/telemetrie/salveaza";
    url += "?orizontal=" + String(unghiH);
    url += "&vertical=" + String(unghiV);
    url += "&tensiune=" + String(tensiune, 2);
    url += "&curent=" + String(curent, 1);
    url += "&mod=" + String(stareMod);

    String statusValid = statusMesaj;
    statusValid.replace(" ", "%20");
    url += "&stareSistem=" + statusValid;

    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: " + server + "\r\n" +
                 "Connection: close\r\n\r\n");

    unsigned long timeout = millis();
    String raspuns = "";
    while (client.connected() && millis() - timeout < 800) {
      if (client.available()) {
        char c = client.read();
        raspuns += c;
      }
    }

    int jsonStart = raspuns.indexOf("{");
    if (jsonStart >= 0) {
      String jsonBody = raspuns.substring(jsonStart);

      #if ARDUINOJSON_VERSION_MAJOR >= 7
      JsonDocument doc;
      #else
      StaticJsonDocument<384> doc;
      #endif

      DeserializationError error = deserializeJson(doc, jsonBody);
      if (!error) {
        if (doc.containsKey("setMod")) {
          stareMod = doc["setMod"];
        }
        if (stareMod == 3) {
          if (doc.containsKey("setH")) unghiH = doc["setH"];
          if (doc.containsKey("setV")) unghiV = doc["setV"];
        }
      }
    }
  }
  client.stop();
}
