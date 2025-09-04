import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Navigation, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
}

interface Agencia {
  id: string;
  nombre: string;
  direccion: string;
  localidad: string;
  provincia: string;
  contacto: any;
  tipo_parada: boolean;
  activo: boolean;
  distancia?: number;
}

const BuscarAgencias: React.FC = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Obtener ubicación por IP
  const detectarUbicacionPorIP = async () => {
    setDetectingLocation(true);
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        const location = {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          region: data.region,
          country: data.country
        };
        setUserLocation(location);
        setSearchTerm(data.city);
        
        toast({
          title: "Ubicación detectada",
          description: `${data.city}, ${data.region}`,
        });
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      toast({
        title: "No se pudo detectar la ubicación",
        description: "Puedes buscar manualmente por localidad.",
        variant: "destructive",
      });
    } finally {
      setDetectingLocation(false);
    }
  };

  // Cargar agencias desde la base de datos
  useEffect(() => {
    const cargarAgencias = async () => {
      try {
        const { data, error } = await supabase
          .from('agencias')
          .select('*')
          .eq('activo', true)
          .order('nombre');

        if (error) throw error;

        let agenciasConDistancia = data || [];

        // Si tenemos ubicación del usuario, calcular distancias
        if (userLocation && data) {
          agenciasConDistancia = data.map(agencia => ({
            ...agencia,
            distancia: calcularDistancia(
              userLocation.latitude,
              userLocation.longitude,
              // Por ahora usar coordenadas aproximadas basadas en la provincia
              // En una implementación real, las agencias tendrían coordenadas
              getCoordenadasAproximadas(agencia.provincia, agencia.localidad)
            )
          })).sort((a, b) => (a.distancia || 0) - (b.distancia || 0));
        }

        setAgencias(agenciasConDistancia);
      } catch (error) {
        console.error('Error al cargar agencias:', error);
        toast({
          title: "Error al cargar agencias",
          description: "No se pudieron cargar las agencias.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarAgencias();
  }, [userLocation, toast]);

  // Función para calcular distancia entre dos puntos (fórmula de Haversine)
  const calcularDistancia = (lat1: number, lon1: number, coords2: { lat: number, lng: number }): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (coords2.lat - lat1) * Math.PI / 180;
    const dLon = (coords2.lng - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Obtener coordenadas aproximadas por provincia/localidad
  const getCoordenadasAproximadas = (provincia: string, localidad: string): { lat: number, lng: number } => {
    // Coordenadas aproximadas de principales provincias argentinas
    const coordenadas: { [key: string]: { lat: number, lng: number } } = {
      'Buenos Aires': { lat: -34.6118, lng: -58.3960 },
      'Córdoba': { lat: -31.4201, lng: -64.1888 },
      'Santa Fe': { lat: -31.6333, lng: -60.7000 },
      'Mendoza': { lat: -32.8895, lng: -68.8458 },
      'Tucumán': { lat: -26.8083, lng: -65.2176 },
      'Salta': { lat: -24.7821, lng: -65.4232 },
      'Entre Ríos': { lat: -31.7413, lng: -60.5115 },
      'Misiones': { lat: -27.3621, lng: -55.9008 },
      'Corrientes': { lat: -27.4806, lng: -58.8341 },
      'San Luis': { lat: -33.2500, lng: -66.3167 },
      'Catamarca': { lat: -28.4696, lng: -65.7795 },
      'La Rioja': { lat: -29.4331, lng: -66.8563 },
      'Jujuy': { lat: -24.1833, lng: -65.3000 },
      'Santiago del Estero': { lat: -27.7951, lng: -64.2615 },
      'Chaco': { lat: -27.4511, lng: -58.9867 },
      'Formosa': { lat: -26.1775, lng: -58.1781 },
      'Neuquén': { lat: -38.9516, lng: -68.0591 },
      'Río Negro': { lat: -40.8135, lng: -62.9967 },
      'Chubut': { lat: -43.3002, lng: -65.1023 },
      'Santa Cruz': { lat: -51.6226, lng: -69.2181 },
      'Tierra del Fuego': { lat: -54.8019, lng: -68.3030 },
      'La Pampa': { lat: -36.6142, lng: -64.2936 },
    };

    return coordenadas[provincia] || coordenadas['Buenos Aires'];
  };

  // Filtrar agencias por término de búsqueda
  const agenciasFiltradas = agencias.filter(agencia =>
    agencia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agencia.localidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agencia.provincia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <MapPin className="h-8 w-8 text-primary" />
            Buscar Agencias Cercanas
          </h1>
          <p className="text-muted-foreground text-lg">
            Encuentra la agencia PuntoEnvío más cercana a tu ubicación
          </p>
        </div>

        {/* Ubicación y Búsqueda */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Tu Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userLocation ? (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-medium">Ubicación detectada:</p>
                <p className="text-muted-foreground">{userLocation.city}, {userLocation.region}</p>
              </div>
            ) : (
              <Button 
                onClick={detectarUbicacionPorIP} 
                disabled={detectingLocation}
                className="w-full"
              >
                {detectingLocation ? (
                  <>Detectando ubicación...</>
                ) : (
                  <>
                    <Navigation className="mr-2 h-4 w-4" />
                    Detectar mi ubicación
                  </>
                )}
              </Button>
            )}

            <div className="space-y-2">
              <Label htmlFor="search">O busca por localidad</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre, localidad o provincia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex justify-center py-8">
                <div className="text-muted-foreground">Cargando agencias...</div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center">
                <p className="text-muted-foreground">
                  {agenciasFiltradas.length} agencia{agenciasFiltradas.length !== 1 ? 's' : ''} encontrada{agenciasFiltradas.length !== 1 ? 's' : ''}
                  {userLocation && ' ordenadas por distancia'}
                </p>
              </div>

              <div className="grid gap-4 max-w-4xl mx-auto">
                {agenciasFiltradas.map((agencia) => (
                  <Card key={agencia.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            {agencia.nombre}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {agencia.tipo_parada ? 'Punto de Parada' : 'Agencia Principal'}
                            </Badge>
                            {agencia.distancia && (
                              <Badge variant="secondary">
                                <MapPin className="mr-1 h-3 w-3" />
                                {agencia.distancia.toFixed(1)} km
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                            <p className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <span>
                                {agencia.direccion}<br />
                                {agencia.localidad}, {agencia.provincia}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Contacto</p>
                            <div className="space-y-1">
                              {agencia.contacto?.telefono && (
                                <p className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  {agencia.contacto.telefono}
                                </p>
                              )}
                              {agencia.contacto?.email && (
                                <p className="flex items-center gap-2 text-sm">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  {agencia.contacto.email}
                                </p>
                              )}
                              {(agencia.contacto?.horarios?.apertura && agencia.contacto?.horarios?.cierre) && (
                                <p className="flex items-center gap-2 text-sm">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  {agencia.contacto.horarios.apertura} - {agencia.contacto.horarios.cierre}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {agencia.contacto?.nombre && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm">
                            <span className="font-medium">Responsable:</span> {agencia.contacto.nombre}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {agenciasFiltradas.length === 0 && !loading && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No se encontraron agencias</h3>
                      <p className="text-muted-foreground">
                        No hay agencias que coincidan con tu búsqueda. 
                        Intenta con otra localidad o provincia.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscarAgencias;