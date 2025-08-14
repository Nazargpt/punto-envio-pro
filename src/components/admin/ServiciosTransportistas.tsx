import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const servicioSchema = z.object({
  transportista_id: z.string().min(1, 'Transportista es requerido'),
  tipo_servicio: z.enum(['retiro_domicilio', 'entrega_domicilio', 'entrega_agencia_origen', 'retiro_agencia_destino']),
  peso_minimo: z.number().min(0),
  peso_maximo: z.number().min(0),
  precio_adicional: z.number().min(0),
  multiplicador: z.number().min(0.1).default(1.0),
});

interface Transportista {
  id: string;
  nombre: string;
  apellido: string;
}

interface ServicioTransportista {
  id: string;
  transportista_id: string;
  tipo_servicio: string;
  peso_minimo: number;
  peso_maximo: number;
  precio_adicional: number;
  multiplicador: number;
  activo: boolean;
  transportistas?: {
    nombre: string;
    apellido: string;
  };
}

const tiposServicio = [
  { value: 'retiro_domicilio', label: 'Retiro de Domicilio' },
  { value: 'entrega_domicilio', label: 'Entrega a Domicilio' },
  { value: 'entrega_agencia_origen', label: 'Entrega en Agencia de Origen' },
  { value: 'retiro_agencia_destino', label: 'Retiro en Agencia de Destino' },
];

const rangosPeso = [
  { value: '0-1', label: '0 - 1 kg', min: 0, max: 1 },
  { value: '1-5', label: '1 - 5 kg', min: 1, max: 5 },
  { value: '5-10', label: '5 - 10 kg', min: 5, max: 10 },
  { value: '10-20', label: '10 - 20 kg', min: 10, max: 20 },
  { value: '20-50', label: '20 - 50 kg', min: 20, max: 50 },
  { value: 'custom', label: 'Rango personalizado', min: 0, max: 0 },
];

type ServicioFormData = z.infer<typeof servicioSchema>;

const ServiciosTransportistas: React.FC = () => {
  const [servicios, setServicios] = useState<ServicioTransportista[]>([]);
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<ServicioTransportista | null>(null);
  const [selectedRangoPeso, setSelectedRangoPeso] = useState<string>('');
  const [showCustomRange, setShowCustomRange] = useState(false);

  const form = useForm<ServicioFormData>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      transportista_id: '',
      tipo_servicio: 'retiro_domicilio',
      peso_minimo: 0,
      peso_maximo: 5,
      precio_adicional: 0,
      multiplicador: 1.0,
    },
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      // Cargar transportistas usando función segura
      const { data: transportistasData, error: transportistasError } = await supabase
        .rpc('get_transportistas_for_services');

      if (transportistasError) {
        console.error('Error cargando transportistas:', transportistasError);
        toast.error('Error al cargar transportistas');
      } else {
        // Map the data to match the expected format
        const mappedData = (transportistasData || []).map(t => ({
          id: t.id,
          nombre: t.nombre_completo.split(' ')[0],
          apellido: t.nombre_completo.split(' ').slice(1).join(' ')
        }));
        setTransportistas(mappedData);
      }

      // Cargar servicios con información del transportista
      const { data: serviciosData, error: serviciosError } = await supabase
        .from('servicios_transportistas')
        .select(`
          *,
          transportistas:transportista_id (
            nombre,
            apellido
          )
        `)
        .order('transportista_id')
        .order('tipo_servicio')
        .order('peso_minimo');

      if (serviciosError) {
        console.error('Error cargando servicios:', serviciosError);
        toast.error('Error al cargar servicios');
      } else {
        setServicios(serviciosData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: ServicioFormData) => {
    try {
      if (editingServicio) {
        // Actualizar servicio existente
        const { error } = await supabase
          .from('servicios_transportistas')
          .update({
            transportista_id: data.transportista_id,
            tipo_servicio: data.tipo_servicio,
            peso_minimo: data.peso_minimo,
            peso_maximo: data.peso_maximo,
            precio_adicional: data.precio_adicional,
            multiplicador: data.multiplicador,
          })
          .eq('id', editingServicio.id);

        if (error) {
          console.error('Error actualizando servicio:', error);
          toast.error('Error al actualizar el servicio');
          return;
        }

        toast.success('Servicio actualizado exitosamente');
      } else {
        // Verificar si ya existe un servicio similar para validar rangos de peso
        const { data: existingServices, error: checkError } = await supabase
          .from('servicios_transportistas')
          .select('*')
          .eq('transportista_id', data.transportista_id)
          .eq('tipo_servicio', data.tipo_servicio)
          .eq('activo', true);

        if (checkError) {
          console.error('Error verificando servicios existentes:', checkError);
          toast.error('Error al verificar servicios existentes');
          return;
        }

        // Validar que no se superpongan los rangos de peso
        const hasOverlap = existingServices?.some(service => 
          (data.peso_minimo >= service.peso_minimo && data.peso_minimo <= service.peso_maximo) ||
          (data.peso_maximo >= service.peso_minimo && data.peso_maximo <= service.peso_maximo) ||
          (data.peso_minimo <= service.peso_minimo && data.peso_maximo >= service.peso_maximo)
        );

        if (hasOverlap) {
          toast.error('Ya existe un servicio con un rango de peso que se superpone');
          return;
        }

        // Crear nuevo servicio
        const { error } = await supabase
          .from('servicios_transportistas')
          .insert([{
            transportista_id: data.transportista_id,
            tipo_servicio: data.tipo_servicio,
            peso_minimo: data.peso_minimo,
            peso_maximo: data.peso_maximo,
            precio_adicional: data.precio_adicional,
            multiplicador: data.multiplicador,
          }]);

        if (error) {
          console.error('Error creando servicio:', error);
          toast.error('Error al crear el servicio');
          return;
        }

        toast.success('Servicio creado exitosamente');
      }

      setIsDialogOpen(false);
      setEditingServicio(null);
      form.reset();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const handleEdit = (servicio: ServicioTransportista) => {
    setEditingServicio(servicio);
    
    // Buscar si coincide con algún rango predefinido
    const rangoExistente = rangosPeso.find(r => 
      r.min === servicio.peso_minimo && r.max === servicio.peso_maximo
    );
    
    if (rangoExistente) {
      setSelectedRangoPeso(rangoExistente.value);
      setShowCustomRange(false);
    } else {
      setSelectedRangoPeso('custom');
      setShowCustomRange(true);
    }
    
    form.reset({
      transportista_id: servicio.transportista_id,
      tipo_servicio: servicio.tipo_servicio as any,
      peso_minimo: servicio.peso_minimo,
      peso_maximo: servicio.peso_maximo,
      precio_adicional: servicio.precio_adicional,
      multiplicador: servicio.multiplicador,
    });
    setIsDialogOpen(true);
  };

  const handleRangoPesoChange = (value: string) => {
    setSelectedRangoPeso(value);
    
    if (value === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      const rango = rangosPeso.find(r => r.value === value);
      if (rango) {
        form.setValue('peso_minimo', rango.min);
        form.setValue('peso_maximo', rango.max);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este servicio?')) return;

    try {
      const { error } = await supabase
        .from('servicios_transportistas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error eliminando servicio:', error);
        toast.error('Error al eliminar el servicio');
        return;
      }

      toast.success('Servicio eliminado exitosamente');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      const { error } = await supabase
        .from('servicios_transportistas')
        .update({ activo })
        .eq('id', id);

      if (error) {
        console.error('Error actualizando estado:', error);
        toast.error('Error al actualizar el estado');
        return;
      }

      toast.success(`Servicio ${activo ? 'activado' : 'desactivado'} exitosamente`);
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const getServicioLabel = (tipo: string) => {
    return tiposServicio.find(s => s.value === tipo)?.label || tipo;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Servicios de Transportistas</h1>
          <p className="text-muted-foreground">Gestiona los precios de servicios por peso y tipo</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingServicio(null);
              setSelectedRangoPeso('');
              setShowCustomRange(false);
              form.reset({
                transportista_id: '',
                tipo_servicio: 'retiro_domicilio',
                peso_minimo: 0,
                peso_maximo: 5,
                precio_adicional: 0,
                multiplicador: 1.0,
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="transportista_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transportista</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar transportista" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transportistas.map((transportista) => (
                            <SelectItem key={transportista.id} value={transportista.id}>
                              {transportista.nombre} {transportista.apellido}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo_servicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Servicio</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposServicio.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Rango de Peso</label>
                    <Select value={selectedRangoPeso} onValueChange={handleRangoPesoChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rango de peso" />
                      </SelectTrigger>
                      <SelectContent>
                        {rangosPeso.map((rango) => (
                          <SelectItem key={rango.value} value={rango.value}>
                            {rango.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {showCustomRange && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="peso_minimo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Peso Mínimo (kg)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1" 
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="peso_maximo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Peso Máximo (kg)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1" 
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="precio_adicional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio Adicional ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="multiplicador"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Multiplicador</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 1.0)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingServicio ? 'Actualizar' : 'Crear'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Lista de Servicios
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transportista</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Peso (kg)</TableHead>
                  <TableHead>Precio Adicional</TableHead>
                  <TableHead>Multiplicador</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicios.map((servicio) => (
                  <TableRow key={servicio.id}>
                    <TableCell>
                      {servicio.transportistas?.nombre} {servicio.transportistas?.apellido}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getServicioLabel(servicio.tipo_servicio)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {servicio.peso_minimo}-{servicio.peso_maximo}
                    </TableCell>
                    <TableCell>${servicio.precio_adicional.toFixed(2)}</TableCell>
                    <TableCell>{servicio.multiplicador}x</TableCell>
                    <TableCell>
                      <Switch
                        checked={servicio.activo}
                        onCheckedChange={(activo) => toggleActivo(servicio.id, activo)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(servicio)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(servicio.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {servicios.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No hay servicios configurados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiciosTransportistas;