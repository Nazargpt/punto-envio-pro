import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Search, Edit, Trash2, Shield, Eye, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import UserManagementDialog from '@/components/users/UserManagementDialog';

interface User {
  id: string;
  email: string;
  nombre: string;
  activo: boolean;
  agencia_id?: string;
  role?: string;
  created_at: string;
}

const AdminUsuarios: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Force refresh when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchUsers = async () => {
    console.log('Fetching users...');
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          email,
          nombre,
          activo,
          agencia_id,
          created_at,
          user_roles (
            role
          )
        `);

      console.log('Profiles data:', profiles);
      console.log('Profiles error:', error);

      if (error) throw error;
      
      setUsers(profiles?.map(profile => ({
        id: profile.user_id,
        email: profile.email || '',
        nombre: profile.nombre || '',
        activo: profile.activo || false,
        agencia_id: profile.agencia_id,
        role: (profile.user_roles as any)?.[0]?.role || 'USER',
        created_at: profile.created_at
      })) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ activo: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;

      await fetchUsers();
      toast({
        title: "Usuario actualizado",
        description: `Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive"
      });
    }
  };

  const createInitialUsers = async () => {
    const initialUsers = [
      {
        email: 'nadiabenitez@puntoenvio.com',
        nombre: 'Nadia Benitez',
        role: 'SUPERVISOR',
        password: 'Argentina2025@'
      },
      {
        email: 'lucianaespindola@puntoenvio.com',
        nombre: 'Luciana Espindola',
        role: 'OPERADOR_AGENCIA',
        password: 'Argentina2025@'
      },
      {
        email: 'sofiadondi@puntoenvio.com',
        nombre: 'Sofia Dondi',
        role: 'OPERADOR_AGENCIA',
        password: 'Argentina2025@'
      }
    ];

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;
    let errorMessages = [];

    for (const userData of initialUsers) {
      try {
        console.log(`Creating user: ${userData.email}`);
        
        // Check if user already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', userData.email)
          .single();

        if (existingProfile) {
          console.log(`User ${userData.email} already exists, skipping...`);
          continue;
        }

        // Create new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              nombre: userData.nombre
            }
          }
        });

        if (authError) {
          console.error(`Auth error for ${userData.email}:`, authError);
          throw authError;
        }

        if (authData.user) {
          console.log(`User created in auth: ${userData.email}`);
          
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: authData.user.id,
              email: userData.email,
              nombre: userData.nombre,
              activo: true,
              agencia_id: null
            });

          if (profileError) {
            console.error(`Profile error for ${userData.email}:`, profileError);
            throw profileError;
          }

          // Create user role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role: userData.role as any,
              agencia_id: null
            });

          if (roleError) {
            console.error(`Role error for ${userData.email}:`, roleError);
            throw roleError;
          }

          console.log(`Successfully created user: ${userData.email} with role: ${userData.role}`);
          successCount++;
        }
      } catch (error: any) {
        console.error(`Error creating user ${userData.email}:`, error);
        errorMessages.push(`${userData.email}: ${error.message}`);
        errorCount++;
      }
    }

    setLoading(false);
    await fetchUsers();

    if (errorMessages.length > 0) {
      console.log('Errors encountered:', errorMessages);
    }

    toast({
      title: successCount > 0 ? "Usuarios creados" : "Error",
      description: `Se crearon ${successCount} usuarios correctamente${errorCount > 0 ? `, ${errorCount} fallaron` : ''}`,
      variant: errorCount > 0 && successCount === 0 ? "destructive" : "default"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra usuarios del sistema y sus permisos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsEditMode(false);
              setDialogOpen(true);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
          <Button
            variant="outline"
            onClick={createInitialUsers}
            disabled={loading}
          >
            <Users className="mr-2 h-4 w-4" />
            Crear Usuarios Iniciales
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">registrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.activo).length}</div>
            <p className="text-xs text-muted-foreground">habilitados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role && ['ADMIN_AGENCIA', 'SUPERADMIN', 'SUPERVISOR'].includes(u.role)).length}
            </div>
            <p className="text-xs text-muted-foreground">con permisos admin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos este mes</CardTitle>
            <UserPlus className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => {
                const createdAt = new Date(u.created_at);
                const now = new Date();
                const thisMonth = now.getMonth() === createdAt.getMonth() && now.getFullYear() === createdAt.getFullYear();
                return thisMonth;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>Busca y gestiona todos los usuarios del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="USER">Usuario</SelectItem>
                <SelectItem value="OPERADOR_AGENCIA">Operador Agencia</SelectItem>
                <SelectItem value="ADMIN_AGENCIA">Admin Agencia</SelectItem>
                <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Agencia</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Cargando usuarios...</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nombre || 'Sin nombre'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={
                        user.role === 'SUPERADMIN' ? 'destructive' :
                        user.role === 'ADMIN_AGENCIA' ? 'default' :
                        user.role === 'SUPERVISOR' ? 'default' : 'secondary'
                      }>
                        {user.role === 'SUPERADMIN' ? 'Super Admin' :
                         user.role === 'ADMIN_AGENCIA' ? 'Admin Agencia' :
                         user.role === 'SUPERVISOR' ? 'Supervisor' :
                         user.role === 'OPERADOR_AGENCIA' ? 'Operador' : 'Usuario'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.activo ? "default" : "secondary"}>
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.agencia_id || 'Sin asignar'}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditMode(true);
                            setDialogOpen(true);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant={user.activo ? "destructive" : "default"} 
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id, user.activo)}
                        >
                          {user.activo ? <Trash2 className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UserManagementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        isEdit={isEditMode}
        onUserSaved={() => {
          fetchUsers();
          setDialogOpen(false);
        }}
      />
    </div>
  );
};

export default AdminUsuarios;