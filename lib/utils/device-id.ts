export function getDeviceId(): string {
  if (typeof window === "undefined") return ""

  let deviceId = localStorage.getItem("device-id")

  if (!deviceId) {
    deviceId = "device-" + Math.random().toString(36).substr(2, 9) + Date.now()
    localStorage.setItem("device-id", deviceId)
  }

  return deviceId
}
