import QRCode from 'qrcode'

export const generateQRCode = async (
  conservadorId: string,
  options: QRCode.QRCodeToDataURLOptions = {}
) => {
  const url = `${window.location.origin}/conservador/${conservadorId}`
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      ...options,
    })
    return qrDataUrl
  } catch (err) {
    console.error('Error generating QR code:', err)
    throw err
  }
}

export const generateQRCodeSVG = async (
  conservadorId: string,
  options: QRCode.QRCodeToStringOptions = {}
) => {
  const url = `${window.location.origin}/conservador/${conservadorId}`
  try {
    const qrSvg = await QRCode.toString(url, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      ...options,
    })
    return qrSvg
  } catch (err) {
    console.error('Error generating QR code SVG:', err)
    throw err
  }
} 