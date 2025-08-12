import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Search, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

const Incidencias: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockIncidencias = [
    {
      id: 'INC-001',
      ordenId: 'PE-003',
      tipo: 'DIRECCION_INCORRECTA',
      descripcion: 'Dirección no encontrada. El destinatario reporta que la dirección en el sistema no corresponde.',
      fecha: '2024-01-15T10:30:00',
      reportadoPor: 'Juan Carlos Méndez',
      estado: 'ABIERTA',
      prioridad: 'ALTA',
      comentarios: 2
    },
    {
      id: 'INC-002',
      ordenId: 'PE-007',
      tipo: 'DESTINATARIO_AUSENTE',
      descripcion: 'Destinatario no se encuentra en el domicilio. Se realizaron 3 intentos de entrega.',
      fecha: '2024-01-14T16:45:00',
      reportadoPor: 'María Elena Vásquez',
      estado: 'EN_PROCESO',
      prioridad: 'MEDIA',
      comentarios: 1
    },
    {
      id: 'INC-003',
      ordenId: 'PE-012',
      tipo: 'MERCADERIA_DAÑADA',
      descripcion: 'Paquete llegó con daños en el embalaje. Contenido parcialmente afectado.',
      fecha: '2024-01-13T09:15:00',
      reportadoPor: 'Roberto Silva',
      estado: 'RESUELTA',
      prioridad: 'ALTA',
      comentarios: 5
    },
    {
      id: 'INC-004',
      ordenId: 'PE-018',
      tipo: 'DOCUMENTACION_FALTANTE',
      descripcion: 'Faltan documentos requeridos para la entrega. DNI del destinatario no coincide.',
      fecha: '2024-01-15T14:20:00',
      reportadoPor: 'Ana García',
      estado: 'ABIERTA',
      prioridad: 'MEDIA',
      comentarios: 0
    }
  ];

  const tiposIncidencia = [
    'DIRECCION_INCORRECTA',
    'DESTINATARIO_AUSENTE', 
    'MERCADERIA_DAÑADA',
    'DOCUMENTACION_FALTANTE',
    'VEHICULO_AVERIADO',
    'CLIMA_ADVERSO',
    'OTROS'
  ];

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: any; label: string; icon: any }> = {
      'ABIERTA': { variant: 'destructive', label: 'Abierta', icon: AlertTriangle },
      'EN_PROCESO': { variant: 'default', label: 'En Proceso', icon: Clock },
      'RESUELTA': { variant: 'outline', label: 'Resuelta', icon: CheckCircle }
    };
    
    const config = variants[estado] || variants['ABIERTA'];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPrioridadBadge = (prioridad: string) => {
    const colors: Record<string, string> = {
      'ALTA': 'bg-red-100 text-red-800',
      'MEDIA': 'bg-yellow-100 text-yellow-800', 
      'BAJA': 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[prioridad]}`}>
        {prioridad}
      </span>
    );
  };

  const filteredIncidencias = mockIncidencias.filter(inc =>
    inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.ordenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-AR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incidencias</h1>
          <p className="text-muted-foreground">Gestiona y resuelve incidencias del sistema</p>
        </div>
        <Button>
          <AlertTriangle className="mr-2 h-4 w-4" />
          Nueva Incidencia
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abiertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockIncidencias.filter(i => i.estado === 'ABIERTA').length}
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockIncidencias.filter(i => i.estado === 'EN_PROCESO').length}
            </div>
            <p className="text-xs text-muted-foreground">Siendo atendidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resueltas Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">Resolución</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda y Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por ID, orden o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="estado-filter">Estado</Label>
              <select className="w-full p-2 border border-input rounded-md">
                <option value="">Todos los estados</option>
                <option value="ABIERTA">Abierta</option>
                <option value="EN_PROCESO">En Proceso</option>
                <option value="RESUELTA">Resuelta</option>
              </select>
            </div>

            <div>
              <Label htmlFor="prioridad-filter">Prioridad</Label>
              <select className="w-full p-2 border border-input rounded-md">
                <option value="">Todas las prioridades</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Incidencias */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Incidencias</CardTitle>
          <CardDescription>
            {filteredIncidencias.length} incidencias encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIncidencias.map((incidencia) => (
              <div key={incidencia.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{incidencia.id}</h3>
                    <Badge variant="outline">Orden: {incidencia.ordenId}</Badge>
                    {getEstadoBadge(incidencia.estado)}
                    {getPrioridadBadge(incidencia.prioridad)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ver Detalles</Button>
                    {incidencia.estado !== 'RESUELTA' && (
                      <Button size="sm">Resolver</Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="font-medium">{incidencia.tipo.replace('_', ' ')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Reportado por</p>
                    <p className="font-medium">{incidencia.reportadoPor}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha y hora</p>
                    <p className="font-medium">{formatFecha(incidencia.fecha)}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-muted-foreground mb-1">Descripción</p>
                  <p className="text-sm">{incidencia.descripcion}</p>
                </div>

                {incidencia.comentarios > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>{incidencia.comentarios} comentario{incidencia.comentarios > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulario para Nueva Incidencia */}
      <Card>
        <CardHeader>
          <CardTitle>Reportar Nueva Incidencia</CardTitle>
          <CardDescription>
            Registra una nueva incidencia en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orden-id">ID de Orden</Label>
              <Input id="orden-id" placeholder="PE-XXX" />
            </div>
            
            <div>
              <Label htmlFor="tipo-incidencia">Tipo de Incidencia</Label>
              <select className="w-full p-2 border border-input rounded-md">
                <option value="">Seleccionar tipo</option>
                {tiposIncidencia.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="prioridad">Prioridad</Label>
              <select className="w-full p-2 border border-input rounded-md">
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion-incidencia">Descripción Detallada</Label>
            <Textarea 
              id="descripcion-incidencia"
              placeholder="Describe la incidencia con el mayor detalle posible..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button>Reportar Incidencia</Button>
            <Button variant="outline">Limpiar Formulario</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Incidencias;