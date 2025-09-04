import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Package, MapPin, Camera, Clock, Truck, Building, Edit, Settings } from 'lucide-react';
import { CamaraCaptura } from './CamaraCaptura';
import { EditarHojaRutaDialog } from './EditarHojaRutaDialog';
import { OrdenManagementDialog } from './OrdenManagementDialog';
import { useHojasRuta } from '@/hooks/useHojasRuta';

interface Orden {
  id: string;
  numero_orden: string;
  estado: string;
  estado_detallado: string;
  remitente_nombre: string;
  destinatario_nombre: string;
  remitente_localidad: string;
  destinatario_localidad: string;
  remitente_provincia: string;
  destinatario_provincia: string;
  agencia_origen_id?: string;
  agencia_destino_id?: string;
  fecha_recoleccion?: string;
  hora_recoleccion?: string;
  fecha_entrega?: string;
  hora_entrega?: string;
}

interface HojaRutaCardProps {
  hojaRuta: {
    id: string;
    transportista_id: string;
    codigo_seguimiento: string;
    fecha: string;
    estado: string;
    tipo_ruta: 'local_origen' | 'larga_distancia' | 'local_destino';
    deposito_origen?: string;
    deposito_destino?: string;
    observaciones?: string;
    ordenes_hoja_ruta: Array<{
      id: string;
      orden_envio_id: string;
      tipo_visita: string;
      orden_visita: number;
      completado?: boolean;
      ordenes_envio: Orden;
    }>;
  };
  onUpdate?: () => void;
}

const tipoRutaLabels = {
  local_origen: 'Local - Origen',
  larga_distancia: 'Larga Distancia',
  local_destino: 'Local - Destino'
};

const tipoRutaIcons = {
  local_origen: Building,
  larga_distancia: Truck,
  local_destino: Building
};

const estadoBadgeVariants = {
  planificada: 'secondary',
  en_curso: 'default',
  completada: 'outline',
  cancelada: 'destructive'
} as const;

const getEstadoActions = (tipo: string, estado: string) => {
  const actions = [];
  
  if (tipo === 'local_origen' && estado === 'planificada') {
    actions.push({ key: 'iniciar', label: 'Iniciar Recogida', estado: 'en_curso' });
  }
  
  if (tipo === 'local_origen' && estado === 'en_curso') {
    actions.push({ key: 'completar', label: 'Completar Entrega a LD', estado: 'completada' });
  }
  
  if (tipo === 'larga_distancia' && estado === 'planificada') {
    actions.push({ key: 'recoger', label: 'Recoger de Depósito', estado: 'en_curso' });
  }
  
  if (tipo === 'larga_distancia' && estado === 'en_curso') {
    actions.push({ key: 'entregar', label: 'Entregar en Destino', estado: 'completada' });
  }
  
  if (tipo === 'local_destino' && estado === 'planificada') {
    actions.push({ key: 'recoger_destino', label: 'Recoger de LD', estado: 'en_curso' });
  }
  
  if (tipo === 'local_destino' && estado === 'en_curso') {
    actions.push({ key: 'entregar_final', label: 'Entregar en Agencia', estado: 'completada' });
  }
  
  return actions;
};

const getTipoFoto = (tipoRuta: string, estado: string): 'recogida_origen' | 'entrega_deposito_ld' | 'recogida_deposito_ld' | 'entrega_destino' | null => {
  if (tipoRuta === 'local_origen' && estado === 'en_curso') return 'recogida_origen';
  if (tipoRuta === 'local_origen' && estado === 'completada') return 'entrega_deposito_ld';
  if (tipoRuta === 'larga_distancia' && estado === 'en_curso') return 'recogida_deposito_ld';
  if (tipoRuta === 'local_destino' && estado === 'en_curso') return 'recogida_deposito_ld';
  if (tipoRuta === 'local_destino' && estado === 'completada') return 'entrega_destino';
  return null;
};

export const HojaRutaCard: React.FC<HojaRutaCardProps> = ({ hojaRuta, onUpdate }) => {
  const { actualizarEstadoHojaRuta, obtenerHojasRutaTransportista } = useHojasRuta();
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [ordenManagementOpen, setOrdenManagementOpen] = React.useState(false);
  const TipoIcon = tipoRutaIcons[hojaRuta.tipo_ruta];
  const actions = getEstadoActions(hojaRuta.tipo_ruta, hojaRuta.estado);
  const tipoFoto = getTipoFoto(hojaRuta.tipo_ruta, hojaRuta.estado);

  const handleEstadoChange = async (nuevoEstado: string) => {
    await actualizarEstadoHojaRuta(hojaRuta.id, nuevoEstado);
  };

  const handleEditSuccess = () => {
    onUpdate?.();
  };

  const handleOrdenManagementSuccess = () => {
    onUpdate?.();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TipoIcon className="h-5 w-5" />
              {hojaRuta.codigo_seguimiento}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(hojaRuta.fecha).toLocaleDateString('es-ES')}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOrdenManagementOpen(true)}
                className="h-8 w-8 p-0"
                title="Gestionar Órdenes"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
                className="h-8 w-8 p-0"
                title="Editar Transportista"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <Badge variant={estadoBadgeVariants[hojaRuta.estado as keyof typeof estadoBadgeVariants] || 'secondary'}>
              {hojaRuta.estado}
            </Badge>
            <Badge variant="outline">
              {tipoRutaLabels[hojaRuta.tipo_ruta]}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Depósitos para larga distancia */}
        {hojaRuta.tipo_ruta === 'larga_distancia' && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="h-3 w-3" />
                Origen
              </div>
              <p className="text-muted-foreground ml-4">{hojaRuta.deposito_origen}</p>
            </div>
            <div>
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="h-3 w-3" />
                Destino
              </div>
              <p className="text-muted-foreground ml-4">{hojaRuta.deposito_destino}</p>
            </div>
          </div>
        )}

        {/* Órdenes asociadas */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4" />
            <span className="font-medium">
              Órdenes ({hojaRuta.ordenes_hoja_ruta.length})
            </span>
          </div>
          
          <div className="space-y-2">
            {hojaRuta.ordenes_hoja_ruta.map((item, index) => (
              <div key={item.orden_envio_id} className="border rounded-lg p-3 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">#{item.orden_visita}</Badge>
                    <span className="font-medium text-sm">
                      {item.ordenes_envio.numero_orden}
                    </span>
                  </div>
                  <Badge variant={item.completado ? 'outline' : 'secondary'} className="text-xs">
                    {item.completado ? 'Completado' : 'Pendiente'}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>De: {item.ordenes_envio.remitente_nombre} ({item.ordenes_envio.remitente_localidad})</div>
                  <div>Para: {item.ordenes_envio.destinatario_nombre} ({item.ordenes_envio.destinatario_localidad})</div>
                </div>

                {/* Botón de cámara para cada orden si aplica */}
                {tipoFoto && hojaRuta.estado !== 'completada' && (
                  <div className="mt-2">
                    <CamaraCaptura
                      hojaRutaId={hojaRuta.id}
                      ordenEnvioId={item.orden_envio_id}
                      tipoFoto={tipoFoto}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        {hojaRuta.observaciones && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-1">Observaciones</p>
              <p className="text-sm text-muted-foreground">{hojaRuta.observaciones}</p>
            </div>
          </>
        )}

        {/* Acciones de estado */}
        {actions.length > 0 && (
          <>
            <Separator />
            <div className="flex gap-2 flex-wrap">
              {actions.map((action) => (
                <Button
                  key={action.key}
                  onClick={() => handleEstadoChange(action.estado)}
                  size="sm"
                  className="flex-1"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </>
        )}
      </CardContent>

      {/* Dialogs */}
      <EditarHojaRutaDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        hojaRuta={hojaRuta}
        onSuccess={handleEditSuccess}
      />
      
      <OrdenManagementDialog
        open={ordenManagementOpen}
        onOpenChange={setOrdenManagementOpen}
        hojaRuta={hojaRuta}
        onSuccess={handleOrdenManagementSuccess}
      />
    </Card>
  );
};