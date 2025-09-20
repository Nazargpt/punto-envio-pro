import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: {
    id: string;
    email: string;
    nombre: string;
    activo: boolean;
    role?: string;
    agencia_id?: string;
  } | null;
  isEdit?: boolean;
  onUserSaved: () => void;
}

const UserManagementDialog: React.FC<UserManagementDialogProps> = ({
  open,
  onOpenChange,
  user,
  isEdit = false,
  onUserSaved
}) => {
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    password: '',
    role: 'USER',
    activo: true,
    agencia_id: 'none'
  });
  const [agencies, setAgencies] = useState<Array<{ id: string; nombre: string }>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && isEdit) {
      setFormData({
        email: user.email,
        nombre: user.nombre,
        password: '',
        role: user.role || 'USER',
        activo: user.activo,
        agencia_id: user.agencia_id || 'none'
      });
      } else {
        setFormData({
          email: '',
          nombre: '',
          password: '',
          role: 'USER',
          activo: true,
          agencia_id: 'none'
        });
      }
  }, [user, isEdit, open]);

  useEffect(() => {
    if (open) {
      fetchAgencies();
    }
  }, [open]);

  const fetchAgencies = async () => {
    // Fetch real agencies from database or use proper UUIDs
    try {
      const { data: agenciasData, error } = await supabase
        .from('agencias')
        .select('id, nombre')
        .eq('activo', true);
      
      if (error) {
        console.error('Error fetching agencies:', error);
        // Fallback to empty array if error
        setAgencies([]);
      } else {
        setAgencies(agenciasData || []);
      }
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setAgencies([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && user) {
        // Update user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            nombre: formData.nombre,
            activo: formData.activo,
            agencia_id: formData.agencia_id === 'none' ? null : formData.agencia_id
          })
          .eq('user_id', user.id);

        if (profileError) throw profileError;

        // Update user role - first delete existing then insert new
        console.log(`🔄 Actualizando rol de usuario ${user.id} a ${formData.role}`);
        
        // Delete existing roles for this user
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting existing roles:', deleteError);
          throw deleteError;
        }

        // Insert new role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: formData.role as any,
            agencia_id: formData.agencia_id === 'none' ? null : formData.agencia_id
          });

        if (roleError) throw roleError;

        // Update password if provided
        if (formData.password.trim()) {
          console.log(`🔄 Actualizando contraseña para usuario ${user.id}`);
          
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: formData.password }
          );

          if (passwordError) {
            console.error('Error updating password:', passwordError);
            // Don't throw error for password update failure, just warn
            toast({
              title: "Advertencia",
              description: "Usuario actualizado pero no se pudo cambiar la contraseña. Es posible que necesites permisos de administrador.",
              variant: "default"
            });
          } else {
            console.log(`✅ Contraseña actualizada para usuario ${user.id}`);
          }
        }

        toast({
          title: "Usuario actualizado",
          description: "Los datos del usuario se han actualizado correctamente"
        });
      } else {
        // Create new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              nombre: formData.nombre
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: authData.user.id,
              email: formData.email,
              nombre: formData.nombre,
              activo: formData.activo,
              agencia_id: formData.agencia_id === 'none' ? null : formData.agencia_id
            });

          if (profileError) throw profileError;

          // Create user role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role: formData.role as any,
              agencia_id: formData.agencia_id === 'none' ? null : formData.agencia_id
            });

          if (roleError) throw roleError;

          toast({
            title: "Usuario creado",
            description: "El usuario se ha creado correctamente"
          });
        }
      }

      onUserSaved();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error managing user:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo procesar la solicitud",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isEdit}
              required
            />
          </div>

          <div>
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">
              {isEdit ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!isEdit}
              minLength={6}
              placeholder={isEdit ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'}
            />
          </div>

          <div>
            <Label htmlFor="role">Rol</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Usuario</SelectItem>
                <SelectItem value="OPERADOR_AGENCIA">Operador de Agencia</SelectItem>
                <SelectItem value="ADMIN_AGENCIA">Administrador de Agencia</SelectItem>
                <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                <SelectItem value="SUPERADMIN">Super Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="agencia">Agencia (Opcional)</Label>
            <Select value={formData.agencia_id} onValueChange={(value) => setFormData({ ...formData, agencia_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar agencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin agencia</SelectItem>
                {agencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
            />
            <Label htmlFor="activo">Usuario activo</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;