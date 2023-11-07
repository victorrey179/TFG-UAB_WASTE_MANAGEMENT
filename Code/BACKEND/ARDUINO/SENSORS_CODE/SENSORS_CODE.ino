#include <Wire.h>
#include "DHT.h"

#define DHTPIN 25
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define echoPin 13
#define trigPin 12
#define x_axis 36
#define y_axis 39
#define z_axis 34

long duration, distance;
int x_out, y_out, z_out; 

void setup() {
  // put your setup code here, to run once
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  dht.begin();
  

}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, HIGH);
  
  duration = pulseIn(echoPin, HIGH);
  distance = duration / 58.2;

  Serial.print("Distancia: ");
  Serial.print(String(distance));
  Serial.print(" cm");
  Serial.println();

  x_out = analogRead(x_axis);
  y_out = analogRead(y_axis);
  z_out = analogRead(z_axis);

  Serial.println();
  Serial.print("x = ");
  Serial.print(x_out);
  Serial.print("\t\t");
  Serial.print("y = ");
  Serial.print(y_out);
  Serial.print("\t\t");
  Serial.print("z = ");
  Serial.print(z_out);
  Serial.println();

  float h = dht.readHumidity();
  //Read the moisture content in %.
  float t = dht.readTemperature();
  //Read the temperature in degrees Celsius

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed reception");
    return;
    //Returns an error if the ESP32 does not receive any measurements
  }

  Serial.println();  Serial.print("Humedad: ");
  Serial.print(h);
  Serial.print("%  Temperatura: ");
  Serial.print(t);
  Serial.print("°C");
  Serial.println();

  delay(10000);

}
