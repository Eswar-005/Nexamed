import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import {
  Scan,
  Camera,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Pill,
  ChevronRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const OCRScanner = ({ onSelectMedicine }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [ocrMatchResult, setOcrMatchResult] = useState(null);

  const fileInputRef = useRef(null);

  // Client-side Canvas Preprocessing Pipeline
  const preprocessImage = (imageFile) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Grayscale + Contrast Adjustment
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Binary thresholding
          const val = avg > 120 ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageSrc(URL.createObjectURL(file));
    setLoading(true);
    setProgress(10);
    setStatusText('Preprocessing image contrast & binarization...');

    try {
      const preprocessed = await preprocessImage(file);
      setStatusText('Running Tesseract.js WebWorker OCR Text Extraction...');

      const result = await Tesseract.recognize(preprocessed, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const rawText = result.data.text;
      setExtractedText(rawText);
      setStatusText('Matching extracted text against medicine database...');

      // Call backend fuzzy Levenshtein match API
      const res = await fetch('http://localhost:5000/api/ocr/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extractedText: rawText })
      });
      const matchData = await res.json();
      setOcrMatchResult(matchData);
    } catch (err) {
      console.error('OCR Process error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSample = (sampleName) => {
    setLoading(true);
    setStatusText(`Simulating OCR scan for sample: ${sampleName}...`);
    setTimeout(() => {
      const simulatedText = `${sampleName} TABLET\n15 Tablets\nParacetamol 650mg IP\nMfg Micro Labs Ltd\nMRP Rs 34.50`;
      setExtractedText(simulatedText);
      fetch('http://localhost:5000/api/ocr/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extractedText: simulatedText })
      })
        .then((res) => res.json())
        .then((data) => {
          setOcrMatchResult(data);
          setLoading(false);
        });
    }, 1200);
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold m-0 gradient-text d-flex align-items-center gap-2">
          <Scan size={28} />
          <span>OCR Medicine Packaging & Strip Scanner</span>
        </h2>
        <p className="text-muted small m-0">
          Upload or capture a clear photo of printed medicine strip packaging to extract name and composition.
        </p>
      </div>

      <div className="row g-4">
        {/* Upload & Controls */}
        <div className="col-md-6">
          <div className="glass-card-static p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="d-none"
              onChange={handleImageUpload}
            />

            {imageSrc ? (
              <div className="mb-3 position-relative w-100">
                <img
                  src={imageSrc}
                  alt="Scanned Strip"
                  className="img-fluid rounded-3 border border-cyan-subtle shadow"
                  style={{ maxHeight: '280px' }}
                />
              </div>
            ) : (
              <div className="p-5 rounded-4 border-dashed border-secondary mb-3 w-100 text-center bg-body-tertiary">
                <Camera size={48} className="text-cyan mb-2" />
                <h5 className="fw-bold text-main">Upload Packaging Image</h5>
                <p className="text-muted small">Supports printed blister strips, bottle labels, or medicine boxes.</p>
              </div>
            )}

            <div className="d-flex gap-2 w-100 mb-3">
              <button
                className="btn btn-gradient w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
              >
                <Upload size={18} />
                <span>{imageSrc ? 'Scan New Image' : 'Select Image File'}</span>
              </button>
            </div>

            {/* Quick Demo Samples Buttons */}
            <div className="w-100 border-top border-secondary-subtle pt-3">
              <span className="text-muted small d-block mb-2">Test with Demo Medicine Packaging:</span>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <button className="btn btn-sm btn-glass" onClick={() => handleDemoSample('DOLO 650')}>
                  Demo Dolo 650
                </button>
                <button className="btn btn-sm btn-glass" onClick={() => handleDemoSample('PANTOCID 40')}>
                  Demo Pantocid 40
                </button>
                <button className="btn btn-sm btn-glass" onClick={() => handleDemoSample('AZITHRAL 500')}>
                  Demo Azithral 500
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* OCR Result View */}
        <div className="col-md-6">
          <div className="glass-card-static p-4 h-100">
            <h5 className="fw-bold text-main mb-3 d-flex align-items-center gap-2">
              <Sparkles size={20} className="text-cyan" />
              <span>Extraction & Fuzzy Match Result</span>
            </h5>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-cyan mb-3" role="status" style={{ width: '3rem', height: '3rem' }} />
                <h6 className="fw-bold text-main">{statusText}</h6>
                <div className="progress w-75 mx-auto mt-3" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-cyan"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : ocrMatchResult ? (
              <div>
                {/* Confidence Badge & Matched Medicine */}
                {ocrMatchResult.match ? (
                  <div className="glass-card p-4 border-success-subtle mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-success text-white px-3 py-1">
                        {ocrMatchResult.confidence}% Match Confidence
                      </span>
                      <span className="badge bg-secondary-subtle text-main">
                        Indicative MRP: ₹{ocrMatchResult.match.mrp.toFixed(2)}
                      </span>
                    </div>

                    <h4 className="fw-bold text-main mb-1">{ocrMatchResult.match.name}</h4>
                    <p className="text-muted small mb-2">
                      <strong>Generic:</strong> {ocrMatchResult.match.generic_name}
                    </p>
                    <p className="text-dim small mb-3">
                      Category: {ocrMatchResult.match.category}
                    </p>

                    <button
                      className="btn btn-gradient w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => onSelectMedicine(ocrMatchResult.match.id)}
                    >
                      <Pill size={16} />
                      <span>Open Medicine Detail Page</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded bg-warning-subtle text-warning mb-4">
                    <AlertCircle size={20} className="me-2" />
                    No exact match found in database. Check extracted text snippet below.
                  </div>
                )}

                {/* Extracted Raw OCR Snippet */}
                <div className="glass-card p-3">
                  <h6 className="fw-bold text-main mb-2 d-flex align-items-center gap-1">
                    <FileText size={16} />
                    <span>Raw Extracted Text</span>
                  </h6>
                  <pre
                    className="text-muted small m-0 p-2 rounded bg-body-tertiary"
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {extractedText || 'No text extracted'}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <Scan size={48} className="mb-2 opacity-50" />
                <p className="m-0">Upload a printed medicine strip photo to view OCR text extraction results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
