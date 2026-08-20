'use client';

import React, { useState } from 'react';
import { DocumentAttachment } from '@/types';
import { X, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface DocumentPreviewModalProps {
  document: DocumentAttachment | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (docId: string) => void;
  onFlag?: (docId: string, reason: string) => void;
  canVerify?: boolean;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  isOpen,
  onClose,
  onVerify,
  onFlag,
  canVerify = false,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagInput, setShowFlagInput] = useState(false);

  if (!isOpen || !document) return null;

  const status = document.verifiedStatus || 'pending';
  const docId = (document.id || 'doc-0').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-outline-variant shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 px-6 border-b border-surface-container-highest flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-container text-on-primary-container">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-on-surface font-headline">{document.name || 'Untitled Document'}</h3>
              <p className="text-xs text-secondary">
                {document.category || 'Document'} • Uploaded on {formatDate(document.uploadDate || new Date().toISOString())} • {document.size || '1.0 MB'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-secondary hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Viewport Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Document Viewer Canvas */}
          <div className="flex-1 bg-surface-container-high/40 flex flex-col overflow-hidden relative">
            <div className="p-2 border-b border-surface-container flex items-center justify-between bg-surface-container/80 text-xs text-secondary">
              <span className="font-medium font-label">Official Document Viewer</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom((z) => Math.max(z - 20, 60))}
                  className="p-1.5 hover:bg-surface-container-highest rounded text-on-surface"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono">{zoom}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(z + 20, 180))}
                  className="p-1.5 hover:bg-surface-container-highest rounded text-on-surface"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 hover:bg-surface-container-highest rounded text-on-surface ml-2"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Document Canvas / DigiLocker Certified Container */}
            <div className="flex-1 p-6 overflow-auto flex items-center justify-center">
              <div
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease',
                }}
                className="w-[480px] min-h-[620px] bg-white border-2 border-outline-variant/80 rounded-xl shadow-lg p-8 flex flex-col justify-between relative select-none"
              >
                {/* Digilocker / Govt Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <ShieldCheck className="w-72 h-72 text-primary" />
                </div>

                {/* Header */}
                <div>
                  <div className="flex justify-between items-start border-b pb-4 border-dashed border-outline-variant">
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs font-label">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        DIGILOCKER VERIFIED DOCUMENT
                      </div>
                      <p className="text-[10px] text-secondary font-mono mt-0.5">
                        URI: in.gov.digilocker.cert:{docId}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold bg-primary-container px-2 py-0.5 rounded text-on-primary-container">
                        GOVT. OF INDIA
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <h4 className="font-bold text-lg text-on-surface font-headline uppercase tracking-wide">
                      {document.category || 'CERTIFICATE'}
                    </h4>
                    <p className="text-xs text-secondary mt-1">Official Electronic Record Archive</p>
                  </div>

                  {/* Dynamic OCR & Key fields table */}
                  <div className="mt-6 space-y-3 bg-surface-container-low p-4 rounded-lg border border-outline-variant/40">
                    <div className="text-[11px] font-semibold text-primary uppercase font-label">
                      OCR Extracted Attributes
                    </div>
                    {document.ocrExtractedData ? (
                      Object.entries(document.ocrExtractedData).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-xs py-1 border-b border-surface-container-highest last:border-0">
                          <span className="text-secondary font-medium">{key}:</span>
                          <span className="text-on-surface font-semibold">{val}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-secondary py-2 text-center">
                        Document verified against Digital National Registry
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="pt-4 border-t border-dashed border-outline-variant flex justify-between items-end text-[10px] text-secondary">
                  <div>
                    <p>Security Hash: 0x8a91f4...bc99</p>
                    <p>Tamper Detection: Passed (100% Match)</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block p-1 border border-emerald-500 rounded text-emerald-700 font-mono text-[9px]">
                      ✓ Digitally Signed by Issuing Authority
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Verification Status & Actions */}
          <div className="w-full md:w-80 bg-surface-container-lowest p-6 border-l border-surface-container flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm font-headline text-on-surface">Verification Status</h4>
              
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-secondary font-medium">Status</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : status === 'flagged'
                        ? 'bg-amber-100 text-amber-800'
                        : status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    {status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant">
                  {document.verificationNotes || 'No discrepancies detected. OCR text match confirmed.'}
                </div>
              </div>

              {canVerify && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-secondary uppercase font-label">
                    Officer Controls
                  </div>
                  <button
                    onClick={() => onVerify?.(document.id)}
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept & Mark Verified
                  </button>

                  {!showFlagInput ? (
                    <button
                      onClick={() => setShowFlagInput(true)}
                      className="w-full py-2 px-4 border border-amber-600/40 text-amber-800 hover:bg-amber-50 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Flag Discrepancy
                    </button>
                  ) : (
                    <div className="space-y-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <textarea
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value)}
                        placeholder="State discrepancy reason..."
                        rows={2}
                        className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (flagReason) {
                              onFlag?.(document.id, flagReason);
                              setShowFlagInput(false);
                            }
                          }}
                          className="flex-1 py-1.5 bg-amber-700 text-white rounded-lg text-xs font-semibold"
                        >
                          Submit Flag
                        </button>
                        <button
                          onClick={() => setShowFlagInput(false)}
                          className="px-2 py-1.5 text-xs text-secondary hover:bg-amber-100 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-surface-container flex items-center justify-between">
              <a
                href="#"
                download
                onClick={(e) => {
                  e.preventDefault();
                  alert('Initiating secure encrypted document download...');
                }}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Original PDF
              </a>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
