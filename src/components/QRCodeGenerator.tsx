import React, { useState, useEffect } from 'react';
import { Card, CardBody } from './ui/Card';
import Button from './ui/Button';
import { Download, Copy, Link as LinkIcon } from 'lucide-react';

interface QRCodeGeneratorProps {
  url: string;
  trainingTitle: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url, trainingTitle }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate QR code URL using QR code API service
    // For demo purposes, we'll use the Google Charts API
    const encodedUrl = encodeURIComponent(window.location.origin + url);
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedUrl}&chs=250x250&choe=UTF-8&chld=L|2`;
    setQrCodeUrl(qrUrl);
  }, [url]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${trainingTitle.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="mt-4">
      <CardBody>
        <h3 className="text-lg font-medium mb-4">Attendance QR Code</h3>
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            {qrCodeUrl && (
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="border rounded-md shadow-sm"
              />
            )}
          </div>
          <div className="flex-1">
            <p className="text-gray-600 mb-4">
              Share this QR code or link with your participants to record their attendance.
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button 
                variant="outline" 
                leftIcon={<Download className="h-4 w-4" />}
                onClick={handleDownloadQR}
              >
                Download QR
              </Button>
              <Button 
                variant="outline" 
                leftIcon={<Copy className="h-4 w-4" />}
                onClick={handleCopyLink}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
            <div className="mt-4 p-2 bg-gray-100 rounded flex items-center">
              <LinkIcon className="h-4 w-4 text-gray-500 mr-2" />
              <p className="text-sm text-gray-600 truncate">
                {window.location.origin + url}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default QRCodeGenerator;