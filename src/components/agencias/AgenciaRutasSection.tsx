import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GenerarHojasRutaButton } from '@/components/hojas-ruta/GenerarHojasRutaButton';
import { Package, Clock, CheckCircle, Route } from 'lucide-react';

interface AgenciaRutasSectionProps {
  agenciaId: string;
  ordenesStats?: {
    pendientes: number;
    asignadas: number;
    enTransito: number;
    completadas: number;
  };
}

export const AgenciaRutasSection: React.FC<AgenciaRutasSectionProps> = ({ 
  agenciaId, 
  ordenesStats = { pendientes: 0, asignadas: 0, enTransito: 0, completadas: 0 }
}) => {
  return (
    <div className="space-y-6">
      {/* Header with generate button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Hojas de Ruta</h3>
          <p className="text-sm text-muted-foreground">
            Genera automáticamente las hojas de ruta para las órdenes pendientes
          </p>
        </div>
        <GenerarHojasRutaButton agenciaId={agenciaId} />
      </div>

      {/* Orders status cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{ordenesStats.pendientes}</div>
            <p className="text-xs text-muted-foreground">
              Sin asignar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asignadas</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ordenesStats.asignadas}</div>
            <p className="text-xs text-muted-foreground">
              Con hoja de ruta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Tránsito</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{ordenesStats.enTransito}</div>
            <p className="text-xs text-muted-foreground">
              En proceso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ordenesStats.completadas}</div>
            <p className="text-xs text-muted-foreground">
              Entregadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div>
            <h4 className="font-semibold mb-3">¿Cómo funciona la generación automática?</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>El sistema revisa todas las órdenes pendientes de esta agencia</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Asigna transportistas locales según las zonas de cobertura configuradas</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Asigna transportistas de larga distancia según las rutas disponibles</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p>Crea las hojas de ruta asociadas para el seguimiento completo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};