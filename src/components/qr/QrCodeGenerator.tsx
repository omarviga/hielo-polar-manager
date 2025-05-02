
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrCodeGeneratorProps {
  value: string;
  size?: number;
}

export const QrCodeGenerator = ({ value, size = 128 }: QrCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const generateQR = async () => {
      try {
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQR();
  }, [value, size]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="border rounded-md" />
      <p className="text-sm text-muted-foreground mt-2 max-w-xs overflow-hidden text-ellipsis text-center">
        {value}
      </p>
    </div>
  );
};
