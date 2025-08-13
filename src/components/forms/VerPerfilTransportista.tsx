import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, MapPin, Calendar, FileText, Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TransportistaPerfilProps {
  transportistaId: string;
}

interface TransportistaDetalle {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  email?: string;
  telefono?: string;
  tipo_transportista: string;
  licencia_conducir?: string;
  fecha_vencimiento_licencia?: string;
  calificacion: number;
  activo: boolean;
  created_at: string;
  zonas_cobertura?: Array<{
    provincia: string;
    localidad?: string;
  }>;
  rutas?: Array<{
    nombre_ruta: string;
    provincia_origen: string;
    provincia_destino: string;
    tiempo_estimado_horas?: number;
  }>;
}

export function VerPerfilTransportista({ transportistaId }: TransportistaPerfilProps) {
  const [transportista, setTransportista] = useState<TransportistaDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarTransportista = async () => {
      try {
        // Cargar datos del transportista
        const { data: transportistaData, error: transportistaError } = await supabase
          .from('transportistas')
          .select('*')
          .eq('id', transportistaId)
          .single();

        if (transportistaError) throw transportistaError;

        // Cargar zonas de cobertura si es transportista local
        let zonasCobertura = [];
        if (transportistaData.tipo_transportista === 'local') {
          const { data: zonasData, error: zonasError } = await supabase
            .from('transportistas_zonas_cobertura')
            .select('provincia, localidad')
            .eq('transportista_id', transportistaId)
            .eq('activo', true);

          if (zonasError) throw zonasError;
          zonasCobertura = zonasData || [];
        }

        // Cargar rutas si es transportista de larga distancia
        let rutas = [];
        if (transportistaData.tipo_transportista === 'larga_distancia') {
          const { data: rutasData, error: rutasError } = await supabase
            .from('transportistas_rutas')
            .select('nombre_ruta, provincia_origen, provincia_destino, tiempo_estimado_horas')
            .eq('transportista_id', transportistaId)
            .eq('activo', true);

          if (rutasError) throw rutasError;
          rutas = rutasData || [];
        }

        setTransportista({
          ...transportistaData,
          zonas_cobertura: zonasCobertura,
          rutas: rutas
        });
      } catch (error) {
        toast.error('Error al cargar el perfil del transportista');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarTransportista();
  }, [transportistaId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!transportista) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No se pudo cargar el perfil del transportista</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{transportista.nombre} {transportista.apellido}</h2>
            <p className="text-muted-foreground">
              {transportista.tipo_transportista === 'local' ? 'Transportista Local' : 'Transportista de Larga Distancia'}
            </p>
          </div>
        </div>
        <Badge variant={transportista.activo ? "default" : "secondary"}>
          {transportista.activo ? "Activo" : "Inactivo"}
        </Badge>
      </div>

      <Separator />

      {/* Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Documento</p>
              <p className="text-lg">{transportista.documento}</p>
            </div>
            
            {transportista.email && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg">{transportista.email}</p>
                </div>
              </div>
            )}
            
            {transportista.telefono && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg">{transportista.telefono}</p>
                </div>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Calificación</p>
              <div className="flex items-center gap-1">
                <span className="text-lg font-semibold">{transportista.calificacion}</span>
                <span className="text-yellow-500">★</span>
              </div>
            </div>
          </div>
          
          {transportista.licencia_conducir && (
            <Separator />
          )}
          
          {transportista.licencia_conducir && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Licencia de Conducir</p>
                <p className="text-lg">{transportista.licencia_conducir}</p>
              </div>
              
              {transportista.fecha_vencimiento_licencia && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vencimiento Licencia</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">
                      {new Date(transportista.fecha_vencimiento_licencia).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zonas de Cobertura (para locales) */}
      {transportista.tipo_transportista === 'local' && transportista.zonas_cobertura && transportista.zonas_cobertura.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Zonas de Cobertura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {transportista.zonas_cobertura.map((zona, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <p className="font-medium">{zona.provincia}</p>
                  {zona.localidad && (
                    <p className="text-sm text-muted-foreground">{zona.localidad}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rutas (para larga distancia) */}
      {transportista.tipo_transportista === 'larga_distancia' && transportista.rutas && transportista.rutas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Rutas de Larga Distancia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transportista.rutas.map((ruta, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{ruta.nombre_ruta}</h4>
                    {ruta.tiempo_estimado_horas && (
                      <Badge variant="outline">
                        {ruta.tiempo_estimado_horas}h
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ruta.provincia_origen} → {ruta.provincia_destino}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Registro</p>
              <p className="text-lg">
                {new Date(transportista.created_at).toLocaleDateString('es-AR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge variant={transportista.activo ? "default" : "secondary"}>
                {transportista.activo ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}