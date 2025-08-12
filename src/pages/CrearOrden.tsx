import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const provinciasArgentina = [
  'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 
  'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 
  'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 
  'Tucumán'
];

const ordenSchema = z.object({
  // Remitente
  remitenteNombre: z.string().min(1, 'Nombre es requerido'),
  remitenteApellido: z.string().min(1, 'Apellido es requerido'),
  remitenteDocumento: z.string().min(1, 'Documento es requerido'),
  remitenteDomicilio: z.string().min(1, 'Domicilio es requerido'),
  remitenteProvincia: z.string().min(1, 'Provincia es requerida'),
  remitenteLocalidad: z.string().min(1, 'Localidad es requerida'),
  diaRecoleccion: z.string().optional(),
  horaRecoleccion: z.string().optional(),
  tipoRecoleccion: z.enum(['domicilio', 'agencia']),
  agenciaOrigenId: z.string().optional(),
  
  // Destinatario
  destinatarioNombre: z.string().min(1, 'Nombre es requerido'),
  destinatarioApellido: z.string().min(1, 'Apellido es requerido'),
  destinatarioDocumento: z.string().min(1, 'Documento es requerido'),
  destinatarioDomicilio: z.string().min(1, 'Domicilio es requerido'),
  destinatarioProvincia: z.string().min(1, 'Provincia es requerida'),
  destinatarioLocalidad: z.string().min(1, 'Localidad es requerida'),
  diaEntrega: z.string().optional(),
  horaEntrega: z.string().optional(),
  tipoEntrega: z.enum(['domicilio', 'agencia']),
  agenciaDestinoId: z.string().optional(),
});

interface Agencia {
  id: string;
  nombre: string;
  direccion: string;
}

type OrdenFormData = z.infer<typeof ordenSchema>;

const CrearOrden = () => {
  const [agenciasDestino, setAgenciasDestino] = useState<Agencia[]>([]);
  const [agenciasOrigen, setAgenciasOrigen] = useState<Agencia[]>([]);
  const [cargandoAgencias, setCargandoAgencias] = useState(false);
  const [enviandoOrden, setEnviandoOrden] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<OrdenFormData>({
    resolver: zodResolver(ordenSchema),
    defaultValues: {
      tipoRecoleccion: 'domicilio',
      tipoEntrega: 'domicilio',
    },
  });

  // Watch para detectar cambios en las localidades y tipos de entrega/recolección
  const tipoEntrega = form.watch('tipoEntrega');
  const tipoRecoleccion = form.watch('tipoRecoleccion');
  const destinatarioLocalidad = form.watch('destinatarioLocalidad');
  const remitenteLocalidad = form.watch('remitenteLocalidad');

  // Cargar agencias de destino cuando se selecciona entrega en agencia y hay localidad
  useEffect(() => {
    if (tipoEntrega === 'agencia' && destinatarioLocalidad) {
      cargarAgenciasDestino(destinatarioLocalidad);
    } else {
      setAgenciasDestino([]);
      form.setValue('agenciaDestinoId', '');
    }
  }, [tipoEntrega, destinatarioLocalidad, form]);

  // Cargar agencias de origen cuando se selecciona recolección en agencia y hay localidad
  useEffect(() => {
    if (tipoRecoleccion === 'agencia' && remitenteLocalidad) {
      cargarAgenciasOrigen(remitenteLocalidad);
    } else {
      setAgenciasOrigen([]);
      form.setValue('agenciaOrigenId', '');
    }
  }, [tipoRecoleccion, remitenteLocalidad, form]);

  const cargarAgenciasDestino = async (localidad: string) => {
    setCargandoAgencias(true);
    try {
      const { data, error } = await supabase
        .from('agencias')
        .select('id, nombre, direccion')
        .eq('localidad', localidad)
        .eq('activo', true);

      if (error) {
        console.error('Error cargando agencias:', error);
        setAgenciasDestino([]);
      } else {
        setAgenciasDestino(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setAgenciasDestino([]);
    } finally {
      setCargandoAgencias(false);
    }
  };

  const cargarAgenciasOrigen = async (localidad: string) => {
    setCargandoAgencias(true);
    try {
      const { data, error } = await supabase
        .from('agencias')
        .select('id, nombre, direccion')
        .eq('localidad', localidad)
        .eq('activo', true);

      if (error) {
        console.error('Error cargando agencias origen:', error);
        setAgenciasOrigen([]);
      } else {
        setAgenciasOrigen(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setAgenciasOrigen([]);
    } finally {
      setCargandoAgencias(false);
    }
  };

  // Calcular fecha sugerida (48 horas después de recolección)
  const calcularFechaEntrega = (fechaRecoleccion: string) => {
    if (!fechaRecoleccion) return '';
    const fecha = new Date(fechaRecoleccion);
    fecha.setDate(fecha.getDate() + 2);
    return fecha.toISOString().split('T')[0];
  };

  const onSubmit = async (data: OrdenFormData) => {
    if (!user?.id) {
      toast.error('Error: Usuario no autenticado');
      return;
    }

    setEnviandoOrden(true);
    try {
      // Preparar datos para la base de datos
      const ordenData = {
        numero_orden: '', // Se auto-genera por el trigger
        remitente_nombre: `${data.remitenteNombre} ${data.remitenteApellido}`,
        remitente_documento: data.remitenteDocumento,
        remitente_domicilio: data.remitenteDomicilio,
        remitente_provincia: data.remitenteProvincia,
        remitente_localidad: data.remitenteLocalidad,
        tipo_recoleccion: data.tipoRecoleccion,
        agencia_origen_id: data.agenciaOrigenId || null,
        fecha_recoleccion: data.diaRecoleccion || null,
        hora_recoleccion: data.horaRecoleccion || null,
        
        destinatario_nombre: `${data.destinatarioNombre} ${data.destinatarioApellido}`,
        destinatario_documento: data.destinatarioDocumento,
        destinatario_domicilio: data.destinatarioDomicilio,
        destinatario_provincia: data.destinatarioProvincia,
        destinatario_localidad: data.destinatarioLocalidad,
        tipo_entrega: data.tipoEntrega,
        agencia_destino_id: data.agenciaDestinoId || null,
        fecha_entrega: data.diaEntrega || null,
        hora_entrega: data.horaEntrega || null,
        
        usuario_creacion_id: user.id,
        estado: 'pendiente'
      };

      const { data: nuevaOrden, error } = await supabase
        .from('ordenes_envio')
        .insert(ordenData)
        .select('numero_orden')
        .single();

      if (error) {
        console.error('Error creando orden:', error);
        toast.error('Error al crear la orden: ' + error.message);
        return;
      }

      toast.success(`Orden creada exitosamente. Número: ${nuevaOrden.numero_orden}`);
      
      // Redirigir al seguimiento con el número de orden
      navigate(`/seguimiento?numero=${nuevaOrden.numero_orden}`);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al crear la orden');
    } finally {
      setEnviandoOrden(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Crear Nueva Orden de Envío</h1>
          <p className="text-muted-foreground">Complete los datos del remitente y destinatario</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna Izquierda - Remitente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Datos del Remitente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="remitenteNombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="remitenteApellido"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="remitenteDocumento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documento</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="DNI / CUIT" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="remitenteDomicilio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domicilio</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Calle y número" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="remitenteProvincia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provincia</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar provincia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinciasArgentina.map((provincia) => (
                                <SelectItem key={provincia} value={provincia}>
                                  {provincia}
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
                      name="remitenteLocalidad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localidad</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="diaRecoleccion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Día de Recolección (Opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                // Auto-completar fecha de entrega
                                const fechaEntrega = calcularFechaEntrega(e.target.value);
                                form.setValue('diaEntrega', fechaEntrega);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="horaRecoleccion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de Recolección (Opcional)</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tipoRecoleccion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Recolección</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="domicilio" id="recoleccion-domicilio" />
                              <Label htmlFor="recoleccion-domicilio">Retiro de domicilio</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="agencia" id="recoleccion-agencia" />
                              <Label htmlFor="recoleccion-agencia">Entrega en agencia cercana</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Selector de Agencia de Origen */}
                  {tipoRecoleccion === 'agencia' && (
                    <FormField
                      control={form.control}
                      name="agenciaOrigenId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agencia de Origen</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue 
                                  placeholder={
                                    cargandoAgencias 
                                      ? "Cargando agencias..." 
                                      : agenciasOrigen.length === 0 
                                        ? "No hay agencias disponibles en esta localidad"
                                        : "Seleccionar agencia"
                                  } 
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {agenciasOrigen.map((agencia) => (
                                <SelectItem key={agencia.id} value={agencia.id}>
                                  {agencia.nombre} - {agencia.direccion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          {!remitenteLocalidad && tipoRecoleccion === 'agencia' && (
                            <p className="text-sm text-muted-foreground">
                              Primero ingrese la localidad del remitente
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Columna Derecha - Destinatario */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Datos del Destinatario
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="destinatarioNombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destinatarioApellido"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="destinatarioDocumento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documento</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="DNI / CUIT" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destinatarioDomicilio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domicilio</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Calle y número" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="destinatarioProvincia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provincia</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar provincia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinciasArgentina.map((provincia) => (
                                <SelectItem key={provincia} value={provincia}>
                                  {provincia}
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
                      name="destinatarioLocalidad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localidad</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="diaEntrega"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Día de Entrega (Opcional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="horaEntrega"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de Entrega (Opcional)</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tipoEntrega"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Entrega</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="domicilio" id="entrega-domicilio" />
                              <Label htmlFor="entrega-domicilio">Entrega a domicilio</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="agencia" id="entrega-agencia" />
                              <Label htmlFor="entrega-agencia">Retiro en Agencia de Destino</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Selector de Agencia de Destino */}
                  {tipoEntrega === 'agencia' && (
                    <FormField
                      control={form.control}
                      name="agenciaDestinoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agencia de Destino</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue 
                                  placeholder={
                                    cargandoAgencias 
                                      ? "Cargando agencias..." 
                                      : agenciasDestino.length === 0 
                                        ? "No hay agencias disponibles en esta localidad"
                                        : "Seleccionar agencia"
                                  } 
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {agenciasDestino.map((agencia) => (
                                <SelectItem key={agencia.id} value={agencia.id}>
                                  {agencia.nombre} - {agencia.direccion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          {!destinatarioLocalidad && tipoEntrega === 'agencia' && (
                            <p className="text-sm text-muted-foreground">
                              Primero ingrese la localidad del destinatario
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit" disabled={enviandoOrden} className="bg-primary hover:bg-primary/90">
                <Calendar className="mr-2 h-4 w-4" />
                {enviandoOrden ? 'Creando Orden...' : 'Crear Orden'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CrearOrden;