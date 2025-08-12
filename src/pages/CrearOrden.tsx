import React from 'react';
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
  diaRecoleccion: z.string().min(1, 'Día de recolección es requerido'),
  horaRecoleccion: z.string().min(1, 'Hora de recolección es requerida'),
  tipoRecoleccion: z.enum(['domicilio', 'agencia']),
  
  // Destinatario
  destinatarioNombre: z.string().min(1, 'Nombre es requerido'),
  destinatarioApellido: z.string().min(1, 'Apellido es requerido'),
  destinatarioDocumento: z.string().min(1, 'Documento es requerido'),
  destinatarioDomicilio: z.string().min(1, 'Domicilio es requerido'),
  destinatarioProvincia: z.string().min(1, 'Provincia es requerida'),
  destinatarioLocalidad: z.string().min(1, 'Localidad es requerida'),
  diaEntrega: z.string().min(1, 'Día de entrega es requerido'),
  horaEntrega: z.string().min(1, 'Hora de entrega es requerida'),
  tipoEntrega: z.enum(['domicilio', 'agencia']),
});

type OrdenFormData = z.infer<typeof ordenSchema>;

const CrearOrden = () => {
  const form = useForm<OrdenFormData>({
    resolver: zodResolver(ordenSchema),
    defaultValues: {
      tipoRecoleccion: 'domicilio',
      tipoEntrega: 'domicilio',
    },
  });

  // Calcular fecha sugerida (48 horas después de recolección)
  const calcularFechaEntrega = (fechaRecoleccion: string) => {
    if (!fechaRecoleccion) return '';
    const fecha = new Date(fechaRecoleccion);
    fecha.setDate(fecha.getDate() + 2);
    return fecha.toISOString().split('T')[0];
  };

  const onSubmit = (data: OrdenFormData) => {
    console.log('Datos de la orden:', data);
    // Aquí implementarías la lógica para guardar la orden
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
                          <FormLabel>Día de Recolección</FormLabel>
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
                          <FormLabel>Hora de Recolección</FormLabel>
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
                              <Label htmlFor="recoleccion-agencia">Entrega en Agencia cercana</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          <FormLabel>Día de Entrega</FormLabel>
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
                          <FormLabel>Hora de Entrega</FormLabel>
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
                              <Label htmlFor="entrega-agencia">Entrega en Agencia destino</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                <Calendar className="mr-2 h-4 w-4" />
                Crear Orden
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CrearOrden;