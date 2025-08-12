import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Truck, Users, Settings, BarChart3, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona agencias, transportistas y configuraciones del sistema</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agencias Activas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">en toda la red</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transportistas</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendimiento</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agencias Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Gestión de Agencias</CardTitle>
                <CardDescription>
                  Administra las agencias de la red, ubicaciones y capacidades
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Agencias</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div>
                <p className="text-muted-foreground">Nuevas este mes</p>
                <p className="text-2xl font-bold text-green-600">2</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/agencias" className="flex-1">
                <Button className="w-full">
                  <Building2 className="mr-2 h-4 w-4" />
                  Gestionar Agencias
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Transportistas Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-orange-600" />
              <div>
                <CardTitle>Gestión de Transportistas</CardTitle>
                <CardDescription>
                  Administra transportistas locales y de larga distancia
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Transportistas</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <div>
                <p className="text-muted-foreground">Activos hoy</p>
                <p className="text-2xl font-bold text-green-600">38</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/transportistas" className="flex-1">
                <Button className="w-full">
                  <Truck className="mr-2 h-4 w-4" />
                  Gestionar Transportistas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Admin Functions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuraciones del Sistema
          </CardTitle>
          <CardDescription>
            Acceso rápido a configuraciones importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span>Usuarios</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Reportes</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              <span>Configuración</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;