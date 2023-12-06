//LibrerÃ­as para LoRa
#include <LoRa.h>
#include <SPI.h>

//LibrerÃ­as para GPS
#include <Adafruit_GPS.h>
#include <SoftwareSerial.h>

//Libraries para comunicar con y dibujar en la pantalla OLED integrada
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

//Libraries para sensor Humedad y temperatura
#include "DHT.h"

//Libraries para Giroscopio
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

//Libraries para Sensor LiDAR
#include "Adafruit_VL53L0X.h"

//Pines que se utilizarán por el módulo DHT(temperatura y humedad)
#define DHTPIN 25

//Tipo de sensor de humedad y temperatura
#define DHTTYPE DHT11

//Pines que se utilizarán por el módulo LoRa
#define SCK 5
#define MISO 19
#define MOSI 27
#define SS 18
#define RST 14
#define DIO0 26

//Frecuencia de operación según nuestra ubicación. 433E6 para Asia, 868E6 para Europa, 915E6 para América
#define BAND 868E6

//Pines necesarios para conectar con pantalla OLED
#define ANCHOPANTALLA 128 // El ancho de la pantalla en pixeles es de 128px
#define ALTOPANTALLA 64 // El ancho de la pantalla en pixeles es de 64px
#define OLED_SDA 4
#define OLED_SCL 15 
#define OLED_RST 16

//Pines necesarios para el sensor de aceleración
#define x_axis 38
#define y_axis 39
#define z_axis 34

//Pines GPS
#define RX 3
#define TX 1

SoftwareSerial serialGPS(RX, TX);
DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(ANCHOPANTALLA, ALTOPANTALLA, &Wire, OLED_RST);
Adafruit_GPS GPS(&serialGPS);
Adafruit_VL53L0X lox = Adafruit_VL53L0X();
Adafruit_MPU6050 mpu;

char c;
long duration, distance;
int x_out, y_out, z_out; 
int  Contador = 0;//Haremos un contador de paquetes enviados

const unsigned char logo_bmp2[] PROGMEM = {
	0x01, 0xff, 0x00, 0x01, 0xff, 0x00, 0x03, 0xff, 0x80, 0x03, 0xff, 0x80, 0x07, 0xff, 0xc0, 0x07, 
	0xff, 0xc0, 0x00, 0x0f, 0xe0, 0x1f, 0xef, 0xd0, 0x1f, 0xc7, 0xd0, 0x3f, 0xc7, 0xb8, 0x3f, 0x83, 
	0x78, 0x7f, 0x81, 0x7c, 0x7f, 0x00, 0xfc, 0xfe, 0x00, 0xfe, 0x7f, 0x7f, 0xfc, 0x7f, 0x7f, 0xfc, 
	0x3f, 0xbf, 0xf8, 0x3f, 0xdf, 0xf8, 0x1f, 0xdf, 0xf0, 0x1f, 0xef, 0xf0
};
static const unsigned char PROGMEM logo_bmp[] =
{
	0x00, 0x00, 0x07, 0xff, 0xff, 0x80, 0x00, 0x00, 0x00, 0x00, 0x0f, 0xff, 0xff, 0xc0, 0x00, 0x00, 
	0x00, 0x00, 0x0f, 0xff, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x1f, 0xff, 0xff, 0xe0, 0x00, 0x00, 
	0x00, 0x00, 0x3f, 0xff, 0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x3f, 0xff, 0xff, 0xf0, 0x00, 0x00, 
	0x00, 0x00, 0x7f, 0xff, 0xff, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x7f, 0xff, 0xff, 0xf8, 0x00, 0x00, 
	0x00, 0x00, 0xff, 0xff, 0xff, 0xfc, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xfe, 0x00, 0x00, 
	0x00, 0x01, 0xff, 0xff, 0xff, 0xfe, 0x00, 0x00, 0x00, 0x03, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 
	0x00, 0x03, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x07, 0xff, 0xff, 0xff, 0xff, 0x80, 0x00, 
	0x00, 0x07, 0xff, 0xff, 0xff, 0xff, 0x80, 0x00, 0x00, 0x0f, 0xff, 0xff, 0xff, 0xff, 0xc0, 0x00, 
	0x00, 0x0f, 0xff, 0xff, 0xff, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xe0, 0x00, 
	0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7f, 0xff, 0x80, 0x00, 
	0x00, 0x7f, 0xff, 0xf8, 0x7f, 0xff, 0x88, 0x00, 0x00, 0x7f, 0xff, 0xf8, 0x3f, 0xff, 0x18, 0x00, 
	0x00, 0xff, 0xff, 0xf0, 0x3f, 0xff, 0x1c, 0x00, 0x00, 0xff, 0xff, 0xe0, 0x1f, 0xfe, 0x3e, 0x00, 
	0x01, 0xff, 0xff, 0xe0, 0x0f, 0xfe, 0x3e, 0x00, 0x03, 0xff, 0xff, 0xc0, 0x0f, 0xfc, 0x7f, 0x00, 
	0x03, 0xff, 0xff, 0xc0, 0x07, 0xf8, 0xff, 0x00, 0x07, 0xff, 0xff, 0x80, 0x07, 0xf8, 0xff, 0x80, 
	0x07, 0xff, 0xff, 0x00, 0x03, 0xf1, 0xff, 0x80, 0x0f, 0xff, 0xff, 0x00, 0x03, 0xf1, 0xff, 0xc0, 
	0x0f, 0xff, 0xfe, 0x00, 0x01, 0xe3, 0xff, 0xe0, 0x1f, 0xff, 0xfe, 0x00, 0x00, 0xc7, 0xff, 0xe0, 
	0x3f, 0xff, 0xfc, 0x00, 0x00, 0xc7, 0xff, 0xf0, 0x3f, 0xff, 0xf8, 0x00, 0x00, 0x0f, 0xff, 0xf0, 
	0x7f, 0xff, 0xf8, 0x00, 0x00, 0x0f, 0xff, 0xf8, 0x7f, 0xff, 0xf0, 0x00, 0x00, 0x1f, 0xff, 0xf8, 
	0xff, 0xff, 0xf0, 0x00, 0x00, 0x1f, 0xff, 0xfc, 0xff, 0xff, 0xf1, 0xff, 0xff, 0xff, 0xff, 0xfc, 
	0x7f, 0xff, 0xf8, 0xff, 0xff, 0xff, 0xff, 0xf8, 0x3f, 0xff, 0xf8, 0xff, 0xff, 0xff, 0xff, 0xf0, 
	0x3f, 0xff, 0xfc, 0x7f, 0xff, 0xff, 0xff, 0xf0, 0x1f, 0xff, 0xfc, 0x7f, 0xff, 0xff, 0xff, 0xe0, 
	0x1f, 0xff, 0xfe, 0x3f, 0xff, 0xff, 0xff, 0xe0, 0x0f, 0xff, 0xff, 0x3f, 0xff, 0xff, 0xff, 0xc0, 
	0x0f, 0xff, 0xff, 0x1f, 0xff, 0xff, 0xff, 0x80, 0x07, 0xff, 0xff, 0x8f, 0xff, 0xff, 0xff, 0x80, 
	0x03, 0xff, 0xff, 0x8f, 0xff, 0xff, 0xff, 0x00, 0x03, 0xff, 0xff, 0xc7, 0xff, 0xff, 0xff, 0x00, 
	0x01, 0xff, 0xff, 0xc3, 0xff, 0xff, 0xfe, 0x00, 0x01, 0xff, 0xff, 0xe3, 0xff, 0xff, 0xfe, 0x00, 
	0x00, 0xff, 0xff, 0xf1, 0xff, 0xff, 0xfc, 0x00, 0x00, 0x7f, 0xff, 0xf1, 0xff, 0xff, 0xf8, 0x00, 
	0x00, 0x7f, 0xff, 0xf8, 0xff, 0xff, 0xf8, 0x00, 0x00, 0x3f, 0xff, 0xf8, 0x7f, 0xff, 0xf0, 0x00
};

// 'lora', 32x21px
const unsigned char logo_lora [] PROGMEM = {
	0x03, 0xfc, 0x00, 0x00, 0x04, 0x03, 0x00, 0x00, 0x03, 0xfc, 0x00, 0x00, 0x02, 0x04, 0x00, 0x00, 
	0xc1, 0x99, 0xfe, 0x00, 0xc0, 0x01, 0x8e, 0x00, 0xc1, 0xf9, 0x86, 0x7c, 0xc1, 0x99, 0x8e, 0xcc, 
	0xc3, 0x0d, 0xfc, 0x3c, 0xc3, 0x0d, 0x9c, 0xec, 0xfd, 0x9d, 0x8c, 0xcc, 0xfd, 0xf9, 0x8e, 0xfc, 
	0x00, 0x60, 0x00, 0x20, 0x01, 0x08, 0x00, 0x00, 0x00, 0x60, 0x00, 0x00, 0x03, 0x9c, 0x00, 0x00, 
	0x04, 0x72, 0x00, 0x00, 0x07, 0xfe, 0x00, 0x00, 0x00, 0xf0, 0x00, 0x00
};
 

void setup() {
  // put your setup code here, to run once
  //initialize Serial Monitor
  Serial.begin(115200);
  GPS.begin(9600);
  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
  
  pinMode(OLED_RST, OUTPUT);//reseteamos la pantalla OLED para comenzar
  digitalWrite(OLED_RST, LOW);
  delay(20);
  digitalWrite(OLED_RST, HIGH);
  
  Wire.begin(OLED_SDA, OLED_SCL); //inicia OLED
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3c, false, false)) { // 0x3C representa 128x32
    Serial.println(F("Fallo iniciando SSD1306"));
    for(;;); // Si detecta el fallo anterior, detiene el cÃ³digo aquÃ­ hasta que se reinicie
  }

  // Iniciar sensor LiDAR
  Serial.println("VL53L0X test");
  if (!lox.begin()) {
    Serial.println(F("Error al iniciar VL53L0X"));
    while(1);
  }

   // Iniciar sensor MPU-6050
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  // Configura el rango deseado del MPU-6050
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  SPI.begin(SCK, MISO, MOSI, SS);  //Definimos pines SPI
  LoRa.setPins(SS, RST, DIO0); //Configuramos el LoRa para enviar

  display.setTextSize(1); // Con un tamaño de 1, cada caracter es de 6x8 píxeles
  display.clearDisplay();
  display.setTextColor(WHITE);
  dht.begin();
  
  if (!LoRa.begin(BAND)) {//Intenta transmitir en la banda elegida
    Serial.println("Error iniciando LoRa");//Si no puede transmitir, marca error
    while (1);
  }

  display.clearDisplay();
  display.drawBitmap((ANCHOPANTALLA - 62) / 2, (ALTOPANTALLA - 54) / 2, 
                     logo_bmp, 62, 54, WHITE);
  display.display();
  delay(3000);//Esperamos cinco segundos
}

void loop() {
  if (Contador == 10000){
    Contador = 0;
  }
  String data;
  
  clearGPS();
  while (!GPS.newNMEAreceived()) {
    c = GPS.read();
  }

  GPS.parse(GPS.lastNMEA());

  Serial.print("Time: ");
  Serial.print(GPS.hour, DEC);
  Serial.print(':');
  Serial.print(GPS.minute, DEC);
  Serial.print(':');
  Serial.print(GPS.seconds, DEC);
  Serial.print('.');
  Serial.println(GPS.milliseconds);

  Serial.print("Date: ");
  Serial.print(GPS.day, DEC);
  Serial.print('/');
  Serial.print(GPS.month, DEC);
  Serial.print("/20");
  Serial.println(GPS.year, DEC);

  Serial.print("Fix: ");
  Serial.print(GPS.fix);
  Serial.print(" quality: ");
  Serial.println(GPS.fixquality);
  Serial.print("Satellites: ");
  Serial.println(GPS.satellites);

  if (GPS.fix) {
    Serial.print("Location: ");
    Serial.print(GPS.latitude, 4);
    Serial.print(GPS.lat);
    Serial.print(", ");
    Serial.print(GPS.longitude, 4);
    Serial.println(GPS.lon);
    Serial.print("Google Maps location: ");
    Serial.print(GPS.latitudeDegrees, 4);
    Serial.print(", ");
    Serial.println(GPS.longitudeDegrees, 4);

    Serial.print("Speed (knots): ");
    Serial.println(GPS.speed);
    Serial.print("Heading: ");
    Serial.println(GPS.angle);
    Serial.print("Altitude: ");
    Serial.println(GPS.altitude);
  }

  VL53L0X_RangingMeasurementData_t measure;
    
  Serial.print("Leyendo sensor... ");
  lox.rangingTest(&measure, false); // si se pasa true como parametro, muestra por puerto serie datos de debug

  if (measure.RangeStatus != 4)
  {
    Serial.print("Distancia (mm): ");
  Serial.println(measure.RangeMilliMeter);
  distance = measure.RangeMilliMeter/10;
  } 
  else
  {
    Serial.println("  Fuera de rango ");
  }

  Serial.print("Distancia: ");
  Serial.print(String(distance));
  Serial.print(" cm");
  Serial.println();

  /* Lee los datos del sensor */
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Calcula los ángulos aproximados
  // Nota: Esto es solo una aproximación y puede tener errores
  float gyroX = g.gyro.x;
  float gyroY = g.gyro.y;
  float gyroZ = g.gyro.z;

  // Muestra los datos del giroscopio en la consola
  Serial.print("Giroscopio X: "); Serial.print(gyroX);
  Serial.print(" Y: "); Serial.print(gyroY);
  Serial.print(" Z: "); Serial.println(gyroZ);

  // x_out = analogRead(x_axis);
  // y_out = analogRead(y_axis);
  // z_out = analogRead(z_axis);

  Serial.println();
  Serial.print("x = ");
  Serial.print(gyroX);
  Serial.print("\t\t");
  Serial.print("y = ");
  Serial.print(gyroY);
  Serial.print("\t\t");
  Serial.print("z = ");
  Serial.print(gyroZ);
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

  Serial.println();  
  Serial.print("Humedad: ");
  Serial.print(h);
  Serial.print("%  Temperatura: ");
  Serial.print(t);
  Serial.print("°C");
  Serial.println();

  int t_int = int(round(t)); // Convierte la temperatura a entero
  int h_int = int(round(h)); // Convierte la humedad a entero

  data.concat("Z2_EE_AMARILLO");
  data.concat(",");
  data.concat(t_int);
  data.concat(",");
  data.concat(h_int);
  data.concat(",");
  data.concat(distance);
  data.concat(",");
  data.concat(x_out);
  data.concat(",");
  data.concat(y_out);
  data.concat(",");
  data.concat(z_out);

  Serial.print("Enviando paquete: ");//Muestra mensaje
  Serial.println(data);//Muestra la cuenta actual

  //Para mandar paquete al LoRa receptor
  LoRa.beginPacket();//Inicia protocolo
  LoRa.print(data);//Manda cuenta actual
  LoRa.endPacket();//Fin de paquete enviado
  
  display.clearDisplay();//Limpia pantalla
  display.drawBitmap(0, 0, 
                     logo_bmp2, 23, 20, WHITE);
  display.setCursor(30,7);
  display.setTextSize(1);//TamaÃ±o de fuente a 1 punto
  display.print("Blue Campus");
  display.setCursor(0,30);
  display.print("Transmitiendo (10s)");//Mensaje de confirmaciÃ³n
  display.drawBitmap(98, 44, 
                     logo_lora, 30, 19, WHITE);
  display.setTextSize(2);
  display.setCursor(0,45);
  display.print(Contador);//La cuenta actual que se envÃ­a 
  display.display();

  Contador++;
  
  delay(5000);//Esperamos segundos entre cada enví­o

}

void clearGPS() {
  while (!GPS.newNMEAreceived()) {
    c = GPS.read();
  }
  GPS.parse(GPS.lastNMEA());

  while (!GPS.newNMEAreceived()) {
    c = GPS.read();
  }
  GPS.parse(GPS.lastNMEA());
}
