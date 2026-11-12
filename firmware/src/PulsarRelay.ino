#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <vector>
#include <set>

#define SERVICE_UUID        "0000FE9A-0000-1000-8000-00805F9B34FB"
#define PACKET_CHAR_UUID    "0000FE9B-0000-1000-8000-00805F9B34FB"
#define RELAY_NODE_ID       "ESP32_RELAY_ZONE_A1"

BLEServer* pServer = NULL;
BLECharacteristic* pPacketChar = NULL;
std::set<String> seenPacketIds;
int packetsForwarded = 0;

class PacketCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
        String rxValue = pCharacteristic->getValue().c_str();
        if (rxValue.length() > 0) {
            Serial.print("[Pulsar ESP32] Packet received: ");
            Serial.println(rxValue);

            // Basic dedup packet id extraction (e.g., {"id":"pkt_123",...})
            int idStart = rxValue.indexOf("\"packetId\":\"");
            if (idStart != -1) {
                int idEnd = rxValue.indexOf("\"", idStart + 12);
                String pktId = rxValue.substring(idStart + 12, idEnd);
                if (seenPacketIds.find(pktId) != seenPacketIds.end()) {
                    Serial.println("[Pulsar ESP32] Duplicate packet dropped: " + pktId);
                    return;
                }
                seenPacketIds.insert(pktId);
                packetsForwarded++;
                Serial.println("[Pulsar ESP32] Forwarding packet: " + pktId);

                // Notify connected BLE peers
                pPacketChar->setValue(rxValue.c_str());
                pPacketChar->notify();
            }
        }
    }
};

void setup() {
    Serial.begin(115200);
    Serial.println("[Pulsar ESP32] Starting Mesh Relay Station Node: " RELAY_NODE_ID);

    BLEDevice::init(RELAY_NODE_ID);
    pServer = BLEDevice::createServer();

    BLEService *pService = pServer->createService(SERVICE_UUID);
    pPacketChar = pService->createCharacteristic(
        PACKET_CHAR_UUID,
        BLECharacteristic::PROPERTY_READ   |
        BLECharacteristic::PROPERTY_WRITE  |
        BLECharacteristic::PROPERTY_NOTIFY
    );
    pPacketChar->setCallbacks(new PacketCallbacks());
    pPacketChar->addDescriptor(new BLE2902());

    pService->start();

    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    pAdvertising->setMinPreferred(0x06);
    BLEDevice::startAdvertising();

    Serial.println("[Pulsar ESP32] Relay BLE service advertising active.");
}

void loop() {
    // Relay heartbeat & periodic queue check
    delay(5000);
}
