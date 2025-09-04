import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Calendar, Package, Truck, Route } from 'lucide-react';
import { HojaRutaCard } from '@/components/hojas-ruta/HojaRutaCard';
import { useHojasRuta } from '@/hooks/useHojasRuta';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const HojasRuta = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hojasRuta, setHojasRuta] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch all route sheets for admin view
  useEffect(() => {
    if (user) {
      obtenerTodasLasHojasRuta();
    }
  }, [user]);

  const obtenerTodasLasHojasRuta = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hojas_ruta')
        .select(`
          *,
          ordenes_hoja_ruta(
            id,
            orden_envio_id,
            orden_visita,
            tipo_visita,
            completado,
            ordenes_envio(
              id,
              numero_orden,
              estado,
              estado_detallado,
              remitente_nombre,
              destinatario_nombre,
              remitente_localidad,
              destinatario_localidad,
              remitente_provincia,
              destinatario_provincia,
              agencia_origen_id,
              agencia_destino_id,
              fecha_recoleccion,
              hora_recoleccion,
              fecha_entrega,
              hora_entrega
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedData = (data || []).map(item => ({
        ...item,
        tipo_ruta: item.tipo_ruta as 'local_origen' | 'larga_distancia' | 'local_destino',
        ordenes_hoja_ruta: item.ordenes_hoja_ruta || []
      }));
      setHojasRuta(processedData);
    } catch (error) {
      console.error('Error obteniendo hojas de ruta:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter routes based on search term
  const filteredRoutes = hojasRuta.filter(ruta =>
    ruta.codigo_seguimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ruta.observaciones?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate routes by type
  const rutasLocalOrigen = filteredRoutes.filter(r => r.tipo_ruta === 'local_origen');
  const rutasLargaDistancia = filteredRoutes.filter(r => r.tipo_ruta === 'larga_distancia');
  const rutasLocalDestino = filteredRoutes.filter(r => r.tipo_ruta === 'local_destino');

  const getEstadoStats = () => {
    const stats = {
      total: hojasRuta.length,
      planificadas: hojasRuta.filter(r => r.estado === 'planificada').length,
      enCurso: hojasRuta.filter(r => r.estado === 'en_curso').length,
      completadas: hojasRuta.filter(r => r.estado === 'completada').length
    };
    
    return stats;
  };

  const stats = getEstadoStats();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Hojas de Ruta</h1>
          <p className="text-muted-foreground">
            Panel administrativo para gestionar todas las hojas de ruta del sistema
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rutas</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total en el sistema</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planificadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planificadas}</div>
            <p className="text-xs text-muted-foreground">Por iniciar</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Curso</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enCurso}</div>
            <p className="text-xs text-muted-foreground">Activas ahora</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completadas}</div>
            <p className="text-xs text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar hojas de ruta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* Routes Cards */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas ({filteredRoutes.length})</TabsTrigger>
          <TabsTrigger value="local-origen">Local Origen ({rutasLocalOrigen.length})</TabsTrigger>
          <TabsTrigger value="larga-distancia">Larga Distancia ({rutasLargaDistancia.length})</TabsTrigger>
          <TabsTrigger value="local-destino">Local Destino ({rutasLocalDestino.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Cargando hojas de ruta...</div>
            </div>
          ) : filteredRoutes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Route className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay hojas de ruta</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm ? 'No se encontraron hojas de ruta con el término de búsqueda.' : 'No hay hojas de ruta en el sistema en este momento.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredRoutes.map((hojaRuta) => (
                <HojaRutaCard 
                  key={hojaRuta.id} 
                  hojaRuta={hojaRuta} 
                  onUpdate={obtenerTodasLasHojasRuta}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="local-origen" className="space-y-4">
          <div className="grid gap-6">
            {rutasLocalOrigen.map((hojaRuta) => (
              <HojaRutaCard 
                key={hojaRuta.id} 
                hojaRuta={hojaRuta} 
                onUpdate={obtenerTodasLasHojasRuta}
              />
            ))}
          </div>
          {rutasLocalOrigen.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">
                  No hay rutas locales de origen asignadas.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="larga-distancia" className="space-y-4">
          <div className="grid gap-6">
            {rutasLargaDistancia.map((hojaRuta) => (
              <HojaRutaCard 
                key={hojaRuta.id} 
                hojaRuta={hojaRuta} 
                onUpdate={obtenerTodasLasHojasRuta}
              />
            ))}
          </div>
          {rutasLargaDistancia.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">
                  No hay rutas de larga distancia asignadas.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="local-destino" className="space-y-4">
          <div className="grid gap-6">
            {rutasLocalDestino.map((hojaRuta) => (
              <HojaRutaCard 
                key={hojaRuta.id} 
                hojaRuta={hojaRuta} 
                onUpdate={obtenerTodasLasHojasRuta}
              />
            ))}
          </div>
          {rutasLocalDestino.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">
                  No hay rutas locales de destino asignadas.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HojasRuta;