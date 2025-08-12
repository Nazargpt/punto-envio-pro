-- Actualizar política RLS para permitir que usuarios autenticados puedan crear agencias
DROP POLICY IF EXISTS "Only superadmin can modify agencias" ON public.agencias;

-- Política para que usuarios autenticados puedan crear agencias
CREATE POLICY "Authenticated users can create agencias" 
ON public.agencias 
FOR INSERT 
WITH CHECK (true);

-- Política para que usuarios autenticados puedan actualizar agencias
CREATE POLICY "Authenticated users can update agencias" 
ON public.agencias 
FOR UPDATE 
USING (true);

-- Solo SUPERADMIN puede eliminar agencias
CREATE POLICY "Only superadmin can delete agencias" 
ON public.agencias 
FOR DELETE 
USING (has_role(auth.uid(), 'SUPERADMIN'::app_role));