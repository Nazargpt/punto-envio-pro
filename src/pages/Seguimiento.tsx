import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Package, MapPin, Clock, User, Truck, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrdenEnvio {
  id: string;
  numero_orden: string;
  estado: string;
  remitente_nombre: string;
  remitente_domicilio: string;
  remitente_localidad: string;
  remitente_provincia: string;
  destinatario_nombre: string;
  destinatario_domicilio: string;
  destinatario_localidad: string;
  destinatario_provincia: string;
  fecha_recoleccion: string;
  hora_recoleccion: string;
  fecha_entrega: string;
  hora_entrega: string;
  tipo_recoleccion: string;
  tipo_entrega: string;
  created_at: string;
}

const estadosColores = {
  'pendiente': 'bg-yellow-100 text-yellow-800',
  'recolectado': 'bg-blue-100 text-blue-800',
  'en_transito': 'bg-purple-100 text-purple-800',
  'en_destino': 'bg-orange-100 text-orange-800',
  'entregado': 'bg-green-100 text-green-800',
  'cancelado': 'bg-red-100 text-red-800'
};

const estadosTexto = {
  'pendiente': 'Pendiente',
  'recolectado': 'Recolectado',
  'en_transito': 'En Tránsito',
  'en_destino': 'En Destino',
  'entregado': 'Entregado',
  'cancelado': 'Cancelado'
};

const Seguimiento = () => {
  const [searchParams] = useSearchParams();
  const [numeroOrden, setNumeroOrden] = useState(searchParams.get('numero') || '');
  const [orden, setOrden] = useState<OrdenEnvio | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    if (searchParams.get('numero')) {
      buscarOrden();
    }
  }, []);

  const buscarOrden = async () => {
    if (!numeroOrden.trim()) {
      toast.error('Ingrese un número de orden válido');
      return;
    }

    setBuscando(true);
    setNoEncontrado(false);
    setOrden(null);

    try {
      const { data, error } = await supabase
        .from('ordenes_envio')
        .select('*')
        .eq('numero_orden', numeroOrden.trim())
        .single();

      if (error || !data) {
        setNoEncontrado(true);
        toast.error('No se encontró ninguna orden con ese número');
      } else {
        setOrden(data);
        toast.success('Orden encontrada');
      }
    } catch (error) {
      console.error('Error buscando orden:', error);
      toast.error('Error al buscar la orden');
      setNoEncontrado(true);
    } finally {
      setBuscando(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    buscarOrden();
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHora = (hora: string) => {
    return hora.slice(0, 5); // HH:MM
  };

  return (
    <div className="min-h-screen bg-muted/50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Seguimiento de Envío</h1>
          <p className="text-muted-foreground">Ingrese el número de orden para rastrear su envío</p>
        </div>

        {/* Formulario de búsqueda */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Orden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="numeroOrden">Número de Orden</Label>
                <Input
                  id="numeroOrden"
                  type="text"
                  placeholder="PE-2025-000001"
                  value={numeroOrden}
                  onChange={(e) => setNumeroOrden(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={buscando}>
                  <Search className="mr-2 h-4 w-4" />
                  {buscando ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Resultado de no encontrado */}
        {noEncontrado && (
          <Card className="text-center">
            <CardContent className="pt-6">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Orden no encontrada</h3>
              <p className="text-muted-foreground">
                No se encontró ninguna orden con el número ingresado. Verifique el número e intente nuevamente.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Resultado de la orden */}
        {orden && (
          <div className="space-y-6">
            {/* Estado y número */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Orden {orden.numero_orden}</CardTitle>
                    <p className="text-muted-foreground">
                      Creada el {formatFecha(orden.created_at)}
                    </p>
                  </div>
                  <Badge className={estadosColores[orden.estado as keyof typeof estadosColores]}>
                    {estadosTexto[orden.estado as keyof typeof estadosTexto]}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Información detallada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Remitente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Remitente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Nombre</Label>
                    <p className="text-sm text-muted-foreground">{orden.remitente_nombre}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Dirección</Label>
                    <p className="text-sm text-muted-foreground">
                      {orden.remitente_domicilio}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orden.remitente_localidad}, {orden.remitente_provincia}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tipo de Recolección</Label>
                    <p className="text-sm text-muted-foreground capitalize">
                      {orden.tipo_recoleccion === 'domicilio' ? 'Retiro de domicilio' : 'Entrega en agencia'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Fecha y Hora de Recolección</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatFecha(orden.fecha_recoleccion)} - {formatHora(orden.hora_recoleccion)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Destinatario */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Destinatario
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Nombre</Label>
                    <p className="text-sm text-muted-foreground">{orden.destinatario_nombre}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Dirección</Label>
                    <p className="text-sm text-muted-foreground">
                      {orden.destinatario_domicilio}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orden.destinatario_localidad}, {orden.destinatario_provincia}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tipo de Entrega</Label>
                    <p className="text-sm text-muted-foreground capitalize">
                      {orden.tipo_entrega === 'domicilio' ? 'Entrega a domicilio' : 'Retiro en agencia'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Fecha y Hora de Entrega</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatFecha(orden.fecha_entrega)} - {formatHora(orden.hora_entrega)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline de estados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Estado del Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${orden.estado === 'pendiente' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Orden creada - Pendiente de recolección</span>
                    {orden.estado === 'pendiente' && (
                      <Badge className="bg-yellow-100 text-yellow-800">Actual</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${['recolectado', 'en_transito', 'en_destino', 'entregado'].includes(orden.estado) ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Paquete recolectado</span>
                    {orden.estado === 'recolectado' && (
                      <Badge className="bg-blue-100 text-blue-800">Actual</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${['en_transito', 'en_destino', 'entregado'].includes(orden.estado) ? 'bg-purple-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">En tránsito</span>
                    {orden.estado === 'en_transito' && (
                      <Badge className="bg-purple-100 text-purple-800">Actual</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${['en_destino', 'entregado'].includes(orden.estado) ? 'bg-orange-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Llegó a destino</span>
                    {orden.estado === 'en_destino' && (
                      <Badge className="bg-orange-100 text-orange-800">Actual</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${orden.estado === 'entregado' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Entregado</span>
                    {orden.estado === 'entregado' && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completado
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Seguimiento;