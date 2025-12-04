import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Smartphone } from 'lucide-react';

const PhotoUpload = ({ value, onChange, label = 'Foto de Perfil' }) => {
  const [preview, setPreview] = useState(value || null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processFile = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="space-y-4 text-center">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>

      <div className="flex flex-col items-center gap-4">
        {/* Preview Circle */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 shadow-md">
          {preview ? (
            <>
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={handleRemove}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg hover:bg-red-600 transition-colors"
                title="Eliminar foto"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Camera className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          {/* Botón Galería */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <Upload className="w-4 h-4" />
            Galería
          </button>

          {/* Botón Cámara */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <Smartphone className="w-4 h-4" />
            Cámara
          </button>
        </div>

        {/* Inputs Ocultos */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {/* Input específico para activar cámara en móviles */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <p className="text-xs text-gray-500">JPG, PNG o GIF. Máximo 5MB.</p>
      </div>
    </div>
  );
};

export default PhotoUpload;