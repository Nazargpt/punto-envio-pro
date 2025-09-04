import React, { useRef, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, X, MapPin, Loader2 } from 'lucide-react';
import { useHojasRuta } from '@/hooks/useHojasRuta';

interface CamaraCapturaProps {
  hojaRutaId: string;
  ordenEnvioId: string;
  tipoFoto: 'recogida_origen' | 'entrega_deposito_ld' | 'recogida_deposito_ld' | 'entrega_destino';
  onFotoSubida?: (url: string) => void;
  className?: string;
}

const tipoFotoLabels = {
  recogida_origen: 'Recogida en Origen',
  entrega_deposito_ld: 'Entrega en Depósito LD',
  recogida_deposito_ld: 'Recogida desde Depósito LD',
  entrega_destino: 'Entrega en Destino'
};

export const CamaraCaptura: React.FC<CamaraCapturaProps> = ({
  hojaRutaId,
  ordenEnvioId,
  tipoFoto,
  onFotoSubida,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(null);
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [usandoCamara, setUsandoCamara] = useState(false);
  
  const { subirFotoHojaRuta, loading } = useHojasRuta();

  // Get current location
  const obtenerUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }

    setObteniendoUbicacion(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacion({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setObteniendoUbicacion(false);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        setObteniendoUbicacion(false);
      }
    );
  }, []);

  // Initialize camera
  const iniciarCamara = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setUsandoCamara(true);
      obtenerUbicacion();
    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
    }
  }, [obtenerUbicacion]);

  // Stop camera
  const detenerCamara = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUsandoCamara(false);
  }, [stream]);

  // Capture photo from camera
  const capturarFoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        detenerCamara();
      }
    }, 'image/jpeg', 0.8);
  }, [detenerCamara]);

  // Handle file selection
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      obtenerUbicacion();
    }
  }, [obtenerUbicacion]);

  // Upload photo
  const handleSubirFoto = useCallback(async () => {
    if (!previewUrl) return;

    try {
      // Convert blob URL to File
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], `${tipoFoto}_${Date.now()}.jpg`, { type: 'image/jpeg' });

      const url = await subirFotoHojaRuta(
        hojaRutaId,
        ordenEnvioId,
        file,
        tipoFoto,
        observaciones || undefined,
        ubicacion || undefined
      );

      if (url && onFotoSubida) {
        onFotoSubida(url);
      }

      handleClose();
    } catch (error) {
      console.error('Error subiendo foto:', error);
    }
  }, [previewUrl, hojaRutaId, ordenEnvioId, tipoFoto, observaciones, ubicacion, subirFotoHojaRuta, onFotoSubida]);

  // Close dialog
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPreviewUrl(null);
    setObservaciones('');
    setUbicacion(null);
    detenerCamara();
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl, detenerCamara]);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className={className}
        size="sm"
      >
        <Camera className="mr-2 h-4 w-4" />
        Tomar Foto - {tipoFotoLabels[tipoFoto]}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {tipoFotoLabels[tipoFoto]}
            </DialogTitle>
            <DialogDescription>
              Capture una foto del paquete para documentar el proceso
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!previewUrl && !usandoCamara && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button 
                    onClick={iniciarCamara}
                    className="flex-1"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Usar Cámara
                  </Button>
                  
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Archivo
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {usandoCamara && (
              <div className="space-y-3">
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-48 bg-black rounded-lg object-cover"
                    playsInline
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={capturarFoto} className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Capturar
                  </Button>
                  <Button 
                    onClick={detenerCamara} 
                    variant="outline"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {previewUrl && (
              <div className="space-y-3">
                <Card>
                  <CardContent className="pt-4">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>

                <Textarea
                  placeholder="Observaciones opcionales..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {obteniendoUbicacion ? (
                    <span>Obteniendo ubicación...</span>
                  ) : ubicacion ? (
                    <span>Ubicación: {ubicacion.lat.toFixed(6)}, {ubicacion.lng.toFixed(6)}</span>
                  ) : (
                    <span>Sin ubicación</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            
            {previewUrl && (
              <Button 
                onClick={handleSubirFoto} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  'Guardar Foto'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};