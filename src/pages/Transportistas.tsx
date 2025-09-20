import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Plus, Search, Truck, MapPin, Phone, Mail, Eye, Edit, Shield } from 'lucide-react';
import { CrearTransportistaForm } from '@/components/forms/CrearTransportistaForm';
import { VerPerfilTransportista } from '@/components/forms/VerPerfilTransportista';
import { EditarTransportistaForm } from '@/components/forms/EditarTransportistaForm';
import { useTransportistasSecure } from '@/hooks/useTransportistasSecure';
import { useAuth } from '@/contexts/AuthContext';

const Transportistas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransportistaId, setSelectedTransportistaId] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<'perfil' | 'editar' | null>(null);
  
  const { transportistas, loading } = useTransportistasSecure();
  const { isAdmin, isSuperAdmin } = useAuth();

  // Filter transportistas by search term and type
  const filteredLocales = transportistas.filter(t =>
    t.tipo_transportista === 'local' &&
    t.activo &&
    (t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     t.apellido.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredLD = transportistas.filter(t =>
    t.tipo_transportista === 'larga_distancia' &&
    t.activo &&
    (t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     t.apellido.toLowerCase().includes(searchTerm.toLowerCase()))
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
              {loading ? '...' : filteredLocales.length}
            </div>
            <p className="text-xs text-muted-foreground">
              transportistas locales
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
              {loading ? '...' : filteredLD.length}
            </div>
            <p className="text-xs text-muted-foreground">
              larga distancia
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
              {loading ? '...' : transportistas.length}
            </div>
            <p className="text-xs text-muted-foreground">total activos</p>
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
              {loading ? (
                <p className="text-center text-muted-foreground">Cargando transportistas...</p>
              ) : (
                <div className="space-y-4">
                  {filteredLocales.map((transportista) => (
                    <div key={transportista.id} className="border rounded-lg p-4 hover:bg-muted/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{transportista.nombre} {transportista.apellido}</h3>
                          <Badge variant={transportista.activo ? "default" : "secondary"}>
                            {transportista.activo ? "Activo" : "Inactivo"}
                          </Badge>
                          {(isAdmin() || isSuperAdmin()) && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Acceso Seguro
                            </Badge>
                          )}
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
                          {(isAdmin() || isSuperAdmin()) && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditar(transportista.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Tipo</p>
                          <p className="font-medium capitalize">{transportista.tipo_transportista.replace('_', ' ')}</p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">Estado</p>
                          <Badge variant={transportista.activo ? "default" : "secondary"} className="text-xs">
                            {transportista.activo ? "Disponible" : "No disponible"}
                          </Badge>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Registrado</p>
                          <p className="font-medium text-xs">
                            {new Date(transportista.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3 inline mr-1" />
                        Datos protegidos por políticas de seguridad
                      </div>
                    </div>
                  ))}
                  
                  {filteredLocales.length === 0 && !loading && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No se encontraron transportistas locales</p>
                    </div>
                  )}
                </div>
              )}
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
              {loading ? (
                <p className="text-center text-muted-foreground">Cargando transportistas...</p>
              ) : (
                <div className="space-y-4">
                  {filteredLD.map((transportista) => (
                    <div key={transportista.id} className="border rounded-lg p-4 hover:bg-muted/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{transportista.nombre} {transportista.apellido}</h3>
                          <Badge variant={transportista.activo ? "default" : "secondary"}>
                            {transportista.activo ? "Activo" : "Inactivo"}
                          </Badge>
                          {(isAdmin() || isSuperAdmin()) && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Acceso Seguro
                            </Badge>
                          )}
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
                          {(isAdmin() || isSuperAdmin()) && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditar(transportista.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Tipo</p>
                          <p className="font-medium capitalize">{transportista.tipo_transportista.replace('_', ' ')}</p>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground">Estado</p>
                          <Badge variant={transportista.activo ? "default" : "secondary"} className="text-xs">
                            {transportista.activo ? "Disponible" : "No disponible"}
                          </Badge>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Registrado</p>
                          <p className="font-medium text-xs">
                            {new Date(transportista.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3 inline mr-1" />
                        Datos protegidos por políticas de seguridad
                      </div>
                    </div>
                  ))}
                  
                  {filteredLD.length === 0 && !loading && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No se encontraron transportistas de larga distancia</p>
                    </div>
                  )}
                </div>
              )}
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