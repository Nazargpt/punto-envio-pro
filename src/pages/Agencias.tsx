import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Plus, Search, MapPin, Phone, Mail, Users } from 'lucide-react';
import CrearAgenciaForm from '@/components/forms/CrearAgenciaForm';

const Agencias: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockAgencias = [
    {
      id: '1',
      nombre: 'Agencia Central CABA',
      codigo: 'CABA-001',
      direccion: 'Av. Corrientes 1234, CABA',
      telefono: '+54 11 4567-8901',
      email: 'caba@puntoenvio.com.ar',
      provincia: 'Buenos Aires',
      localidad: 'Ciudad Autónoma de Buenos Aires',
      codigoPostal: '1043',
      gerente: 'Laura Martínez',
      transportistasAsignados: 15,
      ordenesHoy: 45,
      activa: true,
      capacidadDiaria: 100,
      horarios: 'Lun-Vie: 8:00-18:00, Sáb: 8:00-13:00'
    },
    {
      id: '2',
      nombre: 'Agencia Córdoba Norte',
      codigo: 'CBA-001',
      direccion: 'Av. Colón 567, Córdoba',
      telefono: '+54 351 123-4567',
      email: 'cordoba@puntoenvio.com.ar',
      provincia: 'Córdoba',
      localidad: 'Córdoba',
      codigoPostal: '5000',
      gerente: 'Carlos Rodríguez',
      transportistasAsignados: 8,
      ordenesHoy: 28,
      activa: true,
      capacidadDiaria: 60,
      horarios: 'Lun-Vie: 8:00-17:00, Sáb: 8:00-12:00'
    },
    {
      id: '3',
      nombre: 'Agencia Rosario Centro',
      codigo: 'ROS-001',
      direccion: 'San Martín 890, Rosario',
      telefono: '+54 341 987-6543',
      email: 'rosario@puntoenvio.com.ar',
      provincia: 'Santa Fe',
      localidad: 'Rosario',
      codigoPostal: '2000',
      gerente: 'Ana Fernández',
      transportistasAsignados: 12,
      ordenesHoy: 32,
      activa: true,
      capacidadDiaria: 80,
      horarios: 'Lun-Vie: 7:30-18:30, Sáb: 8:00-13:00'
    },
    {
      id: '4',
      nombre: 'Agencia Mendoza',
      codigo: 'MDZ-001',
      direccion: 'Las Heras 345, Mendoza',
      telefono: '+54 261 555-0123',
      email: 'mendoza@puntoenvio.com.ar',
      provincia: 'Mendoza',
      localidad: 'Mendoza',
      codigoPostal: '5500',
      gerente: 'Miguel Torres',
      transportistasAsignados: 6,
      ordenesHoy: 18,
      activa: false,
      capacidadDiaria: 40,
      horarios: 'Lun-Vie: 8:00-17:00'
    }
  ];

  const filteredAgencias = mockAgencias.filter(agencia =>
    agencia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agencia.localidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agencia.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Gestión de Agencias
          </h1>
          <p className="text-muted-foreground">Administra las agencias de la red PuntoEnvío</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Agencia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CrearAgenciaForm onSuccess={() => window.location.reload()} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agencias Activas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAgencias.filter(a => a.activa).length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {mockAgencias.length} totales
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transportistas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAgencias.reduce((sum, a) => sum + a.transportistasAsignados, 0)}
            </div>
            <p className="text-xs text-muted-foreground">total asignados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Hoy</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAgencias.reduce((sum, a) => sum + a.ordenesHoy, 0)}
            </div>
            <p className="text-xs text-muted-foreground">en proceso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacidad</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAgencias.reduce((sum, a) => sum + a.capacidadDiaria, 0)}
            </div>
            <p className="text-xs text-muted-foreground">órdenes/día</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda de Agencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar agencia</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre, código o localidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agencias List */}
      <Card>
        <CardHeader>
          <CardTitle>Agencias de la Red</CardTitle>
          <CardDescription>
            {filteredAgencias.length} agencias encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAgencias.map((agencia) => (
              <div key={agencia.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">{agencia.nombre}</h3>
                      <p className="text-sm text-muted-foreground">Código: {agencia.codigo}</p>
                    </div>
                    <Badge variant={agencia.activa ? "default" : "secondary"}>
                      {agencia.activa ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ver Detalles</Button>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">Ubicación</p>
                    <p className="font-medium">{agencia.direccion}</p>
                    <p className="text-xs text-muted-foreground">
                      {agencia.localidad}, {agencia.provincia} ({agencia.codigoPostal})
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Contacto</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="text-xs">{agencia.telefono}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">{agencia.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Gerente</p>
                    <p className="font-medium">{agencia.gerente}</p>
                    <p className="text-xs text-muted-foreground">{agencia.horarios}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{agencia.transportistasAsignados} transportistas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{agencia.ordenesHoy} órdenes hoy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>Cap. {agencia.capacidadDiaria}/día</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agencias;