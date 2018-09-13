const DisplayClient = require("./display_client")
const config = require('./config').loadConfig()
const fs = require('fs')

/**
 * Retries on failure.
 */
function showCustomerInfo() {
  if (!config.customerName && !config.customerAddress) {
    displayLine(0, "ERROR!")
    displayLine(1, "Not registered")
  } else {
    displayLine(0, config.customerName)
    displayLine(1, config.customerAddress)
  }
  displayLine(2, config.supportInfoLine1)
  displayLine(3, config.supportInfoLine2)
}

/**
 * Retries on failure.
 */
function showQrCode() {
  const registrationUrl = getRegistrationUrl()
  if (displayClient) {
    displayClient.callAndRetry('setQrCode', [registrationUrl, false, config.qrCodeDisplayTab])
  } else {
    console.log("If I had a display, I would show a QR code for this registration URL: " + registrationUrl)
  }
}

function getRegistrationUrl() {
  return config.registrationBaseUrl + "#" + getDeviceId()
}

function getDeviceId() {
  if (config.deviceId) {
    return config.deviceId
  } else if (config.deviceIdPath) {
    return fs.readFileSync(config.deviceIdPath).toString()
  } else {
    throw new Error("The config must contain deviceIdPath or deviceId")
  }

}

function displayLine(row, text) {
  if (text) {
    if (displayClient) {
      displayClient.callAndRetry('setRowText', [text, row, false, config.mainDisplayTab])
    } else {
      console.log("Display line " + row + ": " + text)
    }
  } else {
    if (displayClient) {
      displayClient.callAndRetry('clearRow', [row, config.mainDisplayTab])
    } else {
      console.log("Clear display line " + row)
    }
  }
}


let displayClient
if (config.displayRpcPort && config.displayRpcPort != 0 && config.displayRpcPort != "0") {
  console.log("I will talk to a display via RPC on port " + config.displayRpcPort)
  displayClient = new DisplayClient(config.displayRpcPort, config.logDisplay)
} else {
  console.log("No valid displayRpcPort set, so I'll use the console")
  displayClient = null
}

showCustomerInfo()
showQrCode()
