-- Enable RLS on tables that don't have it
ALTER TABLE public.hojas_ruta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_hoja_ruta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paquetes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seguimiento_detallado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarifas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;

-- Create public policies for tables without policies
CREATE POLICY "Public can view hojas_ruta" ON public.hojas_ruta FOR SELECT USING (true);
CREATE POLICY "Public can create hojas_ruta" ON public.hojas_ruta FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update hojas_ruta" ON public.hojas_ruta FOR UPDATE USING (true);
CREATE POLICY "Public can delete hojas_ruta" ON public.hojas_ruta FOR DELETE USING (true);

CREATE POLICY "Public can view incidencias" ON public.incidencias FOR SELECT USING (true);
CREATE POLICY "Public can create incidencias" ON public.incidencias FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update incidencias" ON public.incidencias FOR UPDATE USING (true);
CREATE POLICY "Public can delete incidencias" ON public.incidencias FOR DELETE USING (true);

CREATE POLICY "Public can view ordenes_hoja_ruta" ON public.ordenes_hoja_ruta FOR SELECT USING (true);
CREATE POLICY "Public can create ordenes_hoja_ruta" ON public.ordenes_hoja_ruta FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update ordenes_hoja_ruta" ON public.ordenes_hoja_ruta FOR UPDATE USING (true);
CREATE POLICY "Public can delete ordenes_hoja_ruta" ON public.ordenes_hoja_ruta FOR DELETE USING (true);

CREATE POLICY "Public can view paquetes" ON public.paquetes FOR SELECT USING (true);
CREATE POLICY "Public can create paquetes" ON public.paquetes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update paquetes" ON public.paquetes FOR UPDATE USING (true);
CREATE POLICY "Public can delete paquetes" ON public.paquetes FOR DELETE USING (true);

CREATE POLICY "Public can view seguimiento_detallado" ON public.seguimiento_detallado FOR SELECT USING (true);
CREATE POLICY "Public can create seguimiento_detallado" ON public.seguimiento_detallado FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update seguimiento_detallado" ON public.seguimiento_detallado FOR UPDATE USING (true);
CREATE POLICY "Public can delete seguimiento_detallado" ON public.seguimiento_detallado FOR DELETE USING (true);

CREATE POLICY "Public can view tarifas" ON public.tarifas FOR SELECT USING (true);
CREATE POLICY "Public can create tarifas" ON public.tarifas FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update tarifas" ON public.tarifas FOR UPDATE USING (true);
CREATE POLICY "Public can delete tarifas" ON public.tarifas FOR DELETE USING (true);

CREATE POLICY "Public can view transportistas" ON public.transportistas FOR SELECT USING (true);
CREATE POLICY "Public can create transportistas" ON public.transportistas FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update transportistas" ON public.transportistas FOR UPDATE USING (true);
CREATE POLICY "Public can delete transportistas" ON public.transportistas FOR DELETE USING (true);

CREATE POLICY "Public can view vehiculos" ON public.vehiculos FOR SELECT USING (true);
CREATE POLICY "Public can create vehiculos" ON public.vehiculos FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update vehiculos" ON public.vehiculos FOR UPDATE USING (true);
CREATE POLICY "Public can delete vehiculos" ON public.vehiculos FOR DELETE USING (true);