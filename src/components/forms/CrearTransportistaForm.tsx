import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin, Route } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const transportistaSchema = z.object({
  nombre: z.string().min(1, "Nombre es requerido"),
  apellido: z.string().min(1, "Apellido es requerido"),
  nombre_empresa: z.string().min(1, "Nombre de empresa es requerido"),
  documento: z.string().min(1, "Documento es requerido"),
  email: z.string().email("Email inválido").optional(),
  telefono: z.string().optional(),
  tipo_transportista: z.enum(["local", "larga_distancia"]),
  licencia_conducir: z.string().optional(),
  fecha_vencimiento_licencia: z.string().optional(),
  zonas_cobertura: z.array(z.object({
    provincia: z.string().min(1, "Provincia es requerida"),
    localidad: z.string().optional(),
  })).optional(),
  rutas: z.array(z.object({
    nombre_ruta: z.string().min(1, "Nombre de ruta es requerido"),
    provincia_origen: z.string().min(1, "Provincia origen es requerida"),
    localidad_origen: z.string().optional(),
    provincia_destino: z.string().min(1, "Provincia destino es requerida"),
    localidad_destino: z.string().optional(),
    tiempo_estimado_horas: z.number().min(1).optional(),
    distancia_km: z.number().min(0).optional(),
    paradas: z.array(z.object({
      orden_parada: z.number(),
      provincia: z.string().min(1, "Provincia es requerida"),
      localidad: z.string().optional(),
      tipo_parada: z.enum(["pasada", "trasbordo"]),
      es_cabecera: z.boolean().optional(),
      tiempo_estimado_minutos: z.number().optional(),
      observaciones: z.string().optional(),
    })).optional(),
  })).optional(),
});

type TransportistaFormData = z.infer<typeof transportistaSchema>;

const provinciasArgentinas = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza",
  "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis",
  "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego",
  "Tucumán", "Ciudad Autónoma de Buenos Aires"
];

export function CrearTransportistaForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TransportistaFormData>({
    resolver: zodResolver(transportistaSchema),
    defaultValues: {
      tipo_transportista: "local",
      zonas_cobertura: [{ provincia: "", localidad: "" }],
      rutas: [{ 
        nombre_ruta: "", 
        provincia_origen: "", 
        localidad_origen: "",
        provincia_destino: "", 
        localidad_destino: "",
        tiempo_estimado_horas: 24,
        distancia_km: 0,
        paradas: []
      }],
    },
  });

  const { fields: zonasFields, append: appendZona, remove: removeZona } = useFieldArray({
    control: form.control,
    name: "zonas_cobertura",
  });

  const { fields: rutasFields, append: appendRuta, remove: removeRuta } = useFieldArray({
    control: form.control,
    name: "rutas",
  });

  const tipoTransportista = form.watch("tipo_transportista");

  const onSubmit = async (data: TransportistaFormData) => {
    console.log("Form submission started", data);
    console.log("Form errors:", form.formState.errors);
    setIsSubmitting(true);
    try {
      // Crear el transportista
      const { data: transportista, error: transportistaError } = await supabase
        .from("transportistas")
        .insert({
          nombre: data.nombre,
          apellido: data.apellido,
          nombre_empresa: data.nombre_empresa,
          documento: data.documento,
          email: data.email || null,
          telefono: data.telefono || null,
          tipo_transportista: data.tipo_transportista,
          licencia_conducir: data.licencia_conducir || null,
          fecha_vencimiento_licencia: data.fecha_vencimiento_licencia || null,
        })
        .select()
        .single();

      if (transportistaError) throw transportistaError;

      // Insertar zonas de cobertura para transportistas locales
      if (data.tipo_transportista === "local" && data.zonas_cobertura) {
        const zonasData = data.zonas_cobertura
          .filter(zona => zona.provincia)
          .map(zona => ({
            transportista_id: transportista.id,
            provincia: zona.provincia,
            localidad: zona.localidad || null,
          }));

        if (zonasData.length > 0) {
          const { error: zonasError } = await supabase
            .from("transportistas_zonas_cobertura")
            .insert(zonasData);

          if (zonasError) throw zonasError;
        }
      }

      // Insertar rutas para transportistas de larga distancia
      if (data.tipo_transportista === "larga_distancia" && data.rutas) {
        const rutasData = data.rutas
          .filter(ruta => ruta.nombre_ruta && ruta.provincia_origen && ruta.provincia_destino)
          .map(ruta => ({
            transportista_id: transportista.id,
            nombre_ruta: ruta.nombre_ruta,
            provincia_origen: ruta.provincia_origen,
            localidad_origen: ruta.localidad_origen || null,
            provincia_destino: ruta.provincia_destino,
            localidad_destino: ruta.localidad_destino || null,
            tiempo_estimado_horas: ruta.tiempo_estimado_horas || 24,
            distancia_km: ruta.distancia_km || 0
          }));

        if (rutasData.length > 0) {
          const { data: rutasInsertadas, error: rutasError } = await supabase
            .from("transportistas_rutas")
            .insert(rutasData)
            .select("id");

          if (rutasError) throw rutasError;

          // Insertar paradas para cada ruta
          for (let i = 0; i < rutasInsertadas.length; i++) {
            const rutaId = rutasInsertadas[i].id;
            const rutaOriginal = data.rutas[i];
            
            if (rutaOriginal.paradas && rutaOriginal.paradas.length > 0) {
              const paradasData = rutaOriginal.paradas.map((parada, index) => ({
                ruta_id: rutaId,
                orden_parada: index + 1,
                provincia: parada.provincia,
                localidad: parada.localidad || null,
                tipo_parada: parada.tipo_parada,
                es_cabecera: parada.es_cabecera || false,
                tiempo_estimado_minutos: parada.tiempo_estimado_minutos || 30,
                observaciones: parada.observaciones || null
              }));

              const { error: paradasError } = await supabase
                .from("rutas_paradas")
                .insert(paradasData);

              if (paradasError) throw paradasError;
            }
          }
        }
      }

      toast.success("Transportista creado exitosamente");
      form.reset();
    } catch (error) {
      toast.error("Error al crear transportista");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {tipoTransportista === "local" ? <MapPin className="h-5 w-5" /> : <Route className="h-5 w-5" />}
            Crear Transportista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nombre_empresa">Nombre de la Empresa *</Label>
                <Input
                  id="nombre_empresa"
                  {...form.register("nombre_empresa")}
                  placeholder="Nombre de la empresa transportista"
                />
                {form.formState.errors.nombre_empresa && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.nombre_empresa.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  {...form.register("nombre")}
                  placeholder="Nombre del transportista"
                />
                {form.formState.errors.nombre && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  {...form.register("apellido")}
                  placeholder="Apellido del transportista"
                />
                {form.formState.errors.apellido && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.apellido.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="documento">Documento *</Label>
                <Input
                  id="documento"
                  {...form.register("documento")}
                  placeholder="DNI o documento de identidad"
                />
                {form.formState.errors.documento && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.documento.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="correo@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  {...form.register("telefono")}
                  placeholder="Número de teléfono"
                />
              </div>

              <div>
                <Label htmlFor="tipo_transportista">Tipo de Transportista *</Label>
                <Select
                  value={tipoTransportista}
                  onValueChange={(value) => form.setValue("tipo_transportista", value as "local" | "larga_distancia")}
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

              <div>
                <Label htmlFor="licencia_conducir">Licencia de Conducir</Label>
                <Input
                  id="licencia_conducir"
                  {...form.register("licencia_conducir")}
                  placeholder="Número de licencia"
                />
              </div>

              <div>
                <Label htmlFor="fecha_vencimiento_licencia">Vencimiento Licencia</Label>
                <Input
                  id="fecha_vencimiento_licencia"
                  type="date"
                  {...form.register("fecha_vencimiento_licencia")}
                />
              </div>
            </div>

            {/* Zonas de cobertura para transportistas locales */}
            {tipoTransportista === "local" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Zonas de Cobertura
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {zonasFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border p-4 rounded-lg">
                      <div>
                        <Label>Provincia *</Label>
                        <Select
                          value={form.watch(`zonas_cobertura.${index}.provincia`)}
                          onValueChange={(value) => form.setValue(`zonas_cobertura.${index}.provincia`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar provincia" />
                          </SelectTrigger>
                          <SelectContent>
                            {provinciasArgentinas.map((provincia) => (
                              <SelectItem key={provincia} value={provincia}>
                                {provincia}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Localidad</Label>
                        <Input
                          {...form.register(`zonas_cobertura.${index}.localidad`)}
                          placeholder="Localidad (opcional)"
                        />
                      </div>

                      <div className="flex justify-end">
                        {zonasFields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeZona(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendZona({ provincia: "", localidad: "" })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Zona de Cobertura
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Rutas para transportistas de larga distancia */}
            {tipoTransportista === "larga_distancia" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    Rutas de Larga Distancia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rutasFields.map((field, index) => (
                    <div key={field.id} className="border p-4 rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">Ruta {index + 1}</Badge>
                        {rutasFields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeRuta(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label>Nombre de la Ruta *</Label>
                          <Input
                            {...form.register(`rutas.${index}.nombre_ruta`)}
                            placeholder="Ej: Buenos Aires - Córdoba"
                          />
                        </div>

                        <div>
                          <Label>Provincia Origen *</Label>
                          <Select
                            value={form.watch(`rutas.${index}.provincia_origen`)}
                            onValueChange={(value) => form.setValue(`rutas.${index}.provincia_origen`, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar provincia" />
                            </SelectTrigger>
                            <SelectContent>
                              {provinciasArgentinas.map((provincia) => (
                                <SelectItem key={provincia} value={provincia}>
                                  {provincia}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Localidad Cabecera Origen</Label>
                          <Input
                            {...form.register(`rutas.${index}.localidad_origen`)}
                            placeholder="Localidad cabecera del servicio"
                          />
                        </div>

                        <div>
                          <Label>Provincia Destino *</Label>
                          <Select
                            value={form.watch(`rutas.${index}.provincia_destino`)}
                            onValueChange={(value) => form.setValue(`rutas.${index}.provincia_destino`, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar provincia" />
                            </SelectTrigger>
                            <SelectContent>
                              {provinciasArgentinas.map((provincia) => (
                                <SelectItem key={provincia} value={provincia}>
                                  {provincia}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Localidad Cabecera Destino</Label>
                          <Input
                            {...form.register(`rutas.${index}.localidad_destino`)}
                            placeholder="Localidad cabecera del servicio"
                          />
                        </div>

                        <div>
                          <Label>Tiempo Estimado (horas)</Label>
                          <Input
                            type="number"
                            {...form.register(`rutas.${index}.tiempo_estimado_horas`, { valueAsNumber: true })}
                            placeholder="24"
                          />
                        </div>

                        <div>
                          <Label>Distancia (km)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...form.register(`rutas.${index}.distancia_km`, { valueAsNumber: true })}
                            placeholder="500"
                          />
                        </div>
                      </div>

                      {/* Paradas intermedias */}
                      <div className="mt-6 border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <Label className="text-base font-semibold">Paradas en la Ruta</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentParadas = form.watch(`rutas.${index}.paradas`) || [];
                              form.setValue(`rutas.${index}.paradas`, [
                                ...currentParadas,
                                {
                                  orden_parada: currentParadas.length + 1,
                                  provincia: "",
                                  localidad: "",
                                  tipo_parada: "pasada",
                                  es_cabecera: false,
                                  tiempo_estimado_minutos: 30,
                                  observaciones: ""
                                }
                              ]);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Parada
                          </Button>
                        </div>

                        {(form.watch(`rutas.${index}.paradas`) || []).map((parada, paradaIndex) => (
                          <div key={paradaIndex} className="border rounded-lg p-3 mb-3 bg-muted/50">
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="secondary">Parada {paradaIndex + 1}</Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const currentParadas = form.watch(`rutas.${index}.paradas`) || [];
                                  const newParadas = currentParadas.filter((_, i) => i !== paradaIndex);
                                  form.setValue(`rutas.${index}.paradas`, newParadas);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              <div>
                                <Label className="text-sm">Provincia *</Label>
                                <Select
                                  value={form.watch(`rutas.${index}.paradas.${paradaIndex}.provincia`)}
                                  onValueChange={(value) => form.setValue(`rutas.${index}.paradas.${paradaIndex}.provincia`, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Provincia" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {provinciasArgentinas.map((provincia) => (
                                      <SelectItem key={provincia} value={provincia}>
                                        {provincia}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-sm">Localidad</Label>
                                <Input
                                  {...form.register(`rutas.${index}.paradas.${paradaIndex}.localidad`)}
                                  placeholder="Localidad"
                                  className="text-sm"
                                />
                              </div>

                              <div>
                                <Label className="text-sm">Tipo de Parada *</Label>
                                <Select
                                  value={form.watch(`rutas.${index}.paradas.${paradaIndex}.tipo_parada`)}
                                  onValueChange={(value) => form.setValue(`rutas.${index}.paradas.${paradaIndex}.tipo_parada`, value as "pasada" | "trasbordo")}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pasada">De Pasada</SelectItem>
                                    <SelectItem value="trasbordo">Trasbordo de Encomiendas</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-sm">Tiempo (minutos)</Label>
                                <Input
                                  type="number"
                                  {...form.register(`rutas.${index}.paradas.${paradaIndex}.tiempo_estimado_minutos`, { valueAsNumber: true })}
                                  placeholder="30"
                                  className="text-sm"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <Label className="text-sm">Observaciones</Label>
                                <Input
                                  {...form.register(`rutas.${index}.paradas.${paradaIndex}.observaciones`)}
                                  placeholder="Observaciones adicionales"
                                  className="text-sm"
                                />
                              </div>

                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  {...form.register(`rutas.${index}.paradas.${paradaIndex}.es_cabecera`)}
                                  className="rounded"
                                />
                                <Label className="text-sm">Es cabecera</Label>
                              </div>
                            </div>
                          </div>
                        ))}

                        {(!form.watch(`rutas.${index}.paradas`) || form.watch(`rutas.${index}.paradas`).length === 0) && (
                          <div className="text-center py-6 text-muted-foreground">
                            <p className="text-sm">No hay paradas agregadas</p>
                            <p className="text-xs">Agrega paradas intermedias para definir el recorrido completo</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendRuta({ 
                      nombre_ruta: "", 
                      provincia_origen: "", 
                      localidad_origen: "",
                      provincia_destino: "", 
                      localidad_destino: "",
                      tiempo_estimado_horas: 24,
                      distancia_km: 0,
                      paradas: []
                    })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Ruta
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                onClick={() => {
                  console.log("Submit button clicked");
                  console.log("Form valid:", form.formState.isValid);
                  console.log("Form errors:", form.formState.errors);
                }}
              >
                {isSubmitting ? "Creando..." : "Crear Transportista"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}