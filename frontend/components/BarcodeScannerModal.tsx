'use client';

import React, { useState } from 'react';
import { Camera, X, Scan, CheckCircle } from 'lucide-react';
import { PantryItem } from '../lib/db';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (item: Omit<PantryItem, 'id'>) => void;
}

export default function BarcodeScannerModal({ isOpen, onClose, onScanComplete }: BarcodeScannerModalProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any>(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const mockScanned = {
        name: 'Organic Whole Almond Milk',
        category: 'Dairy Alternative',
        quantity: 1,
        unit: 'Liter',
        expiryDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
      };
      setScannedProduct(mockScanned);
    }, 1500);
  };

  const handleAddScanned = () => {
    if (scannedProduct) {
      onScanComplete(scannedProduct);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Scan className="w-6 h-6 text-emerald-400" />
          <span>Barcode Item Scanner</span>
        </h3>

        {!scannedProduct ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-2xl">
            <div className="relative w-24 h-24 mx-auto mb-4 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <Camera className="w-10 h-10 text-emerald-400" />
              {scanning && (
                <div className="absolute inset-0 bg-emerald-500/20 animate-pulse rounded-2xl" />
              )}
            </div>

            <p className="text-sm text-slate-400 mb-6">
              Align barcode in camera viewport or simulate scan via Open Food Facts dataset.
            </p>

            <button
              onClick={handleSimulateScan}
              disabled={scanning}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              {scanning ? 'Scanning Barcode...' : 'Simulate Barcode Scan'}
            </button>
          </div>
        ) : (
          <div className="py-4 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white">{scannedProduct.name}</h4>
            <p className="text-sm text-slate-400 mt-1">
              Category: {scannedProduct.category} | Qty: {scannedProduct.quantity} {scannedProduct.unit}
            </p>
            <p className="text-xs text-emerald-400 mt-2">
              Expiry Date: {scannedProduct.expiryDate}
            </p>

            <button
              onClick={handleAddScanned}
              className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
            >
              Add to Pantry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
