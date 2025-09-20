import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecureOrderData {
  id: string;
  numero_orden: string;
  estado: string;
  estado_detallado: string;
  remitente_nombre_masked: string;
  remitente_documento_masked: string;
  remitente_domicilio_masked: string;
  remitente_localidad: string;
  remitente_provincia: string;
  destinatario_nombre_masked: string;
  destinatario_documento_masked: string;
  destinatario_domicilio_masked: string;
  destinatario_localidad: string;
  destinatario_provincia: string;
  fecha_recoleccion?: string;
  fecha_entrega?: string;
  tipo_recoleccion: string;
  tipo_entrega: string;
  agencia_origen_id?: string;
  agencia_destino_id?: string;
  usuario_creacion_id: string;
  access_level: string;
  created_at: string;
  updated_at: string;
}

export const useOrdersSecure = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * SECURITY: Fetch orders using secure masking function
   * This prevents exposure of sensitive customer personal information
   */
  const getOrdersSecure = useCallback(async (
    userOrdersOnly: boolean = false,
    limitCount: number = 50
  ): Promise<SecureOrderData[]> => {
    if (!user) {
      throw new Error('User must be authenticated to access order data');
    }

    setLoading(true);
    setError(null);

    try {
      // Use secure function that masks sensitive data
      const { data, error } = await supabase.rpc('get_orders_secure', {
        user_orders_only: userOrdersOnly,
        limit_count: limitCount
      });

      if (error) {
        console.error('Secure order fetch error:', error);
        throw error;
      }

      return data || [];
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch orders securely';
      setError(errorMessage);
      console.error('Secure order access error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * SECURITY: Get single order with masking
   * Uses existing get_orden_with_masking function for individual order access
   */
  const getOrderByIdSecure = useCallback(async (orderId: string) => {
    if (!user) {
      throw new Error('User must be authenticated to access order data');
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('get_orden_with_masking', {
        orden_id: orderId
      });

      if (error) {
        console.error('Secure single order fetch error:', error);
        throw error;
      }

      return data?.[0] || null;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch order securely';
      setError(errorMessage);
      console.error('Secure order access error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * SECURITY: Get order by number with masking
   */
  const getOrderByNumberSecure = useCallback(async (orderNumber: string) => {
    if (!user) {
      throw new Error('User must be authenticated to access order data');
    }

    setLoading(true);
    setError(null);

    try {
      // First get the order ID by number
      const { data: orders, error: searchError } = await supabase
        .from('ordenes_envio')
        .select('id')
        .eq('numero_orden', orderNumber)
        .maybeSingle();

      if (searchError) {
        throw searchError;
      }

      if (!orders) {
        return null;
      }

      // Then get the masked data
      return await getOrderByIdSecure(orders.id);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch order by number securely';
      setError(errorMessage);
      console.error('Secure order number access error:', err);
      throw new Error(errorMessage);
    }
  }, [user, getOrderByIdSecure]);

  /**
   * SECURITY: Create order - this doesn't require masking as it's new data
   * But still use secure practices
   */
  const createOrderSecure = useCallback(async (orderData: any) => {
    if (!user) {
      throw new Error('User must be authenticated to create orders');
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('ordenes_envio')
        .insert({
          ...orderData,
          usuario_creacion_id: user.id
        })
        .select('id, numero_orden')
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create order securely';
      setError(errorMessage);
      console.error('Secure order creation error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    getOrdersSecure,
    getOrderByIdSecure,
    getOrderByNumberSecure,
    createOrderSecure
  };
};