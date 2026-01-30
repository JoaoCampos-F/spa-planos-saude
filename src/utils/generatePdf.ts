export default function generatePdf(data: any) {
  var blob = new Blob([data], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}
