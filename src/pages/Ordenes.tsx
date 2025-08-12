import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Search, Plus, Filter, Eye, Edit, Trash2 } from 'lucide-react';

const Ordenes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockOrders = [
    {
      id: 'PE-001',
      codigo: 'PE-001',
      remitente: 'Juan Pérez',
      destinatario: 'María García',
      origen: 'CABA',
      destino: 'Córdoba',
      peso: '5.2 kg',
      estado: 'EN_TRANSITO',
      fecha: '2024-01-15',
      total: '$15.500'
    },
    {
      id: 'PE-002',
      codigo: 'PE-002',
      remitente: 'Carlos López',
      destinatario: 'Ana Rodríguez',
      origen: 'Rosario',
      destino: 'CABA',
      peso: '3.1 kg',
      estado: 'ENTREGADA',
      fecha: '2024-01-14',
      total: '$12.300'
    },
    {
      id: 'PE-003',
      codigo: 'PE-003',
      remitente: 'Empresa ABC',
      destinatario: 'Cliente XYZ',
      origen: 'La Plata',
      destino: 'Mendoza',
      peso: '8.7 kg',
      estado: 'INCIDENCIA',
      fecha: '2024-01-13',
      total: '$28.900'
    },
    {
      id: 'PE-004',
      codigo: 'PE-004',
      remitente: 'Sofía Martín',
      destinatario: 'Diego Fernández',
      origen: 'Tucumán',
      destino: 'Salta',
      peso: '2.5 kg',
      estado: 'CREADA',
      fecha: '2024-01-15',
      total: '$9.800'
    }
  ];

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      'CREADA': { variant: 'secondary', label: 'Creada' },
      'EN_TRANSITO': { variant: 'default', label: 'En Tránsito' },
      'ENTREGADA': { variant: 'outline', label: 'Entregada' },
      'INCIDENCIA': { variant: 'destructive', label: 'Incidencia' }
    };
    
    const config = variants[estado] || variants['CREADA'];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const filteredOrders = mockOrders.filter(order =>
    order.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.remitente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.destinatario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Órdenes de Envío</h1>
          <p className="text-muted-foreground">Gestiona todas las órdenes del sistema</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Orden
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hoy</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12% vs ayer</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Tránsito</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">3 con incidencias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidencias</CardTitle>
            <Package className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por código, remitente o destinatario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Órdenes</CardTitle>
          <CardDescription>
            {filteredOrders.length} órdenes encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Código</th>
                  <th className="text-left p-2">Remitente</th>
                  <th className="text-left p-2">Destinatario</th>
                  <th className="text-left p-2">Ruta</th>
                  <th className="text-left p-2">Peso</th>
                  <th className="text-left p-2">Estado</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{order.codigo}</td>
                    <td className="p-2">{order.remitente}</td>
                    <td className="p-2">{order.destinatario}</td>
                    <td className="p-2">
                      <span className="text-sm">{order.origen} → {order.destino}</span>
                    </td>
                    <td className="p-2">{order.peso}</td>
                    <td className="p-2">{getEstadoBadge(order.estado)}</td>
                    <td className="p-2 font-medium">{order.total}</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ordenes;