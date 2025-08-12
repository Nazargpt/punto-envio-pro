import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, MapPin, Phone, Mail, User, Clock, Settings } from 'lucide-react';

interface AgenciaDetallesProps {
  agencia: {
    id: string;
    nombre: string;
    direccion: string;
    localidad: string;
    provincia: string;
    contacto: any;
    tipo_parada: boolean;
    activo: boolean;
    created_at: string;
    updated_at: string;
  };
}

const AgenciaDetalles: React.FC<AgenciaDetallesProps> = ({ agencia }) => {
  const contacto = agencia.contacto || {};
  
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Detalles de Agencia
        </DialogTitle>
      </DialogHeader>

      {/* Header con nombre y estado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{agencia.nombre}</h2>
          <p className="text-muted-foreground">ID: {agencia.id}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={agencia.activo ? "default" : "secondary"}>
            {agencia.activo ? "Activa" : "Inactiva"}
          </Badge>
          {agencia.tipo_parada && (
            <Badge variant="outline">Punto de Parada</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información de Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Dirección</Label>
              <p className="text-sm">{agencia.direccion}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Localidad</Label>
              <p className="text-sm">{agencia.localidad}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Provincia</Label>
              <p className="text-sm">{agencia.provincia}</p>
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
              <p className="text-sm flex items-center gap-2">
                <Phone className="h-3 w-3" />
                {contacto.telefono || 'No especificado'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="text-sm flex items-center gap-2">
                <Mail className="h-3 w-3" />
                {contacto.email || 'No especificado'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Responsable</Label>
              <p className="text-sm flex items-center gap-2">
                <User className="h-3 w-3" />
                {contacto.nombre || 'No especificado'}
                {contacto.cargo && (
                  <span className="text-muted-foreground">({contacto.cargo})</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Horarios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios de Atención
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Apertura</Label>
              <p className="text-sm">{contacto.horarios?.apertura || 'No especificado'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Cierre</Label>
              <p className="text-sm">{contacto.horarios?.cierre || 'No especificado'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
              <Badge variant={agencia.activo ? "default" : "secondary"}>
                {agencia.activo ? "Activa" : "Inactiva"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">Tipo de Parada</Label>
              <Badge variant={agencia.tipo_parada ? "outline" : "secondary"}>
                {agencia.tipo_parada ? "Sí" : "No"}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Fecha de Creación</Label>
              <p className="text-sm">{new Date(agencia.created_at).toLocaleDateString('es-AR')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Última Actualización</Label>
              <p className="text-sm">{new Date(agencia.updated_at).toLocaleDateString('es-AR')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente Label simple para evitar imports adicionales
const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <label className={className}>{children}</label>
);

export default AgenciaDetalles;