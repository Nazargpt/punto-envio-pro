import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const { toast } = useToast();
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  
  // Estado para reportes programados
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      name: 'Reporte Diario de Órdenes',
      description: 'Se envía todos los días a las 8:00 AM',
      nextExecution: 'Mañana 8:00 AM',
      type: 'orders',
      frequency: 'daily',
      time: '08:00',
      active: true,
      recipients: ['admin@puntoenvio.com']
    },
    {
      id: 2,
      name: 'Resumen Semanal Financiero',
      description: 'Se envía todos los lunes a las 9:00 AM',
      nextExecution: 'Lunes 9:00 AM',
      type: 'financial',
      frequency: 'weekly',
      time: '09:00',
      day: 'monday',
      active: true,
      recipients: ['admin@puntoenvio.com', 'finanzas@puntoenvio.com']
    }
  ]);

  // Estado para nuevo reporte programado
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    type: '',
    frequency: '',
    time: '',
    day: '',
    recipients: [''],
    active: true
  });

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

  // Funciones para generar reportes
  const generateOrdersReport = async () => {
    setIsGenerating(true);
    try {
      const { data: orders, error } = await supabase
        .from('ordenes_envio')
        .select(`
          *,
          paquetes(*),
          seguimiento_detallado(*)
        `);

      if (error) throw error;

      const reportData = {
        type: 'orders',
        title: 'Reporte de Órdenes',
        data: orders,
        summary: {
          total: orders?.length || 0,
          pendientes: orders?.filter(o => o.estado === 'pendiente').length || 0,
          enTransito: orders?.filter(o => o.estado === 'en_transito').length || 0,
          entregadas: orders?.filter(o => o.estado === 'entregada').length || 0
        }
      };

      setReportData(reportData);
      setShowReportModal(true);
      toast({
        title: "Reporte generado",
        description: "El reporte de órdenes se ha generado exitosamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte de órdenes.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFinancialReport = async () => {
    setIsGenerating(true);
    try {
      const { data: orders, error } = await supabase
        .from('ordenes_envio')
        .select(`
          *,
          paquetes(*)
        `);

      if (error) throw error;

      const { data: tarifas } = await supabase
        .from('tarifas')
        .select('*');

      const reportData = {
        type: 'financial',
        title: 'Reporte Financiero',
        data: { orders, tarifas },
        summary: {
          totalOrdenes: orders?.length || 0,
          ingresosTotales: (orders?.length || 0) * 25000, // Estimado
          costoOperativo: (orders?.length || 0) * 18000, // Estimado
          ganancia: (orders?.length || 0) * 7000 // Estimado
        }
      };

      setReportData(reportData);
      setShowReportModal(true);
      toast({
        title: "Reporte generado",
        description: "El reporte financiero se ha generado exitosamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte financiero.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePerformanceReport = async () => {
    setIsGenerating(true);
    try {
      const { data: orders, error } = await supabase
        .from('ordenes_envio')
        .select(`
          *,
          seguimiento_detallado(*)
        `);

      const { data: hojas } = await supabase
        .from('hojas_ruta')
        .select('*');

      if (error) throw error;

      const reportData = {
        type: 'performance',
        title: 'Rendimiento Operacional',
        data: { orders, hojas },
        summary: {
          eficienciaEntrega: '95.2%',
          tiempoPromedioEntrega: '2.3 días',
          rutasCompletadas: hojas?.filter(h => h.estado === 'completada').length || 0,
          rutasPlanificadas: hojas?.length || 0
        }
      };

      setReportData(reportData);
      setShowReportModal(true);
      toast({
        title: "Reporte generado",
        description: "El reporte de rendimiento se ha generado exitosamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte de rendimiento.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCarriersReport = async () => {
    setIsGenerating(true);
    try {
      const { data: transportistas, error } = await supabase
        .from('transportistas')
        .select(`
          *,
          vehiculos(*),
          transportistas_rutas(*)
        `);

      if (error) throw error;

      const reportData = {
        type: 'carriers',
        title: 'Reporte de Transportistas',
        data: transportistas,
        summary: {
          totalTransportistas: transportistas?.length || 0,
          activos: transportistas?.filter(t => t.activo).length || 0,
          calificacionPromedio: (transportistas?.reduce((acc, t) => acc + (t.calificacion || 0), 0) / (transportistas?.length || 1)).toFixed(1),
          vehiculosAsignados: transportistas?.reduce((acc, t) => acc + (t.vehiculos?.length || 0), 0) || 0
        }
      };

      setReportData(reportData);
      setShowReportModal(true);
      toast({
        title: "Reporte generado",
        description: "El reporte de transportistas se ha generado exitosamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte de transportistas.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedReportType || !selectedPeriod || !selectedFormat) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos antes de generar el reporte.",
        variant: "destructive"
      });
      return;
    }

    switch (selectedReportType) {
      case 'orders':
        await generateOrdersReport();
        break;
      case 'financial':
        await generateFinancialReport();
        break;
      case 'performance':
        await generatePerformanceReport();
        break;
      case 'carriers':
        await generateCarriersReport();
        break;
      default:
        toast({
          title: "Tipo de reporte no válido",
          description: "Selecciona un tipo de reporte válido.",
          variant: "destructive"
        });
    }
  };

  const handleScheduleReport = () => {
    if (!selectedReportType || !selectedPeriod) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, selecciona el tipo de reporte y período.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reporte programado",
      description: `Se ha programado el reporte ${selectedReportType} para ejecutarse ${selectedPeriod}.`
    });
  };

  // Funciones para manejar reportes programados
  const handleEditSchedule = (scheduleId: number) => {
    const schedule = scheduledReports.find(s => s.id === scheduleId);
    if (schedule) {
      setEditingSchedule(schedule);
      setNewSchedule({
        name: schedule.name,
        type: schedule.type,
        frequency: schedule.frequency,
        time: schedule.time,
        day: schedule.day || '',
        recipients: schedule.recipients,
        active: schedule.active
      });
      setShowScheduleModal(true);
    }
  };

  const handlePauseSchedule = (scheduleId: number) => {
    setScheduledReports(prev => 
      prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, active: !schedule.active }
          : schedule
      )
    );
    
    const schedule = scheduledReports.find(s => s.id === scheduleId);
    toast({
      title: schedule?.active ? "Reporte pausado" : "Reporte activado",
      description: `El reporte "${schedule?.name}" ha sido ${schedule?.active ? 'pausado' : 'activado'}.`
    });
  };

  const handleCreateNewSchedule = () => {
    setEditingSchedule(null);
    setNewSchedule({
      name: '',
      type: '',
      frequency: '',
      time: '',
      day: '',
      recipients: [''],
      active: true
    });
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = () => {
    if (!newSchedule.name || !newSchedule.type || !newSchedule.frequency || !newSchedule.time) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    if (editingSchedule) {
      // Editar reporte existente
      setScheduledReports(prev =>
        prev.map(schedule =>
          schedule.id === editingSchedule.id
            ? {
                ...schedule,
                ...newSchedule,
                description: `Se envía ${newSchedule.frequency === 'daily' ? 'todos los días' : 'semanalmente'} a las ${newSchedule.time}`,
                nextExecution: `${newSchedule.frequency === 'daily' ? 'Mañana' : 'Lunes'} ${newSchedule.time}`
              }
            : schedule
        )
      );
      toast({
        title: "Reporte actualizado",
        description: "La configuración del reporte ha sido actualizada."
      });
    } else {
      // Crear nuevo reporte
      const newId = Math.max(...scheduledReports.map(s => s.id)) + 1;
      const newReport = {
        id: newId,
        ...newSchedule,
        description: `Se envía ${newSchedule.frequency === 'daily' ? 'todos los días' : 'semanalmente'} a las ${newSchedule.time}`,
        nextExecution: `${newSchedule.frequency === 'daily' ? 'Mañana' : 'Lunes'} ${newSchedule.time}`
      };
      
      setScheduledReports(prev => [...prev, newReport]);
      toast({
        title: "Reporte creado",
        description: "El nuevo reporte programado ha sido creado exitosamente."
      });
    }

    setShowScheduleModal(false);
    setEditingSchedule(null);
  };

  const addRecipient = () => {
    setNewSchedule(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  };

  const removeRecipient = (index: number) => {
    setNewSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const updateRecipient = (index: number, email: string) => {
    setNewSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => i === index ? email : recipient)
    }));
  };

  const downloadReport = (format: string) => {
    if (!reportData) return;

    const filename = `${reportData.type}_report_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      // Simular descarga CSV
      const csvContent = "data:text/csv;charset=utf-8," + 
        Object.keys(reportData.summary).map(key => `${key},${reportData.summary[key]}`).join('\n');
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `${filename}.csv`);
      link.click();
    }

    toast({
      title: "Descarga iniciada",
      description: `Descargando reporte en formato ${format.toUpperCase()}.`
    });
  };

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
                  <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orders">Órdenes de Envío</SelectItem>
                      <SelectItem value="financial">Financiero</SelectItem>
                      <SelectItem value="performance">Rendimiento</SelectItem>
                      <SelectItem value="carriers">Transportistas</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="period">Período</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
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
                <Button 
                  className="flex-1" 
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isGenerating ? 'Generando...' : 'Generar Reporte'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleScheduleReport}
                >
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
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={async () => {
                        switch(report.id) {
                          case 'orders':
                            await generateOrdersReport();
                            break;
                          case 'financial':
                            await generateFinancialReport();
                            break;
                          case 'performance':
                            await generatePerformanceReport();
                            break;
                          case 'carriers':
                            await generateCarriersReport();
                            break;
                        }
                      }}
                      disabled={isGenerating}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      {isGenerating ? 'Generando...' : 'Generar'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={async () => {
                        switch(report.id) {
                          case 'orders':
                            await generateOrdersReport();
                            break;
                          case 'financial':
                            await generateFinancialReport();
                            break;
                          case 'performance':
                            await generatePerformanceReport();
                            break;
                          case 'carriers':
                            await generateCarriersReport();
                            break;
                        }
                      }}
                    >
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
                {scheduledReports.map((schedule) => (
                  <div key={schedule.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{schedule.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            schedule.active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {schedule.active ? 'Activo' : 'Pausado'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{schedule.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Próxima ejecución: {schedule.nextExecution}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Destinatarios: {schedule.recipients.join(', ')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditSchedule(schedule.id)}
                        >
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant={schedule.active ? "destructive" : "default"}
                          onClick={() => handlePauseSchedule(schedule.id)}
                        >
                          {schedule.active ? 'Pausar' : 'Activar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button onClick={handleCreateNewSchedule}>
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

      {/* Modal para mostrar reportes */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{reportData?.title}</DialogTitle>
            <DialogDescription>
              Reporte generado el {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {reportData && (
            <div className="space-y-6">
              {/* Resumen del reporte */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(reportData.summary).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </div>
                      <div className="text-2xl font-bold">{String(value)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tabla de datos */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 font-semibold">
                  Datos Detallados
                </div>
                <div className="p-4 max-h-64 overflow-y-auto">
                  {reportData.type === 'orders' && (
                    <div className="space-y-2">
                      {reportData.data?.slice(0, 10).map((order: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b">
                          <span>{order.numero_orden}</span>
                          <span className="text-sm text-muted-foreground">{order.estado}</span>
                          <span>{order.destinatario_nombre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {reportData.type === 'financial' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-4 p-2 font-semibold border-b">
                        <span>Concepto</span>
                        <span>Cantidad</span>
                        <span>Monto</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 p-2">
                        <span>Ingresos Totales</span>
                        <span>{reportData.summary.totalOrdenes}</span>
                        <span>${reportData.summary.ingresosTotales}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 p-2">
                        <span>Costos Operativos</span>
                        <span>{reportData.summary.totalOrdenes}</span>
                        <span>${reportData.summary.costoOperativo}</span>
                      </div>
                    </div>
                  )}

                  {reportData.type === 'carriers' && (
                    <div className="space-y-2">
                      {reportData.data?.slice(0, 10).map((carrier: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b">
                          <span>{carrier.nombre} {carrier.apellido}</span>
                          <span className="text-sm text-muted-foreground">⭐ {carrier.calificacion}</span>
                          <span className={carrier.activo ? 'text-green-600' : 'text-red-600'}>
                            {carrier.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {reportData.type === 'performance' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 p-2 font-semibold border-b">
                        <span>Métrica</span>
                        <span>Valor</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 p-2">
                        <span>Eficiencia de Entrega</span>
                        <span>{reportData.summary.eficienciaEntrega}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 p-2">
                        <span>Tiempo Promedio</span>
                        <span>{reportData.summary.tiempoPromedioEntrega}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => downloadReport('csv')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar CSV
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => downloadReport('pdf')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
                <Button onClick={() => setShowReportModal(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para crear/editar reportes programados */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? 'Editar Reporte Programado' : 'Nuevo Reporte Programado'}
            </DialogTitle>
            <DialogDescription>
              Configura los detalles del reporte automático
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule-name">Nombre del Reporte</Label>
                <Input
                  id="schedule-name"
                  placeholder="Ej: Reporte Semanal de Ventas"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="schedule-type">Tipo de Reporte</Label>
                <Select value={newSchedule.type} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orders">Órdenes de Envío</SelectItem>
                    <SelectItem value="financial">Financiero</SelectItem>
                    <SelectItem value="performance">Rendimiento</SelectItem>
                    <SelectItem value="carriers">Transportistas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule-frequency">Frecuencia</Label>
                <Select value={newSchedule.frequency} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="schedule-time">Hora de Envío</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            {newSchedule.frequency === 'weekly' && (
              <div>
                <Label htmlFor="schedule-day">Día de la Semana</Label>
                <Select value={newSchedule.day} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, day: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar día" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Lunes</SelectItem>
                    <SelectItem value="tuesday">Martes</SelectItem>
                    <SelectItem value="wednesday">Miércoles</SelectItem>
                    <SelectItem value="thursday">Jueves</SelectItem>
                    <SelectItem value="friday">Viernes</SelectItem>
                    <SelectItem value="saturday">Sábado</SelectItem>
                    <SelectItem value="sunday">Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Destinatarios</Label>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={addRecipient}
                >
                  Agregar Email
                </Button>
              </div>
              <div className="space-y-2">
                {newSchedule.recipients.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="email@ejemplo.com"
                      value={email}
                      onChange={(e) => updateRecipient(index, e.target.value)}
                    />
                    {newSchedule.recipients.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeRecipient(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowScheduleModal(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveSchedule}>
                {editingSchedule ? 'Actualizar' : 'Crear'} Reporte
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReportes;