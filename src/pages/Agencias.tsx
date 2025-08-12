import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Plus, Search, MapPin, Phone, Mail, Users } from 'lucide-react';
import CrearAgenciaForm from '@/components/forms/CrearAgenciaForm';
import AgenciaDetalles from '@/components/forms/AgenciaDetalles';
import EditarAgenciaForm from '@/components/forms/EditarAgenciaForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Agencia {
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
}

const Agencias: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgencia, setSelectedAgencia] = useState<Agencia | null>(null);
  const [modalType, setModalType] = useState<'crear' | 'ver' | 'editar' | null>(null);

  // Cargar agencias desde la base de datos
  useEffect(() => {
    const cargarAgencias = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('agencias')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setAgencias(data || []);
      } catch (error) {
        console.error('Error al cargar agencias:', error);
        toast({
          title: "Error al cargar agencias",
          description: "No se pudieron cargar las agencias.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarAgencias();
  }, [toast]);

  const filteredAgencias = agencias.filter(agencia =>
    agencia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agencia.localidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agencia.provincia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuccess = () => {
    setModalType(null);
    setSelectedAgencia(null);
    // Recargar agencias
    window.location.reload();
  };

  const abrirModal = (tipo: 'crear' | 'ver' | 'editar', agencia?: Agencia) => {
    setModalType(tipo);
    setSelectedAgencia(agencia || null);
  };

  const cerrarModal = () => {
    setModalType(null);
    setSelectedAgencia(null);
  };

  // Calcular estadísticas
  const agenciasActivas = agencias.filter(a => a.activo).length;
  const totalTransportistas = 0; // Se calculará con datos reales
  const ordenesHoy = 0; // Se calculará con datos reales
  const capacidadTotal = 0; // Se calculará con datos reales

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Gestión de Agencias
          </h1>
          <p className="text-muted-foreground">Administra las agencias de la red PuntoEnvío</p>
        </div>
        <Dialog open={modalType === 'crear'} onOpenChange={(open) => !open && cerrarModal()}>
          <DialogTrigger asChild>
            <Button onClick={() => abrirModal('crear')}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Agencia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CrearAgenciaForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agencias Activas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agenciasActivas}
            </div>
            <p className="text-xs text-muted-foreground">
              de {agencias.length} totales
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transportistas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTransportistas}
            </div>
            <p className="text-xs text-muted-foreground">total asignados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Hoy</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ordenesHoy}
            </div>
            <p className="text-xs text-muted-foreground">en proceso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacidad</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {capacidadTotal}
            </div>
            <p className="text-xs text-muted-foreground">órdenes/día</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda de Agencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar agencia</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre, código o localidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agencias List */}
      <Card>
        <CardHeader>
          <CardTitle>Agencias de la Red</CardTitle>
          <CardDescription>
            {filteredAgencias.length} agencias encontradas
          </CardDescription>
        </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">Cargando agencias...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAgencias.map((agencia) => (
                <div key={agencia.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{agencia.nombre}</h3>
                        <p className="text-sm text-muted-foreground">ID: {agencia.id.slice(0, 8)}...</p>
                      </div>
                      <Badge variant={agencia.activo ? "default" : "secondary"}>
                        {agencia.activo ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => abrirModal('ver', agencia)}
                      >
                        Ver Detalles
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => abrirModal('editar', agencia)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground">Ubicación</p>
                      <p className="font-medium">{agencia.direccion}</p>
                      <p className="text-xs text-muted-foreground">
                        {agencia.localidad}, {agencia.provincia}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Contacto</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span className="text-xs">{agencia.contacto?.telefono || 'No especificado'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="text-xs">{agencia.contacto?.email || 'No especificado'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Responsable</p>
                      <p className="font-medium">{agencia.contacto?.nombre || 'No especificado'}</p>
                      <p className="text-xs text-muted-foreground">
                        {agencia.contacto?.horarios?.apertura && agencia.contacto?.horarios?.cierre 
                          ? `${agencia.contacto.horarios.apertura} - ${agencia.contacto.horarios.cierre}`
                          : 'Horarios no especificados'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>0 transportistas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>0 órdenes hoy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>Cap. por definir</span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modales */}
        {modalType === 'ver' && selectedAgencia && (
          <Dialog open={true} onOpenChange={cerrarModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <AgenciaDetalles agencia={selectedAgencia} />
            </DialogContent>
          </Dialog>
        )}

        {modalType === 'editar' && selectedAgencia && (
          <Dialog open={true} onOpenChange={cerrarModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <EditarAgenciaForm agencia={selectedAgencia} onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  };

  export default Agencias;