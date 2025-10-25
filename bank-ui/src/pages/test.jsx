import { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScannerPage() {
  const [scannedData, setScannedData] = useState(null);
  const scannerRef = useRef(null);

  const startScan = async () => {
    if (scannerRef.current) return; // already running
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          setScannedData(decodedText);
          scanner.stop(); // stop after scan
          scannerRef.current = null;
        },
        (error) => console.warn("Scan error:", error)
      );
    } catch (err) {
      alert("Camera access failed. Make sure you allow camera permissions and use HTTPS.");
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={startScan}>Start Scan</button>
      <div id="reader" style={{ width: "300px", marginTop: "20px" }} />
      {scannedData && <p>Scanned Data: {scannedData}</p>}
    </div>
  );
}
