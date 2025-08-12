import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Bell, 
  Globe, 
  Palette,
  Server,
  Key,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminConfiguracion: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han aplicado exitosamente",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
            <p className="text-muted-foreground">Ajustes generales y configuraciones avanzadas</p>
          </div>
        </div>
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuración General
              </CardTitle>
              <CardDescription>Ajustes básicos de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Nombre de la Empresa</Label>
                  <Input id="company-name" defaultValue="PuntoEnvío" />
                </div>
                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select defaultValue="utc-3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-3">UTC-3 (Buenos Aires)</SelectItem>
                      <SelectItem value="utc-5">UTC-5 (Lima)</SelectItem>
                      <SelectItem value="utc-6">UTC-6 (México)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="company-address">Dirección Principal</Label>
                <Textarea id="company-address" placeholder="Ingrese la dirección completa..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono Principal</Label>
                  <Input id="phone" placeholder="+54 11 1234-5678" />
                </div>
                <div>
                  <Label htmlFor="email">Email de Contacto</Label>
                  <Input id="email" type="email" placeholder="contacto@puntoenvio.com" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Configuraciones de Órdenes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order-prefix">Prefijo de Órdenes</Label>
                    <Input id="order-prefix" defaultValue="PE" />
                  </div>
                  <div>
                    <Label htmlFor="max-weight">Peso Máximo por Paquete (kg)</Label>
                    <Input id="max-weight" type="number" defaultValue="50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configuración de Email
              </CardTitle>
              <CardDescription>Configurar servidor SMTP y plantillas de email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-port">Puerto</Label>
                  <Input id="smtp-port" placeholder="587" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-user">Usuario</Label>
                  <Input id="smtp-user" placeholder="usuario@gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-pass">Contraseña</Label>
                  <Input id="smtp-pass" type="password" placeholder="••••••••" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="smtp-ssl" defaultChecked />
                <Label htmlFor="smtp-ssl">Usar SSL/TLS</Label>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Plantillas de Email</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Confirmación de Orden</span>
                    <Button size="sm" variant="outline">Editar</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Notificación de Envío</span>
                    <Button size="sm" variant="outline">Editar</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>Entrega Completada</span>
                    <Button size="sm" variant="outline">Editar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>Ajustes de seguridad y autenticación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Políticas de Contraseña</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min-length">Longitud Mínima</Label>
                    <Input id="min-length" type="number" defaultValue="8" />
                  </div>
                  <div>
                    <Label htmlFor="session-timeout">Timeout de Sesión (minutos)</Label>
                    <Input id="session-timeout" type="number" defaultValue="120" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="require-uppercase" defaultChecked />
                    <Label htmlFor="require-uppercase">Requerir mayúsculas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="require-numbers" defaultChecked />
                    <Label htmlFor="require-numbers">Requerir números</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="require-symbols" />
                    <Label htmlFor="require-symbols">Requerir símbolos especiales</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Autenticación de Dos Factores</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="enable-2fa" />
                  <Label htmlFor="enable-2fa">Habilitar 2FA para administradores</Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">API Keys</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">API Key Principal</span>
                      <p className="text-sm text-muted-foreground">Última actualización: hace 30 días</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Key className="mr-2 h-3 w-3" />
                        Regenerar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>Gestionar alertas y notificaciones del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Notificaciones por Email</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notify-new-order">Nueva Orden Creada</Label>
                      <p className="text-sm text-muted-foreground">Notificar cuando se crea una nueva orden</p>
                    </div>
                    <Switch id="notify-new-order" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notify-delivery">Entrega Completada</Label>
                      <p className="text-sm text-muted-foreground">Notificar cuando se completa una entrega</p>
                    </div>
                    <Switch id="notify-delivery" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notify-incident">Incidencias</Label>
                      <p className="text-sm text-muted-foreground">Notificar sobre incidencias en entregas</p>
                    </div>
                    <Switch id="notify-incident" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Notificaciones del Sistema</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notify-maintenance">Mantenimiento Programado</Label>
                      <p className="text-sm text-muted-foreground">Alertas de mantenimiento del sistema</p>
                    </div>
                    <Switch id="notify-maintenance" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notify-backup">Respaldos</Label>
                      <p className="text-sm text-muted-foreground">Notificaciones de respaldos automáticos</p>
                    </div>
                    <Switch id="notify-backup" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Integraciones
              </CardTitle>
              <CardDescription>Configurar integraciones con servicios externos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Google Maps API</h4>
                    <p className="text-sm text-muted-foreground">Para geolocalización y rutas</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Configurar</Button>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">WhatsApp Business API</h4>
                    <p className="text-sm text-muted-foreground">Notificaciones por WhatsApp</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Configurar</Button>
                    <Switch />
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Sistema de Pagos</h4>
                    <p className="text-sm text-muted-foreground">Procesamiento de pagos online</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Configurar</Button>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription>Ajustes técnicos y de rendimiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cache-duration">Duración de Caché (horas)</Label>
                  <Input id="cache-duration" type="number" defaultValue="24" />
                </div>
                <div>
                  <Label htmlFor="log-level">Nivel de Logs</Label>
                  <Select defaultValue="info">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup">Respaldos Automáticos</Label>
                    <p className="text-sm text-muted-foreground">Ejecutar respaldos diarios automáticos</p>
                  </div>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Modo Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">Activar modo de mantenimiento</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Información del Sistema</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Versión</p>
                    <p className="text-lg">v2.1.0</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Base de Datos</p>
                    <p className="text-lg">PostgreSQL 14.9</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Último Respaldo</p>
                    <p className="text-lg">Hoy 03:00</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Uptime</p>
                    <p className="text-lg">15 días</p>
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

export default AdminConfiguracion;