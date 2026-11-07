import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { Camera, Image as ImageIcon } from 'lucide-react';

export function QrScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [scannerMode, setScannerMode] = useState('upload'); // 'upload' | 'camera'
  const [cameraActive, setCameraActive] = useState(false);
  const [statusText, setStatusText] = useState('');
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  function stopCamera() {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setCameraActive(false);
  }

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setStatusText('');
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function extractCertId(qrData) {
    if (!qrData) return '';
    const clean = qrData.trim();
    if (clean.includes('/verify/')) {
      const parts = clean.split('/verify/');
      return parts[parts.length - 1].split('?')[0].split('#')[0].trim();
    }
    if (clean.includes('#')) {
      const parts = clean.split('#');
      return parts[parts.length - 1].trim();
    }
    return clean;
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusText('Processing image with QR decoder...');
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          const detectedId = extractCertId(code.data);
          setStatusText(`Decoded: ${detectedId}`);
          onScanSuccess(detectedId);
          onClose();
        } else {
          setStatusText('No valid QR matrix found in this image. Try a higher contrast photo.');
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  async function startCamera() {
    try {
      setStatusText('Connecting to device camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        setStatusText('Align QR code in frame to scan...');
        scanVideo();
      }
    } catch (err) {
      setStatusText('Camera permission blocked: ' + err.message);
      setCameraActive(false);
    }
  }

  function scanVideo() {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        const detectedId = extractCertId(code.data);
        stopCamera();
        onScanSuccess(detectedId);
        onClose();
        return;
      }
    }
    animationFrameRef.current = requestAnimationFrame(scanVideo);
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            <span>QR Code Verification Scanner</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => {
              stopCamera();
              setScannerMode('upload');
            }}
            className={`py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              scannerMode === 'upload' ? 'bg-white shadow text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
          <button
            onClick={() => {
              setScannerMode('camera');
              startCamera();
            }}
            className={`py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              scannerMode === 'camera' ? 'bg-white shadow text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Live Camera</span>
          </button>
        </div>

        {/* Upload Mode Area */}
        {scannerMode === 'upload' && (
          <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/30 hover:bg-indigo-50/60 transition-all text-center">
            <ImageIcon className="w-10 h-10 text-indigo-500 mb-2" />
            <span className="text-xs font-bold text-slate-800">Select or drop a QR code image</span>
            <span className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, WebP</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}

        {/* Camera Mode Area */}
        {scannerMode === 'camera' && (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" />
              {cameraActive && (
                <div className="absolute inset-0 border-2 border-indigo-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="w-44 h-44 border-2 border-pink-400 rounded-xl relative pulse-glow">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white -translate-x-1 -translate-y-1" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white translate-x-1 -translate-y-1" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white -translate-x-1 translate-y-1" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white translate-x-1 translate-y-1" />
                  </div>
                </div>
              )}
            </div>
            {!cameraActive && (
              <button
                onClick={startCamera}
                className="w-full py-2.5 rounded-xl gradient-btn-primary font-bold text-xs"
              >
                Enable Camera Video
              </button>
            )}
          </div>
        )}

        {statusText && (
          <p className="text-xs text-center text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            {statusText}
          </p>
        )}
      </div>
    </div>
  );
}
