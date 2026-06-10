// app/customize/lib/barcodeQrGenerator.js

export async function generateBarcode(container, value) {
  const JsBarcode = await import('jsbarcode');
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'width:100%; height:auto; display:block;';
  container.appendChild(canvas);
  JsBarcode.default(canvas, value, {
    format: 'CODE128',
    lineColor: '#000000',
    width: 2,
    height: 40,
    displayValue: false,
    margin: 5
  });
}

export async function generateQR(container, value) {
  const QRCode = await import('qrcode');
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'width:100%; height:100%;';
  container.appendChild(canvas);
  await QRCode.toCanvas(canvas, value, { width: 150, margin: 1 });
}