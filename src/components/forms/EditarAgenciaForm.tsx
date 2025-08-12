import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, MapPin, Phone, Mail, User, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').min(3, 'El nombre debe tener al menos 3 caracteres'),
  direccion: z.string().min(1, 'La dirección es requerida'),
  provincia_id: z.string().min(1, 'La provincia es requerida'),
  localidad_id: z.string().optional(),
  nueva_localidad: z.string().optional(),
  codigo_postal: z.string().optional(),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido'),
  contacto_nombre: z.string().min(1, 'El nombre del contacto es requerido'),
  contacto_cargo: z.string().optional(),
  horario_apertura: z.string().min(1, 'El horario de apertura es requerido'),
  horario_cierre: z.string().min(1, 'El horario de cierre es requerido'),
  tipo_parada: z.boolean().default(false),
  activo: z.boolean().default(true),
}).refine((data) => data.localidad_id || data.nueva_localidad, {
  message: "Debe seleccionar una localidad existente o crear una nueva",
  path: ["localidad_id"],
});

type FormData = z.infer<typeof formSchema>;

interface EditarAgenciaFormProps {
  agencia: {
    id: string;
    nombre: string;
    direccion: string;
    localidad: string;
    provincia: string;
    contacto: any;
    tipo_parada: boolean;
    activo: boolean;
  };
  onSuccess?: () => void;
}

interface Provincia {
  id: string;
  nombre: string;
  codigo: string;
}

interface Localidad {
  id: string;
  nombre: string;
  provincia_id: string;
  codigo_postal?: string;
}

const EditarAgenciaForm: React.FC<EditarAgenciaFormProps> = ({ agencia, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [provincias, setProvincias] = React.useState<Provincia[]>([]);
  const [localidades, setLocalidades] = React.useState<Localidad[]>([]);
  const [mostrarNuevaLocalidad, setMostrarNuevaLocalidad] = React.useState(false);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = React.useState<string>('');

  const contacto = agencia.contacto || {};

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: agencia.nombre,
      direccion: agencia.direccion,
      telefono: contacto.telefono || '',
      email: contacto.email || '',
      contacto_nombre: contacto.nombre || '',
      contacto_cargo: contacto.cargo || '',
      horario_apertura: contacto.horarios?.apertura || '',
      horario_cierre: contacto.horarios?.cierre || '',
      tipo_parada: agencia.tipo_parada,
      activo: agencia.activo,
    }
  });

  const watchedValues = watch();

  // Cargar provincias al montar el componente
  React.useEffect(() => {
    const cargarProvincias = async () => {
      const { data, error } = await supabase
        .from('provincias')
        .select('*')
        .order('nombre');
      
      if (error) {
        console.error('Error al cargar provincias:', error);
        return;
      }
      
      setProvincias(data || []);
      
      // Buscar la provincia actual
      const provinciaActual = data?.find(p => p.nombre === agencia.provincia);
      if (provinciaActual) {
        setProvinciaSeleccionada(provinciaActual.id);
        setValue('provincia_id', provinciaActual.id);
      }
    };

    cargarProvincias();
  }, [agencia.provincia, setValue]);

  // Cargar localidades cuando se selecciona una provincia
  React.useEffect(() => {
    if (provinciaSeleccionada) {
      const cargarLocalidades = async () => {
        const { data, error } = await supabase
          .from('localidades')
          .select('*')
          .eq('provincia_id', provinciaSeleccionada)
          .order('nombre');
        
        if (error) {
          console.error('Error al cargar localidades:', error);
          return;
        }
        
        setLocalidades(data || []);
        
        // Buscar la localidad actual
        const localidadActual = data?.find(l => l.nombre === agencia.localidad);
        if (localidadActual) {
          setValue('localidad_id', localidadActual.id);
        }
      };

      cargarLocalidades();
    }
  }, [provinciaSeleccionada, agencia.localidad, setValue]);

  const handleProvinciaChange = (provinciaId: string) => {
    setProvinciaSeleccionada(provinciaId);
    setValue('provincia_id', provinciaId);
    setValue('localidad_id', '');
    setValue('nueva_localidad', '');
    setMostrarNuevaLocalidad(false);
  };

  const handleLocalidadChange = (localidadId: string) => {
    setValue('localidad_id', localidadId);
    setValue('nueva_localidad', '');
    setMostrarNuevaLocalidad(false);
  };

  const crearNuevaLocalidad = async (nombreLocalidad: string, codigoPostal?: string) => {
    if (!provinciaSeleccionada || !nombreLocalidad.trim()) return null;

    try {
      const { data, error } = await supabase
        .from('localidades')
        .insert({
          nombre: nombreLocalidad.trim(),
          provincia_id: provinciaSeleccionada,
          codigo_postal: codigoPostal || null
        })
        .select()
        .single();

      if (error) throw error;
      
      // Actualizar la lista de localidades
      setLocalidades(prev => [...prev, data]);
      
      return data.id;
    } catch (error) {
      console.error('Error al crear localidad:', error);
      throw error;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      let localidadId = data.localidad_id;
      
      // Si se va a crear una nueva localidad
      if (data.nueva_localidad && !data.localidad_id) {
        localidadId = await crearNuevaLocalidad(data.nueva_localidad, data.codigo_postal);
        if (!localidadId) {
          throw new Error('Error al crear la localidad');
        }
      }

      // Obtener datos de la provincia y localidad para guardar en la agencia
      const { data: provinciaData } = await supabase
        .from('provincias')
        .select('nombre')
        .eq('id', data.provincia_id)
        .single();

      const { data: localidadData } = await supabase
        .from('localidades')
        .select('nombre')
        .eq('id', localidadId)
        .single();

      // Preparar el objeto de contacto en formato JSON
      const contactoData = {
        telefono: data.telefono,
        email: data.email,
        nombre: data.contacto_nombre,
        cargo: data.contacto_cargo || '',
        horarios: {
          apertura: data.horario_apertura,
          cierre: data.horario_cierre
        }
      };

      const { error } = await supabase
        .from('agencias')
        .update({
          nombre: data.nombre,
          direccion: data.direccion,
          localidad: localidadData?.nombre || '',
          provincia: provinciaData?.nombre || '',
          contacto: contactoData,
          tipo_parada: data.tipo_parada,
          activo: data.activo
        })
        .eq('id', agencia.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Agencia actualizada exitosamente",
        description: `La agencia "${data.nombre}" ha sido actualizada.`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error al actualizar agencia:', error);
      toast({
        title: "Error al actualizar agencia",
        description: "Hubo un problema al actualizar la agencia. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Editar Agencia
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información General
            </CardTitle>
            <CardDescription>
              Datos básicos de la agencia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Agencia *</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Agencia Central CABA"
                  {...register('nombre')}
                />
                {errors.nombre && (
                  <p className="text-sm text-destructive">{errors.nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="provincia">Provincia *</Label>
                <Select 
                  value={provinciaSeleccionada} 
                  onValueChange={handleProvinciaChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar provincia" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-60 overflow-y-auto z-50">
                    {provincias.map((provincia) => (
                      <SelectItem key={provincia.id} value={provincia.id}>
                        {provincia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.provincia_id && (
                  <p className="text-sm text-destructive">{errors.provincia_id.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="localidad">Localidad *</Label>
                {provinciaSeleccionada ? (
                  <div className="space-y-2">
                    <Select 
                      value={watchedValues.localidad_id} 
                      onValueChange={handleLocalidadChange} 
                      disabled={!provinciaSeleccionada}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar localidad" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg max-h-60 overflow-y-auto z-50">
                        {localidades.map((localidad) => (
                          <SelectItem key={localidad.id} value={localidad.id}>
                            {localidad.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setMostrarNuevaLocalidad(!mostrarNuevaLocalidad)}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {mostrarNuevaLocalidad ? 'Cancelar' : 'Agregar Nueva Localidad'}
                    </Button>
                  </div>
                ) : (
                  <Input
                    disabled
                    placeholder="Primero selecciona una provincia"
                    className="bg-muted"
                  />
                )}
                {errors.localidad_id && (
                  <p className="text-sm text-destructive">{errors.localidad_id.message}</p>
                )}
              </div>

              {mostrarNuevaLocalidad && (
                <div className="space-y-2">
                  <Label htmlFor="nueva_localidad">Nueva Localidad</Label>
                  <Input
                    id="nueva_localidad"
                    placeholder="Nombre de la nueva localidad"
                    {...register('nueva_localidad')}
                  />
                  <Input
                    id="codigo_postal"
                    placeholder="Código postal (opcional)"
                    {...register('codigo_postal')}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección Completa *</Label>
              <Textarea
                id="direccion"
                placeholder="Ej: Av. Corrientes 1234, Piso 2, Oficina B"
                {...register('direccion')}
                rows={2}
              />
              {errors.direccion && (
                <p className="text-sm text-destructive">{errors.direccion.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
            <CardDescription>
              Datos de contacto y responsable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefono"
                    placeholder="+54 11 1234-5678"
                    className="pl-8"
                    {...register('telefono')}
                  />
                </div>
                {errors.telefono && (
                  <p className="text-sm text-destructive">{errors.telefono.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="agencia@puntoenvio.com.ar"
                    className="pl-8"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contacto_nombre">Nombre del Responsable *</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contacto_nombre"
                    placeholder="Ej: Laura Martínez"
                    className="pl-8"
                    {...register('contacto_nombre')}
                  />
                </div>
                {errors.contacto_nombre && (
                  <p className="text-sm text-destructive">{errors.contacto_nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contacto_cargo">Cargo</Label>
                <Input
                  id="contacto_cargo"
                  placeholder="Ej: Gerente de Agencia"
                  {...register('contacto_cargo')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horarios de Funcionamiento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Horarios de Funcionamiento
            </CardTitle>
            <CardDescription>
              Horarios de atención al público
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horario_apertura">Horario de Apertura *</Label>
                <Input
                  id="horario_apertura"
                  type="time"
                  {...register('horario_apertura')}
                />
                {errors.horario_apertura && (
                  <p className="text-sm text-destructive">{errors.horario_apertura.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="horario_cierre">Horario de Cierre *</Label>
                <Input
                  id="horario_cierre"
                  type="time"
                  {...register('horario_cierre')}
                />
                {errors.horario_cierre && (
                  <p className="text-sm text-destructive">{errors.horario_cierre.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuración</CardTitle>
            <CardDescription>
              Opciones adicionales de la agencia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tipo de Parada</Label>
                <p className="text-sm text-muted-foreground">
                  Activar si esta agencia funciona como punto de parada
                </p>
              </div>
              <Switch
                checked={watchedValues.tipo_parada}
                onCheckedChange={(checked) => setValue('tipo_parada', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Agencia Activa</Label>
                <p className="text-sm text-muted-foreground">
                  La agencia estará disponible para operaciones
                </p>
              </div>
              <Switch
                checked={watchedValues.activo}
                onCheckedChange={(checked) => setValue('activo', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Actualizando...' : 'Actualizar Agencia'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarAgenciaForm;