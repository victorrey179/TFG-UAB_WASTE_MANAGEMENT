#include "Network.h"

// #define WIFI_SSID "MOVISTAR_D793"
// #define WIFI_PASSWORD "GRqpMtGWxJhoHLQmKqrx"
#define WIFI_SSID "MIWIFI_dE33"
#define WIFI_PASSWORD "MPvNYANX"

static Network *instance = NULL;

Network::Network() {
  instance = this;
}

void WiFiEventConnected(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.println("WIFI CONNECTED! BUT WAIT FOR THE LOCAL IP ADDR");
}

void WiFiEventGotIP(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.print("LOCAL IP ADDRESS: ");
  Serial.println(WiFi.localIP());
}

void WiFiEventDisconnected(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.println("WIFI DISCONNECTED!");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void Network::initWiFi() {
  WiFi.disconnect();
  WiFi.onEvent(WiFiEventConnected, ARDUINO_EVENT_WIFI_STA_CONNECTED);
  WiFi.onEvent(WiFiEventGotIP, ARDUINO_EVENT_WIFI_STA_GOT_IP);
  WiFi.onEvent(WiFiEventDisconnected, ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void Network::httpSendRequest(String location, int rssi, int t, int h, int distance, int x, int y, int z) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://34.175.50.106:3050/data"); // Replace with your local server endpoint
    http.addHeader("Content-Type", "application/json");
    
    String httpRequestData = "{\"location\":\"" + location + 
                         "\",\"signal\":" + rssi +
                         ",\"temperature\":" + t +
                         ",\"humidity\":" + h +
                         ",\"distance\":" + distance +
                         ",\"x\":" + x +
                         ",\"y\":" + y +
                         ",\"z\":" + z + "}";
    
    int httpResponseCode = http.POST(httpRequestData);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
}