'use client';

import { useState, useRef, DragEvent } from 'react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (src: string, alt: string) => void;
}

export default function ImageUploadModal({ isOpen, onClose, onInsert }: ImageUploadModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      setIsUploading(false);
      onInsert(base64String, altText);
      handleClose();
    };

    reader.onerror = () => {
      setIsUploading(false);
      alert('Error reading file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleInsertUrl = () => {
    if (!imageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }
    onInsert(imageUrl.trim(), altText);
    handleClose();
  };

  const handleClose = () => {
    setImageUrl('');
    setAltText('');
    setIsDragging(false);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Insert Image</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-md"
            disabled={isUploading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Method Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setUploadMethod('url')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                uploadMethod === 'url'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={isUploading}
            >
              <div className="flex items-center gap-2">
                <LinkIcon size={16} />
                <span>From URL</span>
              </div>
            </button>
            <button
              onClick={() => setUploadMethod('upload')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                uploadMethod === 'upload'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={isUploading}
            >
              <div className="flex items-center gap-2">
                <Upload size={16} />
                <span>Upload from Desktop</span>
              </div>
            </button>
          </div>

          {/* URL Method */}
          {uploadMethod === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUploading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter a direct link to an image
                </p>
              </div>

              {/* Preview */}
              {imageUrl && (
                <div className="relative w-full h-64 border border-gray-300 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '';
                      target.alt = 'Image preview failed';
                    }}
                  />
                </div>
              )}

              <button
                onClick={handleInsertUrl}
                disabled={isUploading || !imageUrl.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert Image
              </button>
            </div>
          )}

          {/* Upload Method */}
          {uploadMethod === 'upload' && (
            <div className="space-y-4">
              {/* Drag and Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isUploading}
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <p className="text-gray-600">Uploading image...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop an image here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, GIF, WebP (Max 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Alt Text (always shown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text (for accessibility)
              <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for screen readers"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUploading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Alt text helps screen readers understand your images
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
