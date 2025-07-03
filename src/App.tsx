import React, { useState, useCallback } from 'react';
import { Upload, Lock, Download, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { PasswordInput } from './components/PasswordInput';
import { ZipGenerator } from './components/ZipGenerator';
import { DownloadManager } from './components/DownloadManager';
import { FileItem, GeneratedZip } from './types';

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [password, setPassword] = useState('');
  const [generatedZips, setGeneratedZips] = useState<GeneratedZip[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleFilesSelected = useCallback((selectedFiles: FileItem[]) => {
    setFiles(selectedFiles);
  }, []);

  const handlePasswordChange = useCallback((newPassword: string) => {
    setPassword(newPassword);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (files.length === 0 || !password.trim()) {
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedZips([]);

    try {
      const zips: GeneratedZip[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const zipGenerator = new ZipGenerator();
        const zipBlob = await zipGenerator.createPasswordProtectedZip(file, password);
        
        const zipName = `${file.name.replace(/\.[^/.]+$/, '')}_protected.zip`;
        const zipUrl = URL.createObjectURL(zipBlob);
        
        zips.push({
          id: `${file.name}-${Date.now()}-${i}`,
          name: zipName,
          url: zipUrl,
          originalFileName: file.name,
          size: zipBlob.size,
          createdAt: new Date()
        });

        setGenerationProgress(((i + 1) / files.length) * 100);
      }

      setGeneratedZips(zips);
    } catch (error) {
      console.error('Error generating ZIP files:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [files, password]);

  const handleDownloadAll = useCallback(() => {
    generatedZips.forEach(zip => {
      const link = document.createElement('a');
      link.href = zip.url;
      link.download = zip.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }, [generatedZips]);

  const canGenerate = files.length > 0 && password.trim().length > 0 && !isGenerating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">SecureZIP</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate password-protected ZIP files for your documents with military-grade security
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1: File Upload */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Step 1: Upload Files</h2>
            </div>
            <FileUpload onFilesSelected={handleFilesSelected} files={files} />
          </div>

          {/* Step 2: Password Input */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Step 2: Set Password</h2>
            </div>
            <PasswordInput
              password={password}
              onPasswordChange={handlePasswordChange}
              disabled={isGenerating}
            />
          </div>

          {/* Step 3: Generate */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Step 3: Generate Protected ZIPs</h2>
            </div>
            
            <div className="space-y-4">
              {files.length > 0 && password.trim() && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{files.length} file{files.length > 1 ? 's' : ''} selected</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Password set ({password.length} characters)</span>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-800 font-medium">Generating secure ZIP files...</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    {Math.round(generationProgress)}% complete
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  canGenerate
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate Password-Protected ZIPs'}
              </button>
            </div>
          </div>

          {/* Step 4: Download */}
          {generatedZips.length > 0 && (
            <DownloadManager
              zips={generatedZips}
              onDownloadAll={handleDownloadAll}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;