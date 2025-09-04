import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Truck, Building, AlertCircle } from 'lucide-react';
import { useHojasRuta } from '@/hooks/useHojasRuta';
import { useToast } from '@/hooks/use-toast';

interface Transportista {
  id: string;
  nombre: string;
  apellido: string;
  tipo_transportista: 'local' | 'larga_distancia';
  activo: boolean;
}

interface HojaRuta {
  id: string;
  transportista_id: string;
  codigo_seguimiento: string;
  tipo_ruta: 'local_origen' | 'larga_distancia' | 'local_destino';
  estado: string;
  deposito_origen?: string;
  deposito_destino?: string;
  ordenes_hoja_ruta: Array<{
    orden_envio_id: string;
    ordenes_envio: {
      numero_orden: string;
      remitente_localidad: string;
      destinatario_localidad: string;
    };
  }>;
}

interface EditarHojaRutaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hojaRuta: HojaRuta;
  onSuccess?: () => void;
}

const tipoRutaLabels = {
  local_origen: 'Local - Origen',
  larga_distancia: 'Larga Distancia',
  local_destino: 'Local - Destino'
};

export const EditarHojaRutaDialog: React.FC<EditarHojaRutaDialogProps> = ({
  open,
  onOpenChange,
  hojaRuta,
  onSuccess
}) => {
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [selectedTransportista, setSelectedTransportista] = useState(hojaRuta.transportista_id);
  const [loading, setLoading] = useState(false);
  const { obtenerTransportistasDisponibles, actualizarTransportistaHojaRuta } = useHojasRuta();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      cargarTransportistas();
      setSelectedTransportista(hojaRuta.transportista_id);
    }
  }, [open, hojaRuta]);

  const cargarTransportistas = async () => {
    try {
      const tipoRequerido = hojaRuta.tipo_ruta === 'larga_distancia' ? 'larga_distancia' : 'local';
      const data = await obtenerTransportistasDisponibles(tipoRequerido);
      setTransportistas(data.map(t => ({
        ...t,
        tipo_transportista: t.tipo_transportista as 'local' | 'larga_distancia'
      })));
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los transportistas",
        variant: "destructive",
      });
    }
  };

  const handleGuardar = async () => {
    if (!selectedTransportista || selectedTransportista === hojaRuta.transportista_id) {
      onOpenChange(false);
      return;
    }

    setLoading(true);
    try {
      await actualizarTransportistaHojaRuta(hojaRuta.id, selectedTransportista);
      
      toast({
        title: "Éxito",
        description: "Transportista actualizado correctamente",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el transportista",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const transportistaActual = transportistas.find(t => t.id === hojaRuta.transportista_id);
  const transportistaSeleccionado = transportistas.find(t => t.id === selectedTransportista);

  const hayCambios = selectedTransportista !== hojaRuta.transportista_id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Editar Hoja de Ruta
          </DialogTitle>
          <DialogDescription>
            Modifica el transportista asignado a la hoja de ruta {hojaRuta.codigo_seguimiento}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información de la hoja de ruta */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Información de la Ruta</h4>
              <Badge variant="outline">
                {tipoRutaLabels[hojaRuta.tipo_ruta]}
              </Badge>
            </div>

            {hojaRuta.tipo_ruta === 'larga_distancia' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Origen:</span>
                  <p className="text-muted-foreground">{hojaRuta.deposito_origen}</p>
                </div>
                <div>
                  <span className="font-medium">Destino:</span>
                  <p className="text-muted-foreground">{hojaRuta.deposito_destino}</p>
                </div>
              </div>
            )}

            <div>
              <span className="font-medium text-sm">Órdenes ({hojaRuta.ordenes_hoja_ruta.length}):</span>
              <div className="mt-1 text-xs text-muted-foreground">
                {hojaRuta.ordenes_hoja_ruta.slice(0, 3).map((item, index) => (
                  <div key={item.orden_envio_id}>
                    {item.ordenes_envio.numero_orden} ({item.ordenes_envio.remitente_localidad} → {item.ordenes_envio.destinatario_localidad})
                  </div>
                ))}
                {hojaRuta.ordenes_hoja_ruta.length > 3 && (
                  <div>... y {hojaRuta.ordenes_hoja_ruta.length - 3} más</div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Transportista actual */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Transportista Actual
            </h4>
            {transportistaActual ? (
              <div className="bg-background border rounded-lg p-3">
                <div className="font-medium">
                  {transportistaActual.nombre} {transportistaActual.apellido}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tipo: {transportistaActual.tipo_transportista === 'larga_distancia' ? 'Larga Distancia' : 'Local'}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Cargando información...</div>
            )}
          </div>

          {/* Selector de nuevo transportista */}
          <div>
            <h4 className="font-medium mb-3">Cambiar Transportista</h4>
            <Select
              value={selectedTransportista}
              onValueChange={setSelectedTransportista}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un transportista" />
              </SelectTrigger>
              <SelectContent>
                {transportistas.map((transportista) => (
                  <SelectItem key={transportista.id} value={transportista.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{transportista.nombre} {transportista.apellido}</span>
                      {transportista.id === hojaRuta.transportista_id && (
                        <Badge variant="secondary" className="ml-2">Actual</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advertencias */}
          {hayCambios && hojaRuta.estado !== 'planificada' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Advertencia</p>
                <p className="text-yellow-700">
                  La hoja de ruta está en estado "{hojaRuta.estado}". Cambiar el transportista puede afectar el progreso actual.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleGuardar} 
            disabled={loading || !hayCambios}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};