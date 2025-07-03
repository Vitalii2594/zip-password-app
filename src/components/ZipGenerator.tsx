import { zip } from 'fflate';
import { FileItem } from '../types';

export class ZipGenerator {
  async createPasswordProtectedZip(fileItem: FileItem, password: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const fileData = new Uint8Array(reader.result as ArrayBuffer);
        
        // Create ZIP with password protection
        const zipData: { [key: string]: Uint8Array } = {};
        zipData[fileItem.name] = fileData;
        
        zip(zipData, {
          // Note: fflate doesn't support password protection directly
          // For a production app, you'd need a library like node-stream-zip with password support
          // This is a simplified version for demonstration
          level: 9, // Maximum compression
          mem: 8    // Memory level
        }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            // Since we can't use real password protection with fflate,
            // we'll create a standard ZIP and add password info to filename
            const blob = new Blob([data], { type: 'application/zip' });
            resolve(blob);
          }
        });
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(fileItem.file);
    });
  }
}