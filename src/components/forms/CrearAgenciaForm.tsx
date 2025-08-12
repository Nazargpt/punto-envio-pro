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
import { Building2, MapPin, Phone, Mail, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').min(3, 'El nombre debe tener al menos 3 caracteres'),
  direccion: z.string().min(1, 'La dirección es requerida'),
  localidad: z.string().min(1, 'La localidad es requerida'),
  provincia: z.string().min(1, 'La provincia es requerida'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido'),
  contacto_nombre: z.string().min(1, 'El nombre del contacto es requerido'),
  contacto_cargo: z.string().optional(),
  horario_apertura: z.string().min(1, 'El horario de apertura es requerido'),
  horario_cierre: z.string().min(1, 'El horario de cierre es requerido'),
  tipo_parada: z.boolean().default(false),
  activo: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface CrearAgenciaFormProps {
  onSuccess?: () => void;
}

const provinciasArgentinas = [
  'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza',
  'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
  'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego',
  'Tucumán', 'Ciudad Autónoma de Buenos Aires'
];

const CrearAgenciaForm: React.FC<CrearAgenciaFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
      tipo_parada: false,
      activo: true
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
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

      const { data: result, error } = await supabase
        .from('agencias')
        .insert({
          nombre: data.nombre,
          direccion: data.direccion,
          localidad: data.localidad,
          provincia: data.provincia,
          contacto: contactoData,
          tipo_parada: data.tipo_parada,
          activo: data.activo
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Agencia creada exitosamente",
        description: `La agencia "${data.nombre}" ha sido registrada en el sistema.`,
      });

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error al crear agencia:', error);
      toast({
        title: "Error al crear agencia",
        description: "Hubo un problema al registrar la agencia. Por favor, intenta nuevamente.",
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
          Nueva Agencia
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
                <Select onValueChange={(value) => setValue('provincia', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar provincia" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg max-h-60 overflow-y-auto z-50">
                    {provinciasArgentinas.map((provincia) => (
                      <SelectItem key={provincia} value={provincia}>
                        {provincia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.provincia && (
                  <p className="text-sm text-destructive">{errors.provincia.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="localidad">Localidad *</Label>
              <Input
                id="localidad"
                placeholder="Ej: Buenos Aires"
                {...register('localidad')}
              />
              {errors.localidad && (
                <p className="text-sm text-destructive">{errors.localidad.message}</p>
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
            Limpiar Formulario
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear Agencia'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CrearAgenciaForm;