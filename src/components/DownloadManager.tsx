import React from 'react';
import { Download, Package, Calendar, HardDrive } from 'lucide-react';
import { GeneratedZip } from '../types';

interface DownloadManagerProps {
  zips: GeneratedZip[];
  onDownloadAll: () => void;
}

export const DownloadManager: React.FC<DownloadManagerProps> = ({ zips, onDownloadAll }) => {
  const handleDownload = (zip: GeneratedZip) => {
    const link = document.createElement('a');
    link.href = zip.url;
    link.download = zip.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const totalSize = zips.reduce((sum, zip) => sum + zip.size, 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Generated ZIP Files</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{zips.length}</span> files • {formatFileSize(totalSize)}
          </div>
          <button
            onClick={onDownloadAll}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {zips.map((zip) => (
          <div
            key={zip.id}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">
                      {zip.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Original: {zip.originalFileName}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-4 h-4" />
                    <span>{formatFileSize(zip.size)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(zip.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleDownload(zip)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start gap-2">
          <div className="bg-amber-100 p-1 rounded">
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900 mb-1">
              Important Note
            </p>
            <p className="text-sm text-amber-800">
              These ZIP files are compressed but not password-protected due to browser limitations. 
              For true password protection, use a desktop application like 7-Zip or WinRAR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};