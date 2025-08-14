import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, Shield, Eye, FileText, Calendar } from 'lucide-react';

interface SecureOrderView {
  numero_orden: string;
  estado: string;
  remitente_nombre_parcial: string;
  destinatario_nombre_parcial: string;
  remitente_localidad: string;
  destinatario_localidad: string;
  created_at: string;
}

interface FullOrderDetails {
  id: string;
  numero_orden: string;
  estado: string;
  remitente_nombre: string;
  remitente_documento: string;
  remitente_domicilio: string;
  remitente_localidad: string;
  remitente_provincia: string;
  destinatario_nombre: string;
  destinatario_documento: string;
  destinatario_domicilio: string;
  destinatario_localidad: string;
  destinatario_provincia: string;
  created_at: string;
}

const AdminSecureOrderAccess: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'numero_orden' | 'remitente_localidad' | 'destinatario_localidad'>('numero_orden');
  const [orders, setOrders] = useState<SecureOrderView[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<FullOrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();

  // Log sensitive data access for audit purposes
  const logDataAccess = async (orderNumber: string, accessType: string, accessedFields?: string[]) => {
    try {
      await supabase.rpc('log_order_access', {
        p_order_id: selectedOrder?.id || null,
        p_orden_numero: orderNumber,
        p_access_type: accessType,
        p_accessed_fields: accessedFields
      });
    } catch (error) {
      console.error('Error logging data access:', error);
    }
  };

  const searchOrders = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Ingrese un término de búsqueda",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('search_orders_limited', {
        search_term: searchTerm.trim(),
        search_type: searchType
      });

      if (error) {
        throw error;
      }

      setOrders(data || []);
      
      // Log the search action
      await logDataAccess(searchTerm, 'search');

      toast({
        title: "Búsqueda completada",
        description: `Se encontraron ${(data as SecureOrderView[])?.length || 0} órdenes`
      });
    } catch (error) {
      console.error('Error searching orders:', error);
      toast({
        title: "Error",
        description: "Error al buscar órdenes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const viewFullOrderDetails = async (orderNumber: string) => {
    if (!isSuperAdmin()) {
      toast({
        title: "Acceso denegado",
        description: "Solo los superadministradores pueden ver detalles completos",
        variant: "destructive"
      });
      return;
    }

    setLoadingDetails(true);
    try {
      const { data, error } = await supabase
        .from('ordenes_envio')
        .select('*')
        .eq('numero_orden', orderNumber)
        .single();

      if (error) {
        throw error;
      }

      setSelectedOrder(data);
      
      // Log access to sensitive data
      await logDataAccess(orderNumber, 'view_full_details', [
        'remitente_documento', 
        'destinatario_documento', 
        'remitente_domicilio', 
        'destinatario_domicilio'
      ]);

      toast({
        title: "Detalles cargados",
        description: "Acceso a datos sensibles registrado en auditoría"
      });
    } catch (error) {
      console.error('Error loading order details:', error);
      toast({
        title: "Error",
        description: "Error al cargar detalles de la orden",
        variant: "destructive"
      });
    } finally {
      setLoadingDetails(false);
    }
  };

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Acceso Seguro a Órdenes
          </CardTitle>
          <CardDescription>
            Sistema de búsqueda con protección de datos personales y auditoría de acceso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="searchTerm">Término de búsqueda</Label>
              <Input
                id="searchTerm"
                placeholder="Ingrese término de búsqueda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Label htmlFor="searchType">Tipo de búsqueda</Label>
              <select
                id="searchType"
                className="w-full h-10 px-3 border border-input rounded-md"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
              >
                <option value="numero_orden">Número de orden</option>
                <option value="remitente_localidad">Localidad origen</option>
                <option value="destinatario_localidad">Localidad destino</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={searchOrders} disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </div>

          {orders.length > 0 && (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de Orden</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Remitente</TableHead>
                    <TableHead>Destinatario</TableHead>
                    <TableHead>Ruta</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.numero_orden}>
                      <TableCell className="font-mono">{order.numero_orden}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.estado}</Badge>
                      </TableCell>
                      <TableCell>{order.remitente_nombre_parcial}</TableCell>
                      <TableCell>{order.destinatario_nombre_parcial}</TableCell>
                      <TableCell>{order.remitente_localidad} → {order.destinatario_localidad}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isSuperAdmin() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewFullOrderDetails(order.numero_orden)}
                            disabled={loadingDetails}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Ver detalles
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalles Completos - {selectedOrder.numero_orden}
            </CardTitle>
            <CardDescription className="text-orange-600">
              ⚠️ Datos sensibles - Acceso registrado en auditoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Datos del Remitente</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Nombre:</strong> {selectedOrder.remitente_nombre}</div>
                  <div><strong>Documento:</strong> <span className="font-mono bg-yellow-100 px-1 rounded">{selectedOrder.remitente_documento}</span></div>
                  <div><strong>Domicilio:</strong> {selectedOrder.remitente_domicilio}</div>
                  <div><strong>Localidad:</strong> {selectedOrder.remitente_localidad}</div>
                  <div><strong>Provincia:</strong> {selectedOrder.remitente_provincia}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Datos del Destinatario</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Nombre:</strong> {selectedOrder.destinatario_nombre}</div>
                  <div><strong>Documento:</strong> <span className="font-mono bg-yellow-100 px-1 rounded">{selectedOrder.destinatario_documento}</span></div>
                  <div><strong>Domicilio:</strong> {selectedOrder.destinatario_domicilio}</div>
                  <div><strong>Localidad:</strong> {selectedOrder.destinatario_localidad}</div>
                  <div><strong>Provincia:</strong> {selectedOrder.destinatario_provincia}</div>
                </div>
              </div>
            </div>
            
            <Alert className="mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                El acceso a estos datos sensibles ha sido registrado en el log de auditoría para cumplimiento de seguridad.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSecureOrderAccess;