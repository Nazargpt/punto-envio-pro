import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Plus, Search, Calendar, Truck, Route } from 'lucide-react';

const HojasRuta: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockRoutes = [
    {
      id: 'HR-001',
      tipo: 'LOCAL_ORIGEN',
      fecha: '2024-01-15',
      transportista: 'Juan Carlos Méndez',
      agencia: 'Agencia Central CABA',
      ordenes: 12,
      estado: 'EN_CURSO',
      zonas: ['Palermo', 'Belgrano', 'Núñez']
    },
    {
      id: 'HR-002',
      tipo: 'LARGA_DISTANCIA',
      fecha: '2024-01-15',
      transportista: 'Transportes del Norte S.A.',
      ruta: 'CABA → Córdoba → Rosario',
      ordenes: 45,
      estado: 'ABIERTA',
      estimado: '8 horas'
    },
    {
      id: 'HR-003',
      tipo: 'LOCAL_DESTINO',
      fecha: '2024-01-14',
      transportista: 'María Elena Vásquez',
      agencia: 'Agencia Córdoba Norte',
      ordenes: 8,
      estado: 'CERRADA',
      zonas: ['Nueva Córdoba', 'Centro', 'Alberdi']
    }
  ];

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      'ABIERTA': { variant: 'secondary', label: 'Abierta' },
      'EN_CURSO': { variant: 'default', label: 'En Curso' },
      'CERRADA': { variant: 'outline', label: 'Cerrada' }
    };
    
    const config = variants[estado] || variants['ABIERTA'];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getTipoBadge = (tipo: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      'LOCAL_ORIGEN': { color: 'bg-blue-100 text-blue-800', label: 'Local Origen' },
      'LARGA_DISTANCIA': { color: 'bg-purple-100 text-purple-800', label: 'Larga Distancia' },
      'LOCAL_DESTINO': { color: 'bg-green-100 text-green-800', label: 'Local Destino' }
    };
    
    const config = variants[tipo] || variants['LOCAL_ORIGEN'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredRoutes = mockRoutes.filter(route =>
    route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.transportista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hojas de Ruta</h1>
          <p className="text-muted-foreground">Gestiona las hojas de ruta locales y de larga distancia</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Hoja de Ruta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas Hoy</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 vs ayer</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Curso</CardTitle>
            <Truck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Locales y LD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <MapPin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Totales</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">167</div>
            <p className="text-xs text-muted-foreground">En hojas activas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda y Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por código o transportista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routes by Type */}
      <Tabs defaultValue="todas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="local">Locales</TabsTrigger>
          <TabsTrigger value="larga">Larga Distancia</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Hojas de Ruta</CardTitle>
              <CardDescription>
                {filteredRoutes.length} hojas de ruta encontradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRoutes.map((route) => (
                  <div key={route.id} className="border rounded-lg p-4 hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{route.id}</h3>
                        {getTipoBadge(route.tipo)}
                        {getEstadoBadge(route.estado)}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ver Detalles</Button>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Transportista</p>
                        <p className="font-medium">{route.transportista}</p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">
                          {route.tipo === 'LARGA_DISTANCIA' ? 'Ruta' : 'Agencia'}
                        </p>
                        <p className="font-medium">
                          {route.tipo === 'LARGA_DISTANCIA' ? route.ruta : route.agencia}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Órdenes</p>
                        <p className="font-medium">{route.ordenes} órdenes</p>
                      </div>
                    </div>

                    {route.zonas && (
                      <div className="mt-3">
                        <p className="text-muted-foreground text-sm mb-1">Zonas de cobertura:</p>
                        <div className="flex flex-wrap gap-1">
                          {route.zonas.map((zona, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {zona}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local">
          <Card>
            <CardHeader>
              <CardTitle>Hojas de Ruta Locales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Contenido específico para rutas locales...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="larga">
          <Card>
            <CardHeader>
              <CardTitle>Hojas de Ruta de Larga Distancia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Contenido específico para rutas de larga distancia...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HojasRuta;