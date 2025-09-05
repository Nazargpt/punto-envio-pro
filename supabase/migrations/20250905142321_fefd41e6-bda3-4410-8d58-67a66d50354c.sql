-- Corregir la función handle_new_user para que funcione correctamente con el enum app_role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, nombre)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'nombre', ''));
  
  -- Assign default USER role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'USER'::public.app_role);
  
  RETURN NEW;
END;
$$;