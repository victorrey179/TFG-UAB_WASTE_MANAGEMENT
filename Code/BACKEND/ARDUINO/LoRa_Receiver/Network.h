#ifndef Network_H_
#define Network_H_

#include <WiFi.h>
#include <HTTPClient.h>

class Network {
public:
  Network();
  void initWiFi();
  void httpSendRequest(String location,int rssi, int t, int h, int distance, int x, int y, int z);
};
#endif