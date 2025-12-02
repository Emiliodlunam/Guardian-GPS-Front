import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Shield } from 'lucide-react';
import Button from './Button';

const QRGenerator = ({ plateCode, fullName }) => {
  const qrRef = useRef(null);

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      // Crear un canvas más grande para agregar información
      const finalCanvas = document.createElement('canvas');
      const ctx = finalCanvas.getContext('2d');
      
      // Tamaño del canvas final
      finalCanvas.width = 600;
      finalCanvas.height = 700;
      
      // Fondo blanco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      // Agregar logo/título
      ctx.fillStyle = '#1E3A5F';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Guardian GPS', 300, 50);
      
      // Dibujar el QR en el centro
      const qrSize = 400;
      const qrX = (finalCanvas.width - qrSize) / 2;
      const qrY = 100;
      ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);
      
      // Agregar información debajo
      ctx.fillStyle = '#2B7FBF';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(fullName || 'Mi Perfil', 300, 550);
      
      ctx.fillStyle = '#666666';
      ctx.font = '18px Arial';
      ctx.fillText(`ID: ${plateCode}`, 300, 590);
      
      ctx.font = '14px Arial';
      ctx.fillText('Escanea para ver perfil de emergencia', 300, 630);
      
      // Descargar
      const url = finalCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `guardian-gps-${plateCode}.png`;
      link.click();
    }
  };

  const qrUrl = `${window.location.origin}/scan/${plateCode}`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Shield className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-dark">Tu Código QR</h3>
      </div>

      <div ref={qrRef} className="flex justify-center mb-6">
        <div className="p-4 bg-white border-4 border-primary rounded-xl">
          <QRCodeCanvas
            value={qrUrl}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        ID: <span className="font-mono font-bold text-primary">{plateCode}</span>
      </p>

      <Button
        variant="primary"
        onClick={handleDownload}
        fullWidth
      >
        <Download className="w-5 h-5 mr-2" />
        Descargar QR
      </Button>

      <p className="text-xs text-gray-500 mt-4">
        Imprime este código QR y pégalo en tu placa física
      </p>
    </div>
  );
};

export default QRGenerator;