import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, Eye, EyeOff, AlertTriangle, Lock, UserCheck, Clock } from 'lucide-react';

interface MaskedTransportista {
  id: string;
  nombre: string;
  apellido: string;
  documento_masked: string;
  email_masked: string;
  telefono_masked: string;
  licencia_conducir_masked: string;
  fecha_vencimiento_licencia: string;
  tipo_transportista: string;
  nombre_empresa: string;
  calificacion: number;
  activo: boolean;
  access_level: string;
  created_at: string;
  updated_at: string;
}

interface MaskedOrden {
  id: string;
  numero_orden: string;
  estado: string;
  remitente_nombre: string;
  remitente_documento_masked: string;
  remitente_domicilio_masked: string;
  remitente_localidad: string;
  remitente_provincia: string;
  destinatario_nombre: string;
  destinatario_documento_masked: string;
  destinatario_domicilio_masked: string;
  destinatario_localidad: string;
  destinatario_provincia: string;
  access_level: string;
  created_at: string;
}

const SecureDataViewer: React.FC = () => {
  const [selectedData, setSelectedData] = useState<MaskedTransportista | MaskedOrden | null>(null);
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [accessReason, setAccessReason] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();

  const loadTransportistaSecure = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_transportista_with_masking', {
        transportista_id: id
      });

      if (error) throw error;
      
      setSelectedData(data[0]);
      toast({
        title: "Datos cargados",
        description: "Datos mostrados con nivel de seguridad: " + data[0]?.access_level,
        variant: "default"
      });
    } catch (error) {
      console.error('Error loading secure transportista:', error);
      toast({
        title: "Error de acceso",
        description: "No tiene permisos para ver estos datos o el transportista no existe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrdenSecure = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_orden_with_masking', {
        orden_id: id
      });

      if (error) throw error;
      
      setSelectedData(data[0]);
      toast({
        title: "Orden cargada",
        description: "Datos mostrados con nivel de seguridad: " + data[0]?.access_level,
        variant: "default"
      });
    } catch (error) {
      console.error('Error loading secure orden:', error);
      toast({
        title: "Error de acceso",
        description: "No tiene permisos para ver estos datos o la orden no existe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const requestSensitiveAccess = async () => {
    if (!accessReason.trim()) {
      toast({
        title: "Justificación requerida",
        description: "Debe proporcionar una justificación comercial válida",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('request_sensitive_data_access', {
        target_table: 'transportistas',
        target_record_id: selectedData?.id,
        target_fields: ['documento', 'email', 'telefono', 'licencia_conducir'],
        business_reason: accessReason
      });

      if (error) throw error;

      toast({
        title: "Solicitud enviada",
        description: "Su solicitud de acceso ha sido registrada y está pendiente de aprobación",
        variant: "default"
      });
      
      setShowAccessRequest(false);
      setAccessReason('');
    } catch (error) {
      console.error('Error requesting access:', error);
      toast({
        title: "Error",
        description: "Error al enviar solicitud de acceso",
        variant: "destructive"
      });
    }
  };

  const loadAuditLogs = async () => {
    if (!isSuperAdmin()) return;

    try {
      const { data, error } = await supabase
        .from('sensitive_data_audit')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  };

  useEffect(() => {
    if (isSuperAdmin()) {
      loadAuditLogs();
    }
  }, []);

  if (!user || !isAdmin()) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Acceso denegado. Esta funcionalidad requiere permisos de administrador.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'SUPERADMIN': return 'bg-red-100 text-red-800 border-red-200';
      case 'ADMIN_AGENCIA': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'OPERADOR_AGENCIA': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMaskingInfo = (level: string) => {
    switch (level) {
      case 'SUPERADMIN': 
        return { icon: EyeOff, text: 'Datos completos visibles', color: 'text-red-600' };
      case 'ADMIN_AGENCIA': 
        return { icon: Eye, text: 'Datos parcialmente enmascarados', color: 'text-orange-600' };
      case 'OPERADOR_AGENCIA': 
        return { icon: Lock, text: 'Datos altamente enmascarados', color: 'text-yellow-600' };
      default: 
        return { icon: Shield, text: 'Sin acceso', color: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Visualizador Seguro de Datos Personales
          </CardTitle>
          <CardDescription>
            Sistema con enmascaramiento de datos y auditoría completa para protección de información sensible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Protección Multi-Capa Activa:</strong> Los datos sensibles están enmascarados según su nivel de acceso. 
              Todo acceso es registrado y auditado. Para datos completos, justifique la necesidad comercial.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button 
              onClick={() => loadTransportistaSecure('550e8400-e29b-41d4-a716-446655440000')}
              disabled={loading}
            >
              Cargar Transportista (Demo)
            </Button>
            <Button 
              onClick={() => loadOrdenSecure('550e8400-e29b-41d4-a716-446655440001')}
              disabled={loading}
              variant="outline"
            >
              Cargar Orden (Demo)
            </Button>
            <Button 
              onClick={() => setShowAccessRequest(true)}
              disabled={!selectedData}
              variant="secondary"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Solicitar Acceso Completo
            </Button>
          </div>

          {selectedData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Datos Enmascarados</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getAccessLevelColor(selectedData.access_level)}>
                      {selectedData.access_level}
                    </Badge>
                    {(() => {
                      const info = getMaskingInfo(selectedData.access_level);
                      const Icon = info.icon;
                      return (
                        <div className={`flex items-center gap-1 text-sm ${info.color}`}>
                          <Icon className="h-4 w-4" />
                          <span>{info.text}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {'documento_masked' in selectedData ? (
                  // Transportista data
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Nombre Completo</Label>
                        <p className="text-base">{selectedData.nombre} {selectedData.apellido}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Documento (Enmascarado)</Label>
                        <p className="text-base font-mono bg-muted px-2 py-1 rounded">
                          {selectedData.documento_masked}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email (Enmascarado)</Label>
                        <p className="text-base font-mono bg-muted px-2 py-1 rounded">
                          {selectedData.email_masked}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Teléfono (Enmascarado)</Label>
                        <p className="text-base font-mono bg-muted px-2 py-1 rounded">
                          {selectedData.telefono_masked}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Licencia (Enmascarada)</Label>
                        <p className="text-base font-mono bg-muted px-2 py-1 rounded">
                          {selectedData.licencia_conducir_masked}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                        <p className="text-base">{selectedData.tipo_transportista}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                        <Badge variant={selectedData.activo ? "default" : "secondary"}>
                          {selectedData.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Calificación</Label>
                        <p className="text-base">{selectedData.calificacion}/5.0</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Orden data
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Datos del Remitente (Enmascarados)</h4>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                          <p className="text-base">{selectedData.remitente_nombre}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Documento (Enmascarado)</Label>
                          <p className="text-base font-mono bg-muted px-2 py-1 rounded">
                            {selectedData.remitente_documento_masked}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Domicilio (Enmascarado)</Label>
                          <p className="text-base font-mono bg-muted px-2 py-1 rounded">
                            {selectedData.remitente_domicilio_masked}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Localidad</Label>
                          <p className="text-base">{selectedData.remitente_localidad}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold">Datos del Destinatario (Enmascarados)</h4>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                          <p className="text-base">{selectedData.destinatario_nombre}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Documento (Enmascarado)</Label>
                          <p className="text-base font-mono bg-muted px-2 py-1 rounded">
                            {selectedData.destinatario_documento_masked}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Domicilio (Enmascarado)</Label>
                          <p className="text-base font-mono bg-muted px-2 py-1 rounded">
                            {selectedData.destinatario_domicilio_masked}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Localidad</Label>
                          <p className="text-base">{selectedData.destinatario_localidad}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Alert className="mt-4">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Acceso registrado el {new Date().toLocaleString()} - Nivel: {selectedData.access_level}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {isSuperAdmin() && auditLogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Registro de Auditoría</CardTitle>
                <CardDescription>
                  Últimos 50 accesos a datos sensibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Tabla</TableHead>
                      <TableHead>Campo</TableHead>
                      <TableHead>Tipo de Acceso</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.slice(0, 10).map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.user_id?.substring(0, 8)}...</TableCell>
                        <TableCell>{log.table_name}</TableCell>
                        <TableCell>{log.field_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.access_type}</Badge>
                        </TableCell>
                        <TableCell>{log.ip_address}</TableCell>
                        <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAccessRequest} onOpenChange={setShowAccessRequest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Acceso a Datos Sensibles</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <UserCheck className="h-4 w-4" />
              <AlertDescription>
                Para acceder a datos no enmascarados, debe proporcionar una justificación comercial válida.
                Esta solicitud será registrada y revisada.
              </AlertDescription>
            </Alert>
            
            <div>
              <Label htmlFor="reason">Justificación Comercial *</Label>
              <Textarea
                id="reason"
                placeholder="Ej: Verificación de identidad para entrega de paquete de alto valor..."
                value={accessReason}
                onChange={(e) => setAccessReason(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={requestSensitiveAccess}>
                Enviar Solicitud
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAccessRequest(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecureDataViewer;