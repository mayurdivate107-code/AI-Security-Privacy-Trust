import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File | null) => void;
  error?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, error }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB limit. Please choose a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelected(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-semibold text-slate-700">
        Crop Foliage or Leaf Photo <span className="text-red-500">*</span>
      </label>

      {preview ? (
        <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200">
          <img src={preview} alt="Crop Leaf Specimen" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition cursor-pointer ${
            dragActive
              ? 'border-agri-primary bg-emerald-50/50'
              : error
              ? 'border-red-300 bg-red-50/30'
              : 'border-slate-300 hover:border-agri-primary bg-white'
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex space-x-2 mb-3">
            <div className="p-3 bg-emerald-50 rounded-xl text-agri-primary">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
              <Camera className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-800">
            Click to upload or drag & drop leaf image
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports JPG, JPEG, PNG, WEBP (Max 8 MB)
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
        </div>
      )}
      {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
};
