-- Verificar y actualizar las políticas RLS para agencias
-- Primero eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Authenticated users can view agencias" ON public.agencias;
DROP POLICY IF EXISTS "Authenticated users can create agencias" ON public.agencias;
DROP POLICY IF EXISTS "Authenticated users can update agencias" ON public.agencias;
DROP POLICY IF EXISTS "Only superadmin can delete agencias" ON public.agencias;

-- Crear políticas más específicas
-- Política para ver agencias (público)
CREATE POLICY "Anyone can view agencias" 
ON public.agencias 
FOR SELECT 
USING (true);

-- Política para crear agencias (sin restricciones por ahora)
CREATE POLICY "Anyone can insert agencias" 
ON public.agencias 
FOR INSERT 
WITH CHECK (true);

-- Política para actualizar agencias (sin restricciones por ahora)
CREATE POLICY "Anyone can update agencias" 
ON public.agencias 
FOR UPDATE 
USING (true);

-- Solo SUPERADMIN puede eliminar agencias
CREATE POLICY "Only superadmin can delete agencias" 
ON public.agencias 
FOR DELETE 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));