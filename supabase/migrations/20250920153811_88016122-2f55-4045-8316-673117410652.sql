-- CRITICAL SECURITY FIX: Enhanced name masking function
CREATE OR REPLACE FUNCTION public.mask_nombre(nombre text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only show full name to superadmins
  IF has_role(auth.uid(), 'SUPERADMIN'::app_role) THEN
    RETURN nombre;
  END IF;
  
  -- Show partial name to admins and supervisors
  IF has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR has_role(auth.uid(), 'SUPERVISOR'::app_role) THEN
    RETURN split_part(nombre, ' ', 1) || ' ' || 
           CASE WHEN length(split_part(nombre, ' ', 2)) > 0 
                THEN left(split_part(nombre, ' ', 2), 1) || '***'
                ELSE '***' 
           END;
  END IF;
  
  -- Show only first name to operators and order creators
  RETURN split_part(nombre, ' ', 1) || ' ***';
END;
$function$