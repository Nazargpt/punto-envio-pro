-- Crear tabla de zonas tarifarias
CREATE TABLE public.zonas_tarifarias (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  descripcion text,
  multiplicador numeric NOT NULL DEFAULT 1.0,
  precio_base_0_5kg numeric NOT NULL DEFAULT 0,
  precio_base_5_10kg numeric NOT NULL DEFAULT 0,
  precio_base_10_15kg numeric NOT NULL DEFAULT 0,
  precio_base_15_20kg numeric NOT NULL DEFAULT 0,
  precio_base_20_25kg numeric NOT NULL DEFAULT 0,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Crear tabla de matriz provincia-provincia-zona
CREATE TABLE public.matriz_provincias_zonas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provincia_origen text NOT NULL,
  provincia_destino text NOT NULL,
  zona_id uuid REFERENCES public.zonas_tarifarias(id) ON DELETE SET NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(provincia_origen, provincia_destino)
);

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.zonas_tarifarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriz_provincias_zonas ENABLE ROW LEVEL SECURITY;

-- Políticas para zonas_tarifarias
CREATE POLICY "Solo administradores pueden ver zonas_tarifarias"
ON public.zonas_tarifarias
FOR SELECT
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Solo administradores pueden crear zonas_tarifarias"
ON public.zonas_tarifarias
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Solo administradores pueden actualizar zonas_tarifarias"
ON public.zonas_tarifarias
FOR UPDATE
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Solo superadministradores pueden eliminar zonas_tarifarias"
ON public.zonas_tarifarias
FOR DELETE
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Políticas para matriz_provincias_zonas
CREATE POLICY "Solo administradores pueden ver matriz_provincias_zonas"
ON public.matriz_provincias_zonas
FOR SELECT
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERADMIN'::app_role) OR
  has_role(auth.uid(), 'OPERADOR_AGENCIA'::app_role)
);

CREATE POLICY "Solo administradores pueden crear matriz_provincias_zonas"
ON public.matriz_provincias_zonas
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Solo administradores pueden actualizar matriz_provincias_zonas"
ON public.matriz_provincias_zonas
FOR UPDATE
USING (
  has_role(auth.uid(), 'ADMIN_AGENCIA'::app_role) OR
  has_role(auth.uid(), 'SUPERADMIN'::app_role)
);

CREATE POLICY "Solo superadministradores pueden eliminar matriz_provincias_zonas"
ON public.matriz_provincias_zonas
FOR DELETE
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Trigger para actualizar updated_at
CREATE TRIGGER update_zonas_tarifarias_updated_at
BEFORE UPDATE ON public.zonas_tarifarias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matriz_provincias_zonas_updated_at
BEFORE UPDATE ON public.matriz_provincias_zonas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar algunas zonas de ejemplo
INSERT INTO public.zonas_tarifarias (nombre, descripcion, precio_base_0_5kg, precio_base_5_10kg, precio_base_10_15kg, precio_base_15_20kg, precio_base_20_25kg, multiplicador)
VALUES 
  ('Zona 1 - Nacional', 'Zonas cercanas con menor costo de transporte', 2000, 2800, 3500, 4200, 4800, 1.0),
  ('Zona 2 - Regional', 'Zonas intermedias con costo moderado', 2500, 3300, 4200, 5000, 5700, 1.2),
  ('Zona 3 - Distancia', 'Zonas lejanas con mayor costo de transporte', 3500, 4500, 5800, 6800, 7800, 1.5),
  ('Zona 4 - Especial', 'Zonas de difícil acceso o condiciones especiales', 4500, 5800, 7500, 8800, 10000, 2.0);