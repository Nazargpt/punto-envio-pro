import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, MapPin, Route, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const transportistaSchema = z.object({
  nombre: z.string().min(1, "Nombre es requerido"),
  apellido: z.string().min(1, "Apellido es requerido"),
  nombre_empresa: z.string().min(1, "Nombre de empresa es requerido"),
  documento: z.string().min(1, "Documento es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  tipo_transportista: z.enum(["local", "larga_distancia"]),
  licencia_conducir: z.string().optional(),
  fecha_vencimiento_licencia: z.string().optional(),
  activo: z.boolean(),
  zonas_cobertura: z.array(z.object({
    id: z.string().optional(),
    provincia: z.string().min(1, "Provincia es requerida"),
    localidad: z.string().optional(),
  })).optional(),
  rutas: z.array(z.object({
    id: z.string().optional(),
    nombre_ruta: z.string().min(1, "Nombre de ruta es requerido"),
    provincia_origen: z.string().min(1, "Provincia origen es requerida"),
    localidad_origen: z.string().optional(),
    provincia_destino: z.string().min(1, "Provincia destino es requerida"),
    localidad_destino: z.string().optional(),
    tiempo_estimado_horas: z.number().min(1).optional(),
    distancia_km: z.number().min(0).optional(),
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

interface EditarTransportistaFormProps {
  transportistaId: string;
  onSuccess?: () => void;
}

export function EditarTransportistaForm({ transportistaId, onSuccess }: EditarTransportistaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<TransportistaFormData>({
    resolver: zodResolver(transportistaSchema),
    defaultValues: {
      tipo_transportista: "local",
      activo: true,
      zonas_cobertura: [],
      rutas: [],
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

  useEffect(() => {
    const cargarTransportista = async () => {
      try {
        // Cargar datos del transportista
        const { data: transportistaData, error: transportistaError } = await supabase
          .from("transportistas")
          .select("*")
          .eq("id", transportistaId)
          .single();

        if (transportistaError) throw transportistaError;

        // Cargar zonas de cobertura
        const { data: zonasData, error: zonasError } = await supabase
          .from("transportistas_zonas_cobertura")
          .select("id, provincia, localidad")
          .eq("transportista_id", transportistaId);

        if (zonasError) throw zonasError;

        // Cargar rutas
        const { data: rutasData, error: rutasError } = await supabase
          .from("transportistas_rutas")
          .select("id, nombre_ruta, provincia_origen, localidad_origen, provincia_destino, localidad_destino, tiempo_estimado_horas, distancia_km")
          .eq("transportista_id", transportistaId);

        if (rutasError) throw rutasError;

        // Llenar el formulario
        form.reset({
          nombre: transportistaData.nombre,
          apellido: transportistaData.apellido,
          nombre_empresa: transportistaData.nombre_empresa || "",
          documento: transportistaData.documento,
          email: transportistaData.email || "",
          telefono: transportistaData.telefono || "",
          tipo_transportista: transportistaData.tipo_transportista as "local" | "larga_distancia",
          licencia_conducir: transportistaData.licencia_conducir || "",
          fecha_vencimiento_licencia: transportistaData.fecha_vencimiento_licencia || "",
          activo: transportistaData.activo,
          zonas_cobertura: zonasData?.map(zona => ({
            id: zona.id,
            provincia: zona.provincia,
            localidad: zona.localidad || "",
          })) || [],
          rutas: rutasData?.map(ruta => ({
            id: ruta.id,
            nombre_ruta: ruta.nombre_ruta,
            provincia_origen: ruta.provincia_origen,
            localidad_origen: ruta.localidad_origen || "",
            provincia_destino: ruta.provincia_destino,
            localidad_destino: ruta.localidad_destino || "",
            tiempo_estimado_horas: ruta.tiempo_estimado_horas || 24,
            distancia_km: ruta.distancia_km || 0,
          })) || [],
        });
      } catch (error) {
        toast.error("Error al cargar los datos del transportista");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarTransportista();
  }, [transportistaId, form]);

  const onSubmit = async (data: TransportistaFormData) => {
    setIsSubmitting(true);
    try {
      // Actualizar transportista
      const { error: transportistaError } = await supabase
        .from("transportistas")
        .update({
          nombre: data.nombre,
          apellido: data.apellido,
          nombre_empresa: data.nombre_empresa,
          documento: data.documento,
          email: data.email || null,
          telefono: data.telefono || null,
          tipo_transportista: data.tipo_transportista,
          licencia_conducir: data.licencia_conducir || null,
          fecha_vencimiento_licencia: data.fecha_vencimiento_licencia || null,
          activo: data.activo,
        })
        .eq("id", transportistaId);

      if (transportistaError) throw transportistaError;

      // Manejar zonas de cobertura
      if (data.tipo_transportista === "local" && data.zonas_cobertura) {
        // Eliminar zonas existentes
        const { error: deleteZonasError } = await supabase
          .from("transportistas_zonas_cobertura")
          .delete()
          .eq("transportista_id", transportistaId);

        if (deleteZonasError) throw deleteZonasError;

        // Insertar nuevas zonas
        const zonasData = data.zonas_cobertura
          .filter(zona => zona.provincia)
          .map(zona => ({
            transportista_id: transportistaId,
            provincia: zona.provincia,
            localidad: zona.localidad || null,
          }));

        if (zonasData.length > 0) {
          const { error: insertZonasError } = await supabase
            .from("transportistas_zonas_cobertura")
            .insert(zonasData);

          if (insertZonasError) throw insertZonasError;
        }
      }

      // Manejar rutas
      if (data.tipo_transportista === "larga_distancia" && data.rutas) {
        // Eliminar rutas existentes
        const { error: deleteRutasError } = await supabase
          .from("transportistas_rutas")
          .delete()
          .eq("transportista_id", transportistaId);

        if (deleteRutasError) throw deleteRutasError;

        // Insertar nuevas rutas
        const rutasData = data.rutas
          .filter(ruta => ruta.nombre_ruta && ruta.provincia_origen && ruta.provincia_destino)
          .map(ruta => ({
            transportista_id: transportistaId,
            nombre_ruta: ruta.nombre_ruta,
            provincia_origen: ruta.provincia_origen,
            localidad_origen: ruta.localidad_origen || null,
            provincia_destino: ruta.provincia_destino,
            localidad_destino: ruta.localidad_destino || null,
            tiempo_estimado_horas: ruta.tiempo_estimado_horas || 24,
            distancia_km: ruta.distancia_km || null,
          }));

        if (rutasData.length > 0) {
          const { error: insertRutasError } = await supabase
            .from("transportistas_rutas")
            .insert(rutasData);

          if (insertRutasError) throw insertRutasError;
        }
      }

      toast.success("Transportista actualizado exitosamente");
      onSuccess?.();
    } catch (error) {
      toast.error("Error al actualizar transportista");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Editar Transportista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Estado activo */}
            <div className="flex items-center space-x-2">
              <Switch
                id="activo"
                checked={form.watch("activo")}
                onCheckedChange={(checked) => form.setValue("activo", checked)}
              />
              <Label htmlFor="activo">Transportista activo</Label>
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
                          <Label>Localidad Origen</Label>
                          <Input
                            {...form.register(`rutas.${index}.localidad_origen`)}
                            placeholder="Localidad (opcional)"
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
                          <Label>Localidad Destino</Label>
                          <Input
                            {...form.register(`rutas.${index}.localidad_destino`)}
                            placeholder="Localidad (opcional)"
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
                    })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Ruta
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
