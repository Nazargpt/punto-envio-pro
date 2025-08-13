import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Plus, Search, Truck, MapPin, Phone, Mail, Eye, Edit } from 'lucide-react';
import { CrearTransportistaForm } from '@/components/forms/CrearTransportistaForm';
import { VerPerfilTransportista } from '@/components/forms/VerPerfilTransportista';
import { EditarTransportistaForm } from '@/components/forms/EditarTransportistaForm';

const Transportistas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransportistaId, setSelectedTransportistaId] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<'perfil' | 'editar' | null>(null);

  const mockTransportistasLocales = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      nombre: 'Juan Carlos Méndez',
      cuit: '20-12345678-9',
      telefono: '+54 11 1234-5678',
      email: 'juan.mendez@email.com',
      agencia: 'Agencia Central CABA',
      zonas: ['Palermo', 'Belgrano', 'Núñez'],
      activo: true,
      ordenesHoy: 12,
      ordenesCompletadas: 8
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      nombre: 'María Elena Vásquez',
      cuit: '27-87654321-0',
      telefono: '+54 351 987-6543',
      email: 'maria.vasquez@email.com',
      agencia: 'Agencia Córdoba Norte',
      zonas: ['Nueva Córdoba', 'Centro', 'Alberdi'],
      activo: true,
      ordenesHoy: 8,
      ordenesCompletadas: 8
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      nombre: 'Roberto Silva',
      cuit: '20-11223344-5',
      telefono: '+54 341 555-0123',
      email: 'roberto.silva@email.com',
      agencia: 'Agencia Rosario',
      zonas: ['Centro', 'Echesortu', 'Fisherton'],
      activo: false,
      ordenesHoy: 0,
      ordenesCompletadas: 0
    }
  ];

  const mockTransportistasLD = [
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      nombre: 'Transportes del Norte S.A.',
      cuit: '30-98765432-1',
      telefono: '+54 11 4567-8901',
      email: 'info@transportesnorte.com.ar',
      rutas: ['CABA → Córdoba', 'CABA → Rosario', 'CABA → Santa Fe'],
      activo: true,
      capacidad: '15 toneladas',
      frecuencia: 'Diaria'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      nombre: 'Logística Sur Ltda.',
      cuit: '33-55667788-9',
      telefono: '+54 11 2345-6789',
      email: 'operaciones@logisticasur.com',
      rutas: ['CABA → Mendoza', 'CABA → San Juan', 'CABA → La Rioja'],
      activo: true,
      capacidad: '20 toneladas',
      frecuencia: '3 veces por semana'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      nombre: 'Expresos Patagonia',
      cuit: '30-44556677-8',
      telefono: '+54 11 8765-4321',
      email: 'contacto@expresospatagonia.com.ar',
      rutas: ['CABA → Neuquén', 'CABA → Río Gallegos'],
      activo: false,
      capacidad: '12 toneladas',
      frecuencia: 'Semanal'
    }
  ];

  const filteredLocales = mockTransportistasLocales.filter(t =>
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.agencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLD = mockTransportistasLD.filter(t =>
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleVerPerfil = (transportistaId: string) => {
    setSelectedTransportistaId(transportistaId);
    setDialogType('perfil');
  };

  const handleEditar = (transportistaId: string) => {
    setSelectedTransportistaId(transportistaId);
    setDialogType('editar');
  };

  const closeDialog = () => {
    setSelectedTransportistaId(null);
    setDialogType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transportistas</h1>
          <p className="text-muted-foreground">Gestiona transportistas locales y de larga distancia</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Transportista
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CrearTransportistaForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locales Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTransportistasLocales.filter(t => t.activo).length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {mockTransportistasLocales.length} totales
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Larga Distancia</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTransportistasLD.filter(t => t.activo).length}
            </div>
            <p className="text-xs text-muted-foreground">
              empresas activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Hoy</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTransportistasLocales.reduce((sum, t) => sum + t.ordenesHoy, 0)}
            </div>
            <p className="text-xs text-muted-foreground">asignadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efectividad</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">entregas exitosas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar transportista</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre o agencia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transportistas Tabs */}
      <Tabs defaultValue="locales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="locales">Transportistas Locales</TabsTrigger>
          <TabsTrigger value="larga-distancia">Larga Distancia</TabsTrigger>
        </TabsList>

        <TabsContent value="locales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transportistas Locales</CardTitle>
              <CardDescription>
                {filteredLocales.length} transportistas encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLocales.map((transportista) => (
                  <div key={transportista.id} className="border rounded-lg p-4 hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{transportista.nombre}</h3>
                        <Badge variant={transportista.activo ? "default" : "secondary"}>
                          {transportista.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerPerfil(transportista.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Perfil
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditar(transportista.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">CUIT</p>
                        <p className="font-medium">{transportista.cuit}</p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Contacto</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{transportista.telefono}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{transportista.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Agencia Base</p>
                        <p className="font-medium">{transportista.agencia}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Rendimiento Hoy</p>
                        <p className="font-medium">
                          {transportista.ordenesCompletadas}/{transportista.ordenesHoy} órdenes
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-muted-foreground text-sm mb-1">Zonas de cobertura:</p>
                      <div className="flex flex-wrap gap-1">
                        {transportista.zonas.map((zona, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {zona}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="larga-distancia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transportistas de Larga Distancia</CardTitle>
              <CardDescription>
                {filteredLD.length} empresas encontradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLD.map((empresa) => (
                  <div key={empresa.id} className="border rounded-lg p-4 hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{empresa.nombre}</h3>
                        <Badge variant={empresa.activo ? "default" : "secondary"}>
                          {empresa.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerPerfil(empresa.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Perfil
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditar(empresa.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">CUIT</p>
                        <p className="font-medium">{empresa.cuit}</p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Contacto</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{empresa.telefono}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{empresa.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Capacidad</p>
                        <p className="font-medium">{empresa.capacidad}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Frecuencia</p>
                        <p className="font-medium">{empresa.frecuencia}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Rutas disponibles:</p>
                      <div className="flex flex-wrap gap-1">
                        {empresa.rutas.map((ruta, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {ruta}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={dialogType === 'perfil'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Perfil del Transportista</DialogTitle>
          </DialogHeader>
          {selectedTransportistaId && (
            <VerPerfilTransportista transportistaId={selectedTransportistaId} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'editar'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Transportista</DialogTitle>
          </DialogHeader>
          {selectedTransportistaId && (
            <EditarTransportistaForm 
              transportistaId={selectedTransportistaId}
              onSuccess={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transportistas;