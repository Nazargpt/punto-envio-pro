import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const transportistaSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  apellido: z.string().min(1, 'Apellido es requerido'),
  documento: z.string().min(1, 'Documento es requerido'),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  licencia_conducir: z.string().optional(),
  fecha_vencimiento_licencia: z.string().optional(),
  tipo_transportista: z.enum(['local', 'larga_distancia']),
  zonasCobertura: z.array(z.object({
    provincia: z.string().min(1, 'Provincia es requerida'),
    localidad: z.string().optional(),
  })).optional(),
  rutas: z.array(z.object({
    nombre_ruta: z.string().min(1, 'Nombre de ruta es requerido'),
    provincia_origen: z.string().min(1, 'Provincia origen es requerida'),
    localidad_origen: z.string().optional(),
    provincia_destino: z.string().min(1, 'Provincia destino es requerida'),
    localidad_destino: z.string().optional(),
    tiempo_estimado_horas: z.number().min(1, 'Tiempo estimado debe ser mayor a 0'),
    distancia_km: z.number().optional(),
  })).optional(),
});

type TransportistaFormData = z.infer<typeof transportistaSchema>;

const provincias = [
  'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza',
  'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
  'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego',
  'Tucumán'
];

export function TransportistaForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TransportistaFormData>({
    resolver: zodResolver(transportistaSchema),
    defaultValues: {
      tipo_transportista: 'local',
      zonasCobertura: [{ provincia: '', localidad: '' }],
      rutas: [{ 
        nombre_ruta: '', 
        provincia_origen: '', 
        localidad_origen: '',
        provincia_destino: '', 
        localidad_destino: '',
        tiempo_estimado_horas: 24,
        distancia_km: 0
      }],
    },
  });

  const tipoTransportista = watch('tipo_transportista');

  const {
    fields: zonasFields,
    append: appendZona,
    remove: removeZona,
  } = useFieldArray({
    control,
    name: 'zonasCobertura',
  });

  const {
    fields: rutasFields,
    append: appendRuta,
    remove: removeRuta,
  } = useFieldArray({
    control,
    name: 'rutas',
  });

  const onSubmit = async (data: TransportistaFormData) => {
    setIsSubmitting(true);
    try {
      // Create transportista
      const { data: transportista, error: transportistaError } = await supabase
        .from('transportistas')
        .insert({
          nombre: data.nombre,
          apellido: data.apellido,
          documento: data.documento,
          telefono: data.telefono,
          email: data.email,
          licencia_conducir: data.licencia_conducir,
          fecha_vencimiento_licencia: data.fecha_vencimiento_licencia,
          tipo_transportista: data.tipo_transportista,
        })
        .select()
        .single();

      if (transportistaError) throw transportistaError;

      // Insert coverage zones for local transporters
      if (data.tipo_transportista === 'local' && data.zonasCobertura) {
        const zonasToInsert = data.zonasCobertura
          .filter(zona => zona.provincia)
          .map(zona => ({
            transportista_id: transportista.id,
            provincia: zona.provincia,
            localidad: zona.localidad || null,
          }));

        if (zonasToInsert.length > 0) {
          const { error: zonasError } = await supabase
            .from('transportistas_zonas_cobertura')
            .insert(zonasToInsert);

          if (zonasError) throw zonasError;
        }
      }

      // Insert routes for long-distance transporters
      if (data.tipo_transportista === 'larga_distancia' && data.rutas) {
        const rutasToInsert = data.rutas
          .filter(ruta => ruta.nombre_ruta && ruta.provincia_origen && ruta.provincia_destino)
          .map(ruta => ({
            transportista_id: transportista.id,
            nombre_ruta: ruta.nombre_ruta,
            provincia_origen: ruta.provincia_origen,
            localidad_origen: ruta.localidad_origen || null,
            provincia_destino: ruta.provincia_destino,
            localidad_destino: ruta.localidad_destino || null,
            tiempo_estimado_horas: ruta.tiempo_estimado_horas,
            distancia_km: ruta.distancia_km || null,
          }));

        if (rutasToInsert.length > 0) {
          const { error: rutasError } = await supabase
            .from('transportistas_rutas')
            .insert(rutasToInsert);

          if (rutasError) throw rutasError;
        }
      }

      toast.success('Transportista creado exitosamente');
      reset();
    } catch (error) {
      console.error('Error creating transportista:', error);
      toast.error('Error al crear transportista');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Transportista</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...register('nombre')}
                className={errors.nombre ? 'border-destructive' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-destructive mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                {...register('apellido')}
                className={errors.apellido ? 'border-destructive' : ''}
              />
              {errors.apellido && (
                <p className="text-sm text-destructive mt-1">{errors.apellido.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="documento">Documento *</Label>
              <Input
                id="documento"
                {...register('documento')}
                className={errors.documento ? 'border-destructive' : ''}
              />
              {errors.documento && (
                <p className="text-sm text-destructive mt-1">{errors.documento.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" {...register('telefono')} />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="licencia_conducir">Licencia de Conducir</Label>
              <Input id="licencia_conducir" {...register('licencia_conducir')} />
            </div>

            <div>
              <Label htmlFor="fecha_vencimiento_licencia">Vencimiento Licencia</Label>
              <Input
                id="fecha_vencimiento_licencia"
                type="date"
                {...register('fecha_vencimiento_licencia')}
              />
            </div>

            <div>
              <Label htmlFor="tipo_transportista">Tipo de Transportista *</Label>
              <Select
                value={tipoTransportista}
                onValueChange={(value) => setValue('tipo_transportista', value as 'local' | 'larga_distancia')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="larga_distancia">Larga Distancia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Coverage Areas and Routes */}
          <Tabs value={tipoTransportista} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="local">Zonas de Cobertura</TabsTrigger>
              <TabsTrigger value="larga_distancia">Rutas</TabsTrigger>
            </TabsList>

            <TabsContent value="local" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Zonas de Cobertura</h3>
                  <Button
                    type="button"
                    onClick={() => appendZona({ provincia: '', localidad: '' })}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Zona
                  </Button>
                </div>

                {zonasFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`zonasCobertura.${index}.provincia`}>Provincia *</Label>
                        <Select
                          value={watch(`zonasCobertura.${index}.provincia`)}
                          onValueChange={(value) => setValue(`zonasCobertura.${index}.provincia`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar provincia" />
                          </SelectTrigger>
                          <SelectContent>
                            {provincias.map((provincia) => (
                              <SelectItem key={provincia} value={provincia}>
                                {provincia}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`zonasCobertura.${index}.localidad`}>Localidad</Label>
                        <Input {...register(`zonasCobertura.${index}.localidad`)} />
                      </div>
                    </div>

                    {zonasFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeZona(index)}
                        className="mt-2"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="larga_distancia" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Rutas</h3>
                  <Button
                    type="button"
                    onClick={() => appendRuta({
                      nombre_ruta: '',
                      provincia_origen: '',
                      localidad_origen: '',
                      provincia_destino: '',
                      localidad_destino: '',
                      tiempo_estimado_horas: 24,
                      distancia_km: 0
                    })}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Ruta
                  </Button>
                </div>

                {rutasFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor={`rutas.${index}.nombre_ruta`}>Nombre de Ruta *</Label>
                        <Input {...register(`rutas.${index}.nombre_ruta`)} />
                      </div>

                      <div>
                        <Label htmlFor={`rutas.${index}.provincia_origen`}>Provincia Origen *</Label>
                        <Select
                          value={watch(`rutas.${index}.provincia_origen`)}
                          onValueChange={(value) => setValue(`rutas.${index}.provincia_origen`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar provincia" />
                          </SelectTrigger>
                          <SelectContent>
                            {provincias.map((provincia) => (
                              <SelectItem key={provincia} value={provincia}>
                                {provincia}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`rutas.${index}.localidad_origen`}>Localidad Origen</Label>
                        <Input {...register(`rutas.${index}.localidad_origen`)} />
                      </div>

                      <div>
                        <Label htmlFor={`rutas.${index}.provincia_destino`}>Provincia Destino *</Label>
                        <Select
                          value={watch(`rutas.${index}.provincia_destino`)}
                          onValueChange={(value) => setValue(`rutas.${index}.provincia_destino`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar provincia" />
                          </SelectTrigger>
                          <SelectContent>
                            {provincias.map((provincia) => (
                              <SelectItem key={provincia} value={provincia}>
                                {provincia}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`rutas.${index}.localidad_destino`}>Localidad Destino</Label>
                        <Input {...register(`rutas.${index}.localidad_destino`)} />
                      </div>

                      <div>
                        <Label htmlFor={`rutas.${index}.tiempo_estimado_horas`}>Tiempo Estimado (horas)</Label>
                        <Input
                          type="number"
                          {...register(`rutas.${index}.tiempo_estimado_horas`, { valueAsNumber: true })}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`rutas.${index}.distancia_km`}>Distancia (km)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          {...register(`rutas.${index}.distancia_km`, { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    {rutasFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeRuta(index)}
                        className="mt-2"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Transportista'}
            </Button>
            <Button type="button" variant="outline" onClick={() => reset()}>
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}