import QRCode from "qrcode"

export async function generateUPIQR(
  upiId: string,
  hotelName: string,
  amount: number,
  orderId: string,
): Promise<string> {
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(hotelName)}&am=${amount}&tn=Order-${orderId}`

  try {
    const qrCode = await QRCode.toDataURL(upiString)
    return qrCode
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw error
  }
}
