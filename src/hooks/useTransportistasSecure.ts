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

  // Function to get full transportista data (sensitive - admin only) with masking
  const getTransportistaFull = async (id: string): Promise<any> => {
    if (!isAdmin() && !isSuperAdmin()) {
      toast({
        title: "Acceso denegado",
        description: "No tiene permisos para ver datos completos de transportistas",
        variant: "destructive"
      });
      return null;
    }

    try {
      // Use the secure masking function instead of direct table access
      const { data, error } = await supabase.rpc('get_transportista_with_masking', {
        transportista_id: id
      });

      if (error) throw error;
      
      toast({
        title: "Datos cargados con seguridad",
        description: `Datos mostrados con nivel: ${data[0]?.access_level}`,
        variant: "default"
      });

      return data[0];
    } catch (error) {
      console.error('Error fetching secure transportista:', error);
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