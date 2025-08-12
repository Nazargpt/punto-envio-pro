import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, Users, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Index = () => {
  const stats = [
    {
      title: "Órdenes Hoy",
      value: "24",
      description: "+12% vs ayer",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "En Tránsito",
      value: "67",
      description: "3 con incidencias",
      icon: Truck,
      color: "text-orange-600"
    },
    {
      title: "Entregadas",
      value: "142",
      description: "Esta semana",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Tiempo Promedio",
      value: "2.3h",
      description: "Última milla",
      icon: Clock,
      color: "text-purple-600"
    }
  ];

  const recentOrders = [
    { id: "PE-001", cliente: "Juan Pérez", destino: "CABA", estado: "EN_TRANSITO", tiempo: "2h" },
    { id: "PE-002", cliente: "María García", destino: "Córdoba", estado: "ENTREGADA", tiempo: "1h" },
    { id: "PE-003", cliente: "Carlos López", destino: "Rosario", estado: "INCIDENCIA", tiempo: "4h" },
    { id: "PE-004", cliente: "Ana Rodríguez", destino: "CABA", estado: "ASIGNADA", tiempo: "30m" },
  ];

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'ENTREGADA': return 'text-green-600 bg-green-50';
      case 'EN_TRANSITO': return 'text-orange-600 bg-orange-50';
      case 'INCIDENCIA': return 'text-red-600 bg-red-50';
      case 'ASIGNADA': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard Principal</h1>
          <p className="text-muted-foreground">Resumen general del sistema PuntoEnvío</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes Recientes</CardTitle>
            <CardDescription>Últimas órdenes del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.cliente}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{order.destino}</p>
                      <p className="text-xs text-muted-foreground">{order.tiempo}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.estado)}`}>
                      {order.estado.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
