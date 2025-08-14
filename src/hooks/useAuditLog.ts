import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuditLogProps {
  logOrderAccess: (
    orderId: string | null,
    orderNumber: string,
    accessType: 'view' | 'update' | 'create',
    accessedFields?: string[]
  ) => Promise<void>;
}

export const useAuditLog = (): UseAuditLogProps => {
  const { user } = useAuth();

  const logOrderAccess = useCallback(async (
    orderId: string | null,
    orderNumber: string,
    accessType: 'view' | 'update' | 'create',
    accessedFields: string[] = []
  ) => {
    // Only log if user is authenticated
    if (!user) return;

    try {
      await supabase.rpc('log_order_access', {
        p_order_id: orderId,
        p_orden_numero: orderNumber,
        p_access_type: accessType,
        p_accessed_fields: accessedFields.length > 0 ? accessedFields : null
      });
    } catch (error) {
      console.error('Error logging order access:', error);
      // Don't throw error to avoid breaking main functionality
    }
  }, [user]);

  return {
    logOrderAccess
  };
};