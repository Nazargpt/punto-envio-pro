import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TransportistaBasic {
  id: string;
  nombre: string;
  apellido: string;
  tipo_transportista: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

interface TransportistaFull {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  telefono: string;
  licencia_conducir: string;
  fecha_vencimiento_licencia: string;
  tipo_transportista: string;
  nombre_empresa: string;
  calificacion: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export const useTransportistasSecure = () => {
  const [transportistas, setTransportistas] = useState<TransportistaBasic[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();

  // Function to get basic transportista info (non-sensitive)
  const getTransportistasBasic = async () => {
    try {
      const { data, error } = await supabase.rpc('get_transportistas_basic');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching basic transportistas:', error);
      toast({
        title: "Error",
        description: "Error al cargar transportistas",
        variant: "destructive"
      });
      return [];
    }
  };

  // Function to get full transportista data (sensitive - admin only)
  const getTransportistaFull = async (id: string): Promise<TransportistaFull | null> => {
    if (!isAdmin() && !isSuperAdmin()) {
      toast({
        title: "Acceso denegado",
        description: "No tiene permisos para ver datos completos de transportistas",
        variant: "destructive"
      });
      return null;
    }

    try {
      // Log the access attempt
      await supabase.rpc('log_transportista_access', {
        p_transportista_id: id,
        p_access_type: 'view_full_details',
        p_accessed_fields: [
          'documento', 
          'email', 
          'telefono', 
          'licencia_conducir',
          'fecha_vencimiento_licencia'
        ]
      });

      const { data, error } = await supabase
        .from('transportistas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      toast({
        title: "Acceso registrado",
        description: "El acceso a datos sensibles fue registrado en auditoría",
        variant: "default"
      });

      return data;
    } catch (error) {
      console.error('Error fetching full transportista:', error);
      toast({
        title: "Error",
        description: "Error al cargar datos del transportista",
        variant: "destructive"
      });
      return null;
    }
  };

  // Function to get transportistas for services (minimal data)
  const getTransportistasForServices = async () => {
    try {
      const { data, error } = await supabase.rpc('get_transportistas_for_services');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transportistas for services:', error);
      toast({
        title: "Error",
        description: "Error al cargar transportistas para servicios",
        variant: "destructive"
      });
      return [];
    }
  };

  const loadTransportistasBasic = async () => {
    setLoading(true);
    const data = await getTransportistasBasic();
    setTransportistas(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTransportistasBasic();
  }, []);

  return {
    transportistas,
    loading,
    getTransportistasBasic,
    getTransportistaFull,
    getTransportistasForServices,
    refreshTransportistas: loadTransportistasBasic
  };
};