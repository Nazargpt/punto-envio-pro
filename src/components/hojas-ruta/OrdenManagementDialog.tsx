import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, X, Package, MapPin, Calendar, Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface HojaRuta {
  id: string;
  codigo_seguimiento: string;
  tipo_ruta: 'local_origen' | 'larga_distancia' | 'local_destino';
  estado: string;
  deposito_origen?: string;
  deposito_destino?: string;
  ordenes_hoja_ruta: Array<{
    id: string;
    orden_envio_id: string;
    tipo_visita: string;
    orden_visita: number;
    ordenes_envio: Orden;
  }>;
}

interface OrdenManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hojaRuta: HojaRuta;
  onSuccess: () => void;
}

export const OrdenManagementDialog = ({ 
  open, 
  onOpenChange, 
  hojaRuta, 
  onSuccess 
}: OrdenManagementDialogProps) => {
  const [ordenesDisponibles, setOrdenesDisponibles] = useState<Orden[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const tipoRutaLabels = {
    'local_origen': 'Primera Milla',
    'larga_distancia': 'Larga Distancia',
    'local_destino': 'Última Milla'
  };

  const getTipoVisita = (tipoRuta: string) => {
    switch (tipoRuta) {
      case 'local_origen': return 'recogida';
      case 'larga_distancia': return 'transporte';
      case 'local_destino': return 'entrega';
      default: return 'recogida';
    }
  };

  useEffect(() => {
    if (open) {
      cargarOrdenesDisponibles();
    }
  }, [open, hojaRuta.tipo_ruta]);

  const cargarOrdenesDisponibles = async () => {
    setLoading(true);
    try {
      // SECURITY: Use secure function for orders instead of direct table access
      const { data, error } = await supabase.rpc('get_orders_secure', {
        user_orders_only: false,
        limit_count: 100
      });

      if (error) throw error;

      // Filter out orders that are already in this roadmap and match the pending status
      const filteredOrders = (data || []).filter(order => 
        order.estado === 'pendiente' &&
        !hojaRuta.ordenes_hoja_ruta.some(ohr => ohr.orden_envio_id === order.id)
      );

      // Transform the secure data to the format expected by the component
      const transformedOrders = filteredOrders.map(order => ({
        id: order.id,
        numero_orden: order.numero_orden,
        estado: order.estado,
        estado_detallado: order.estado_detallado || 'pendiente',
        // Use masked names for display
        remitente_nombre: order.remitente_nombre_masked,
        destinatario_nombre: order.destinatario_nombre_masked,
        remitente_localidad: order.remitente_localidad,
        destinatario_localidad: order.destinatario_localidad,
        remitente_provincia: order.remitente_provincia,
        destinatario_provincia: order.destinatario_provincia,
        agencia_origen_id: order.agencia_origen_id,
        agencia_destino_id: order.agencia_destino_id,
        fecha_recoleccion: order.fecha_recoleccion,
        fecha_entrega: order.fecha_entrega,
        created_at: order.created_at
      }));

      setOrdenesDisponibles(transformedOrders);
    } catch (error) {
      console.error('Error loading available orders:', error);
      setOrdenesDisponibles([]);
    } finally {
      setLoading(false);
    }
  };
  const filteredOrdenes = ordenesDisponibles.filter(orden =>
    orden.numero_orden.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.remitente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.destinatario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.remitente_localidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.destinatario_localidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const agregarOrden = async (orden: Orden) => {
    try {
      const nextOrdenVisita = hojaRuta.ordenes_hoja_ruta.length + 1;
      
      const { error } = await supabase
        .from('ordenes_hoja_ruta')
        .insert({
          hoja_ruta_id: hojaRuta.id,
          orden_envio_id: orden.id,
          orden_visita: nextOrdenVisita,
          tipo_visita: getTipoVisita(hojaRuta.tipo_ruta),
          observaciones: `${tipoRutaLabels[hojaRuta.tipo_ruta]} - ${orden.remitente_localidad} → ${orden.destinatario_localidad}`
        });

      if (error) throw error;

      toast({
        title: "Orden agregada",
        description: `La orden ${orden.numero_orden} se agregó correctamente a la hoja de ruta`,
      });

      // Actualizar la lista de órdenes disponibles
      setOrdenesDisponibles(prev => prev.filter(o => o.id !== orden.id));
      onSuccess();
    } catch (error) {
      console.error('Error agregando orden:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la orden a la hoja de ruta",
        variant: "destructive"
      });
    }
  };

  const removerOrden = async (ordenHojaRutaId: string, numeroOrden: string) => {
    try {
      const { error } = await supabase
        .from('ordenes_hoja_ruta')
        .delete()
        .eq('id', ordenHojaRutaId);

      if (error) throw error;

      toast({
        title: "Orden removida",
        description: `La orden ${numeroOrden} se removió de la hoja de ruta`,
      });

      onSuccess();
      cargarOrdenesDisponibles(); // Recargar para mostrar la orden removida
    } catch (error) {
      console.error('Error removiendo orden:', error);
      toast({
        title: "Error",
        description: "No se pudo remover la orden de la hoja de ruta",
        variant: "destructive"
      });
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'pendiente': 'secondary',
      'en_transito': 'default',
      'entregada': 'outline',
      'cancelada': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[estado as keyof typeof variants] || 'secondary'}>
        {estado.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Gestionar Órdenes - {hojaRuta.codigo_seguimiento}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Tipo: {tipoRutaLabels[hojaRuta.tipo_ruta]} • Estado: {hojaRuta.estado}
            {hojaRuta.deposito_origen && hojaRuta.deposito_destino && (
              <span> • Ruta: {hojaRuta.deposito_origen} → {hojaRuta.deposito_destino}</span>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
          {/* Órdenes Asignadas */}
          <div className="flex flex-col min-h-0">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Órdenes Asignadas ({hojaRuta.ordenes_hoja_ruta.length})
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3">
              {hojaRuta.ordenes_hoja_ruta.map((ohr) => (
                <Card key={ohr.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">#{ohr.orden_visita}</Badge>
                          <span className="font-mono text-sm">{ohr.ordenes_envio.numero_orden}</span>
                          {getEstadoBadge(ohr.ordenes_envio.estado)}
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{ohr.ordenes_envio.remitente_nombre}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-medium">{ohr.ordenes_envio.destinatario_nombre}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{ohr.ordenes_envio.remitente_localidad}, {ohr.ordenes_envio.remitente_provincia}</span>
                            <span>→</span>
                            <span>{ohr.ordenes_envio.destinatario_localidad}, {ohr.ordenes_envio.destinatario_provincia}</span>
                          </div>

                          {(ohr.ordenes_envio.fecha_recoleccion || ohr.ordenes_envio.fecha_entrega) && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {ohr.ordenes_envio.fecha_recoleccion && (
                                <span>Recolección: {ohr.ordenes_envio.fecha_recoleccion}</span>
                              )}
                              {ohr.ordenes_envio.fecha_entrega && (
                                <span>• Entrega: {ohr.ordenes_envio.fecha_entrega}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerOrden(ohr.id, ohr.ordenes_envio.numero_orden)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {hojaRuta.ordenes_hoja_ruta.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mb-4" />
                  <h4 className="font-medium mb-2">No hay órdenes asignadas</h4>
                  <p className="text-sm text-muted-foreground">
                    Selecciona órdenes disponibles para agregar a esta hoja de ruta
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Órdenes Disponibles */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Órdenes Disponibles ({filteredOrdenes.length})
              </h3>
            </div>
            
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, remitente, destinatario o localidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredOrdenes.map((orden) => (
                <Card key={orden.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm">{orden.numero_orden}</span>
                          {getEstadoBadge(orden.estado)}
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{orden.remitente_nombre}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-medium">{orden.destinatario_nombre}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{orden.remitente_localidad}, {orden.remitente_provincia}</span>
                            <span>→</span>
                            <span>{orden.destinatario_localidad}, {orden.destinatario_provincia}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => agregarOrden(orden)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {!loading && filteredOrdenes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mb-4" />
                  <h4 className="font-medium mb-2">No se encontraron órdenes</h4>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm 
                      ? 'Intenta con un término de búsqueda diferente' 
                      : 'No hay órdenes disponibles para agregar'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};