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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Calculator, MapPin, Package, FileText, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const provinciasArgentina = [
  'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 
  'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 
  'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 
  'Tucumán'
];

const cotizadorSchema = z.object({
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

  // Paquete
  cotaPeso: z.string().min(1, 'Cota de peso es requerida'),
  valorDeclarado: z.string().min(1, 'Valor declarado es requerido').transform(val => parseFloat(val)),
  descripcionPaquete: z.string().min(1, 'Descripción es requerida'),
  
  // Servicios adicionales
  termosellado: z.boolean().default(false)
});

interface Agencia {
  id: string;
  nombre: string;
  direccion: string;
}

interface Cotizacion {
  flete: number;
  seguro: number;
  cargosAdministrativos: number;
  termosellado: number;
  serviciosTransportista: number;
  subtotal: number;
  iva: number;
  total: number;
}

type CotizadorFormData = z.infer<typeof cotizadorSchema>;

const Cotizador = () => {
  const [agenciasDestino, setAgenciasDestino] = useState<Agencia[]>([]);
  const [agenciasOrigen, setAgenciasOrigen] = useState<Agencia[]>([]);
  const [cargandoAgencias, setCargandoAgencias] = useState(false);
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
  const [calculandoCotizacion, setCalculandoCotizacion] = useState(false);
  
  const navigate = useNavigate();

  const form = useForm<CotizadorFormData>({
    resolver: zodResolver(cotizadorSchema),
    defaultValues: {
      tipoRecoleccion: 'domicilio',
      tipoEntrega: 'domicilio',
      termosellado: false,
    },
  });

  const tipoEntrega = form.watch('tipoEntrega');
  const tipoRecoleccion = form.watch('tipoRecoleccion');
  const destinatarioLocalidad = form.watch('destinatarioLocalidad');
  const remitenteLocalidad = form.watch('remitenteLocalidad');
  const remitenteProvincia = form.watch('remitenteProvincia');
  const destinatarioProvincia = form.watch('destinatarioProvincia');
  const cotaPeso = form.watch('cotaPeso');
  const valorDeclarado = form.watch('valorDeclarado');
  const termosellado = form.watch('termosellado');

  // Cargar agencias
  useEffect(() => {
    if (tipoEntrega === 'agencia' && destinatarioLocalidad) {
      cargarAgenciasDestino(destinatarioLocalidad);
    } else {
      setAgenciasDestino([]);
      form.setValue('agenciaDestinoId', '');
    }
  }, [tipoEntrega, destinatarioLocalidad, form]);

  useEffect(() => {
    if (tipoRecoleccion === 'agencia' && remitenteLocalidad) {
      cargarAgenciasOrigen(remitenteLocalidad);
    } else {
      setAgenciasOrigen([]);
      form.setValue('agenciaOrigenId', '');
    }
  }, [tipoRecoleccion, remitenteLocalidad, form]);

  // Calcular cotización automáticamente
  useEffect(() => {
    if (remitenteProvincia && destinatarioProvincia && cotaPeso && valorDeclarado) {
      calcularCotizacion();
    }
  }, [remitenteProvincia, destinatarioProvincia, cotaPeso, valorDeclarado, termosellado]);

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

  const obtenerPesoMaximo = (cota: string): number => {
    switch (cota) {
      case '0-5': return 5;
      case '5-10': return 10;
      case '10-15': return 15;
      case '15-20': return 20;
      case '20-25': return 25;
      case '25+': return 30; // Asumimos 30kg como máximo para cálculos
      default: return 5;
    }
  };

  const calcularCotizacion = async () => {
    if (!remitenteProvincia || !destinatarioProvincia || !cotaPeso || !valorDeclarado) return;
    
    const pesoKg = obtenerPesoMaximo(cotaPeso);

    setCalculandoCotizacion(true);
    try {
      // Buscar tarifa en la base de datos
      const { data: tarifas, error } = await supabase
        .from('tarifas')
        .select('precio_base')
        .eq('provincia_origen', remitenteProvincia)
        .eq('provincia_destino', destinatarioProvincia)
        .eq('activo', true)
        .single();

      let flete = 0;
      
      if (tarifas) {
        flete = tarifas.precio_base;
      } else {
        // Precio base por defecto si no hay tarifa específica
        flete = 5000;
        toast.info('Tarifa no encontrada, usando precio base');
      }

      // Ajustes por peso según cota seleccionada
      const ajustePorPeso = pesoKg > 5 ? Math.ceil((pesoKg - 5) / 5) * 500 : 0;
      flete += ajustePorPeso;

      // Calcular servicios de transportista
      let serviciosTransportista = 0;
      
      // Determinar servicios según tipo de recolección y entrega
      const serviciosRequeridos = [];
      if (tipoRecoleccion === 'domicilio') {
        serviciosRequeridos.push('retiro_domicilio');
      } else {
        serviciosRequeridos.push('entrega_agencia_origen');
      }
      
      if (tipoEntrega === 'domicilio') {
        serviciosRequeridos.push('entrega_domicilio');
      } else {
        serviciosRequeridos.push('retiro_agencia_destino');
      }

      // Obtener precios de servicios para el peso específico
      for (const servicio of serviciosRequeridos) {
        const { data: servicioData, error: servicioError } = await supabase
          .from('servicios_transportistas')
          .select('precio_adicional, multiplicador')
          .eq('tipo_servicio', servicio)
          .lte('peso_minimo', pesoKg)
          .gte('peso_maximo', pesoKg)
          .eq('activo', true)
          .limit(1)
          .single();

        if (servicioData && !servicioError) {
          serviciosTransportista += servicioData.precio_adicional * servicioData.multiplicador;
        } else {
          // Precios por defecto si no hay configuración específica
          const preciosDefecto = {
            'retiro_domicilio': pesoKg <= 5 ? 500 : Math.ceil(pesoKg / 5) * 250,
            'entrega_domicilio': pesoKg <= 5 ? 600 : Math.ceil(pesoKg / 5) * 300,
            'entrega_agencia_origen': pesoKg <= 5 ? 200 : Math.ceil(pesoKg / 5) * 100,
            'retiro_agencia_destino': pesoKg <= 5 ? 250 : Math.ceil(pesoKg / 5) * 125,
          };
          serviciosTransportista += preciosDefecto[servicio] || 0;
        }
      }

      // Cálculos de la cotización
      const seguro = valorDeclarado * 0.1; // 10% del valor declarado
      const cargosAdministrativos = flete * 0.15; // 15% del flete
      const costoTermosellado = termosellado ? Math.min(flete * 0.25, flete * 0.25) : 0; // máximo 25% del flete
      
      const subtotal = flete + seguro + cargosAdministrativos + costoTermosellado + serviciosTransportista;
      const iva = subtotal * 0.21; // 21% del subtotal
      const total = subtotal + iva;

      setCotizacion({
        flete,
        seguro,
        cargosAdministrativos,
        termosellado: costoTermosellado,
        serviciosTransportista,
        subtotal,
        iva,
        total
      });

    } catch (error) {
      console.error('Error calculando cotización:', error);
      toast.error('Error al calcular la cotización');
    } finally {
      setCalculandoCotizacion(false);
    }
  };

  const handleGenerarOrden = () => {
    const formData = form.getValues();
    
    // Navegar a crear orden con los datos del cotizador
    const queryParams = new URLSearchParams({
      ...formData,
      cotaPeso: formData.cotaPeso,
      valorDeclarado: formData.valorDeclarado.toString(),
      termosellado: formData.termosellado.toString(),
      cotizacionTotal: cotizacion?.total.toString() || '0'
    });

    navigate(`/crear-orden?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-8 w-8" />
            Cotizador de Envíos
          </h1>
          <p className="text-muted-foreground">Complete los datos para obtener una cotización detallada</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="xl:col-span-2">
            <Form {...form}>
              <form className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Remitente */}
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
                                            ? "No hay agencias disponibles"
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
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>

                  {/* Destinatario */}
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
                                  <Label htmlFor="entrega-agencia">Retiro en agencia</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                                            ? "No hay agencias disponibles"
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
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Detalles del Paquete */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Detalles del Paquete
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="cotaPeso"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cota de Peso</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar rango de peso" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0-5">0 - 5 kg</SelectItem>
                                <SelectItem value="5-10">5 - 10 kg</SelectItem>
                                <SelectItem value="10-15">10 - 15 kg</SelectItem>
                                <SelectItem value="15-20">15 - 20 kg</SelectItem>
                                <SelectItem value="20-25">20 - 25 kg</SelectItem>
                                <SelectItem value="25+">Más de 25 kg</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="valorDeclarado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor Declarado ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                min="1" 
                                {...field} 
                                placeholder="Ej: 15000"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="termosellado"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Termosellado</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Protección adicional (hasta 25% del flete)
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="descripcionPaquete"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción del Contenido</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ej: Documentos, ropa, electrónicos, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>

          {/* Cotización */}
          <div className="xl:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cotización
                </CardTitle>
              </CardHeader>
              <CardContent>
                {calculandoCotizacion ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : cotizacion ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Flete:</span>
                        <span className="text-sm font-medium">${cotizacion.flete.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Servicios Transportista:</span>
                        <span className="text-sm font-medium">${cotizacion.serviciosTransportista.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Seguro (10%):</span>
                        <span className="text-sm font-medium">${cotizacion.seguro.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cargos Admin. (15%):</span>
                        <span className="text-sm font-medium">${cotizacion.cargosAdministrativos.toFixed(2)}</span>
                      </div>
                      {termosellado && cotizacion.termosellado > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm">Termosellado:</span>
                          <span className="text-sm font-medium">${cotizacion.termosellado.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-medium">${cotizacion.subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">IVA (21%):</span>
                      <span className="text-sm font-medium">${cotizacion.iva.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">${cotizacion.total.toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      onClick={handleGenerarOrden}
                      className="w-full mt-4"
                      size="lg"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generar Orden de Envío
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Complete los datos para ver la cotización</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cotizador;