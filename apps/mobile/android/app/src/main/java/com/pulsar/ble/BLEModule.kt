package com.pulsar.ble

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.ParcelUuid
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.UUID

class BLEModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        val PULSAR_SERVICE_UUID: UUID = UUID.fromString("0000FE9A-0000-1000-8000-00805F9B34FB")
    }

    private val bluetoothManager: BluetoothManager? =
        reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
    private val bluetoothAdapter: BluetoothAdapter? = bluetoothManager?.adapter
    private var scanner: BluetoothLeScanner? = null
    private var advertiser: BluetoothLeAdvertiser? = null
    private var isScanning = false
    private var isAdvertising = false

    override fun getName(): String = "PulsarBLE"

    @ReactMethod
    fun getBluetoothStatus(promise: Promise) {
        val map = Arguments.createMap()
        val adapter = bluetoothAdapter
        if (adapter == null) {
            map.putBoolean("supported", false)
            map.putBoolean("enabled", false)
            promise.resolve(map)
            return
        }
        map.putBoolean("supported", true)
        map.putBoolean("enabled", adapter.isEnabled)
        map.putBoolean("hasPermissions", hasBlePermissions())
        promise.resolve(map)
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun startDiscovery(promise: Promise) {
        if (!hasBlePermissions()) {
            promise.reject("PERMISSION_DENIED", "Bluetooth & Nearby Devices permissions are required")
            return
        }
        val adapter = bluetoothAdapter
        if (adapter == null || !adapter.isEnabled) {
            promise.reject("BLE_DISABLED", "Bluetooth is turned off. Please enable it in Android Settings.")
            return
        }

        scanner = adapter.bluetoothLeScanner
        val filter = ScanFilter.Builder()
            .setServiceUuid(ParcelUuid(PULSAR_SERVICE_UUID))
            .build()
        val settings = ScanSettings.Builder()
            .setScanMode(ScanSettings.SCAN_MODE_BALANCED)
            .build()

        scanner?.startScan(listOf(filter), settings, scanCallback)
        isScanning = true
        promise.resolve(true)
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun stopDiscovery(promise: Promise) {
        if (isScanning && hasBlePermissions()) {
            scanner?.stopScan(scanCallback)
            isScanning = false
        }
        promise.resolve(true)
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun startAdvertising(deviceId: String, promise: Promise) {
        if (!hasBlePermissions()) {
            promise.reject("PERMISSION_DENIED", "Bluetooth advertise permission required")
            return
        }
        val adapter = bluetoothAdapter
        if (adapter == null || !adapter.isEnabled) {
            promise.reject("BLE_DISABLED", "Bluetooth is disabled")
            return
        }

        advertiser = adapter.bluetoothLeAdvertiser
        val settings = AdvertiseSettings.Builder()
            .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_POWER)
            .setConnectable(true)
            .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM)
            .build()

        val data = AdvertiseData.Builder()
            .setIncludeDeviceName(false)
            .addServiceUuid(ParcelUuid(PULSAR_SERVICE_UUID))
            .build()

        advertiser?.startAdvertising(settings, data, advertiseCallback)
        isAdvertising = true
        promise.resolve(true)
    }

    private val scanCallback = object : ScanCallback() {
        @SuppressLint("MissingPermission")
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val payload = Arguments.createMap().apply {
                putString("deviceId", result.device.address)
                putString("name", result.device.name ?: "Pulsar Node")
                putInt("rssi", result.rssi)
            }
            emitEvent("PulsarPeerDiscovered", payload)
        }
    }

    private val advertiseCallback = object : AdvertiseCallback() {
        override fun onStartFailure(errorCode: Int) {
            isAdvertising = false
        }
    }

    private fun hasBlePermissions(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            hasPerm(Manifest.permission.BLUETOOTH_SCAN) &&
                hasPerm(Manifest.permission.BLUETOOTH_ADVERTISE) &&
                hasPerm(Manifest.permission.BLUETOOTH_CONNECT)
        } else {
            hasPerm(Manifest.permission.ACCESS_FINE_LOCATION)
        }
    }

    private fun hasPerm(permission: String): Boolean {
        return ContextCompat.checkSelfPermission(reactContext, permission) == PackageManager.PERMISSION_GRANTED
    }

    private fun emitEvent(eventName: String, params: com.facebook.react.bridge.WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
