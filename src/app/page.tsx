"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large (max 10MB)");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image_file", selectedFile);

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Processing failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "removed-bg.png";
    link.click();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            🖼️ Image Background Remover
          </h1>
          <p className="text-gray-500">Remove image backgrounds with AI</p>
        </div>

        {!previewUrl && (
          <div
            className="border-3 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-all"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="text-5xl mb-4">📁</div>
            <p className="text-gray-600">Click or drag image here</p>
            <p className="text-gray-400 text-sm mt-2">Supports: JPG, PNG, WEBP (max 10MB)</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />

        {previewUrl && resultUrl && (
          <div className="mb-6">
            <p className="text-gray-600 mb-2 font-medium text-center">Before / After Comparison:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Original</p>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={previewUrl} alt="Original" className="w-full h-auto object-contain" style={{ maxHeight: '300px' }} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Background Removed</p>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMhYCiD4WtAHD6X4zU0BqjYC/AAA/k0JfCjXZgLrL8x0AAAAASUVORK5CYII=')]">
                  <img src={resultUrl} alt="Result" className="w-full h-auto object-contain" style={{ maxHeight: '300px' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {previewUrl && !resultUrl && (
          <div className="mb-6">
            <p className="text-gray-600 mb-2 font-medium">Original Image:</p>
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-64 object-contain bg-gray-50" />
              <button onClick={handleReset} className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700">✕</button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {isProcessing && (
          <div className="mb-6 text-center py-8">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Processing...</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          {previewUrl && !resultUrl && !isProcessing && (
            <button onClick={handleProcess} className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-xl hover:opacity-90">
              Remove Background
            </button>
          )}

          {resultUrl && !isProcessing && (
            <>
              <button onClick={handleDownload} className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-xl hover:opacity-90">
                Download PNG
              </button>
              <button onClick={handleReset} className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300">
                New Image
              </button>
            </>
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Powered by Remove.bg API • Free tier: 50 requests/month
        </p>
      </div>
    </div>
  );
}
