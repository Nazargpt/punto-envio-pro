import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  FileText, 
  PieChart, 
  Calendar,
  Package,
  Truck,
  DollarSign,
  Users
} from 'lucide-react';

const AdminReportes: React.FC = () => {

  const reportTypes = [
    {
      id: 'orders',
      title: 'Reporte de Órdenes',
      description: 'Análisis completo de órdenes de envío',
      icon: Package,
      color: 'text-blue-500'
    },
    {
      id: 'financial',
      title: 'Reporte Financiero',
      description: 'Ingresos, costos y rentabilidad',
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      id: 'performance',
      title: 'Rendimiento Operacional',
      description: 'Métricas de eficiencia y tiempos',
      icon: TrendingUp,
      color: 'text-purple-500'
    },
    {
      id: 'carriers',
      title: 'Reporte de Transportistas',
      description: 'Desempeño y estadísticas de carriers',
      icon: Truck,
      color: 'text-orange-500'
    }
  ];

  const quickReports = [
    { title: 'Órdenes del Día', count: '45', change: '+12%' },
    { title: 'Ingresos del Mes', count: '$28,430', change: '+8.2%' },
    { title: 'Entregas Exitosas', count: '98.5%', change: '+2.1%' },
    { title: 'Transportistas Activos', count: '32', change: '+5%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Centro de Reportes</h1>
            <p className="text-muted-foreground">Análisis y métricas del sistema de envíos</p>
          </div>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Todo
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickReports.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-green-600">{stat.change} vs mes anterior</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Reports Interface */}
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generar Reportes</TabsTrigger>
          <TabsTrigger value="scheduled">Reportes Programados</TabsTrigger>
          <TabsTrigger value="analytics">Análisis en Tiempo Real</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          {/* Report Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Generador de Reportes</CardTitle>
              <CardDescription>Configura y genera reportes personalizados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="report-type">Tipo de Reporte</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orders">Órdenes de Envío</SelectItem>
                      <SelectItem value="financial">Financiero</SelectItem>
                      <SelectItem value="performance">Rendimiento</SelectItem>
                      <SelectItem value="inventory">Inventario</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="period">Período</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Esta Semana</SelectItem>
                      <SelectItem value="month">Este Mes</SelectItem>
                      <SelectItem value="quarter">Trimestre</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="format">Formato</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Formato de salida" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="online">Vista Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Generar Reporte
                </Button>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Programar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <report.icon className={`h-6 w-6 ${report.color}`} />
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Download className="mr-2 h-3 w-3" />
                      Generar
                    </Button>
                    <Button size="sm" variant="outline">
                      <PieChart className="mr-2 h-3 w-3" />
                      Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes Programados</CardTitle>
              <CardDescription>Configura reportes automáticos periódicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Reporte Diario de Órdenes</h4>
                      <p className="text-sm text-muted-foreground">Se envía todos los días a las 8:00 AM</p>
                      <p className="text-xs text-muted-foreground mt-1">Próxima ejecución: Mañana 8:00 AM</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Editar</Button>
                      <Button size="sm" variant="destructive">Pausar</Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Resumen Semanal Financiero</h4>
                      <p className="text-sm text-muted-foreground">Se envía todos los lunes a las 9:00 AM</p>
                      <p className="text-xs text-muted-foreground mt-1">Próxima ejecución: Lunes 9:00 AM</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Editar</Button>
                      <Button size="sm" variant="destructive">Pausar</Button>
                    </div>
                  </div>
                </div>

                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Nuevo Reporte Programado
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard de Análisis</CardTitle>
              <CardDescription>Métricas en tiempo real del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Órdenes por Estado</h4>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Tendencia de Ingresos</h4>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReportes;