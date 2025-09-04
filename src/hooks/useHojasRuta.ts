import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface HojaRuta {
  id: string;
  transportista_id: string;
  vehiculo_id?: string;
  fecha: string;
  km_inicial?: number;
  km_final?: number;
  estado: string;
  observaciones?: string;
  codigo_seguimiento: string;
  tipo_ruta: 'local_origen' | 'larga_distancia' | 'local_destino';
  deposito_origen?: string;
  deposito_destino?: string;
  created_at: string;
  updated_at: string;
  ordenes_hoja_ruta: Array<{
    orden_envio_id: string;
    tipo_visita: string;
    completado: boolean;
    ordenes_envio: {
      numero_orden: string;
      estado: string;
      estado_detallado: string;
      remitente_nombre: string;
      destinatario_nombre: string;
      remitente_localidad: string;
      destinatario_localidad: string;
    };
  }>;
}

interface HojaRutaFoto {
  id: string;
  hoja_ruta_id: string;
  orden_envio_id: string;
  foto_url: string;
  tipo_foto: 'recogida_origen' | 'entrega_deposito_ld' | 'recogida_deposito_ld' | 'entrega_destino';
  tomada_por_user_id: string;
  ubicacion_gps?: any;
  observaciones?: string;
  created_at: string;
}

export const useHojasRuta = () => {
  const [loading, setLoading] = useState(false);
  const [hojasRuta, setHojasRuta] = useState<HojaRuta[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const generarHojasRutaAgencia = useCallback(async (agenciaId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('generar_hojas_ruta_agencia', {
        p_agencia_id: agenciaId
      });

      if (error) throw error;

      toast({
        title: "Hojas de ruta generadas",
        description: (data as any).message,
      });

      return data;
    } catch (error) {
      console.error('Error generando hojas de ruta:', error);
      toast({
        title: "Error",
        description: "No se pudieron generar las hojas de ruta",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const obtenerHojasRutaTransportista = useCallback(async (transportistaId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hojas_ruta')
        .select(`
          *,
          ordenes_hoja_ruta!inner(
            orden_envio_id,
            tipo_visita,
            completado,
            ordenes_envio(
              numero_orden,
              estado,
              estado_detallado,
              remitente_nombre,
              destinatario_nombre,
              remitente_localidad,
              destinatario_localidad
            )
          )
        `)
        .eq('transportista_id', transportistaId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedData = (data || []).map(item => ({
        ...item,
        tipo_ruta: item.tipo_ruta as 'local_origen' | 'larga_distancia' | 'local_destino',
        ordenes_hoja_ruta: item.ordenes_hoja_ruta || []
      }));
      setHojasRuta(processedData);
      return processedData;
    } catch (error) {
      console.error('Error obteniendo hojas de ruta:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las hojas de ruta",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const actualizarEstadoHojaRuta = useCallback(async (hojaRutaId: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('hojas_ruta')
        .update({ estado: nuevoEstado })
        .eq('id', hojaRutaId);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: "El estado de la hoja de ruta se actualizó correctamente",
      });

      // Refresh data
      setHojasRuta(prev => prev.map(hr => 
        hr.id === hojaRutaId ? { ...hr, estado: nuevoEstado } : hr
      ));

    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  }, [toast]);

  const subirFotoHojaRuta = useCallback(async (
    hojaRutaId: string,
    ordenEnvioId: string,
    file: File,
    tipoFoto: 'recogida_origen' | 'entrega_deposito_ld' | 'recogida_deposito_ld' | 'entrega_destino',
    observaciones?: string,
    ubicacionGps?: { lat: number; lng: number }
  ) => {
    if (!user) return;

    try {
      // Upload file to storage
      const fileName = `${hojaRutaId}/${ordenEnvioId}/${tipoFoto}_${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('puntoenvio cubo')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('puntoenvio cubo')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('hoja_ruta_fotos')
        .insert({
          hoja_ruta_id: hojaRutaId,
          orden_envio_id: ordenEnvioId,
          foto_url: urlData.publicUrl,
          tipo_foto: tipoFoto,
          tomada_por_user_id: user.id,
          ubicacion_gps: ubicacionGps ? `(${ubicacionGps.lat},${ubicacionGps.lng})` : null,
          observaciones
        });

      if (dbError) throw dbError;

      toast({
        title: "Foto subida",
        description: "La foto se ha guardado correctamente",
      });

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error subiendo foto:', error);
      toast({
        title: "Error",
        description: "No se pudo subir la foto",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, toast]);

  const obtenerFotosHojaRuta = useCallback(async (hojaRutaId: string): Promise<HojaRutaFoto[]> => {
    try {
      const { data, error } = await supabase
        .from('hoja_ruta_fotos')
        .select('*')
        .eq('hoja_ruta_id', hojaRutaId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        tipo_foto: item.tipo_foto as 'recogida_origen' | 'entrega_deposito_ld' | 'recogida_deposito_ld' | 'entrega_destino'
      }));
    } catch (error) {
      console.error('Error obteniendo fotos:', error);
      return [];
    }
  }, []);

  return {
    loading,
    hojasRuta,
    generarHojasRutaAgencia,
    obtenerHojasRutaTransportista,
    actualizarEstadoHojaRuta,
    subirFotoHojaRuta,
    obtenerFotosHojaRuta
  };
};