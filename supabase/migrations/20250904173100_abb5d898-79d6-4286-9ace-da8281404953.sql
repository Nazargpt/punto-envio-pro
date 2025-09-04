-- Insertar transportistas de prueba
INSERT INTO public.transportistas (id, nombre, apellido, documento, telefono, email, tipo_transportista, activo, nombre_empresa) VALUES
('11111111-1111-4111-8111-111111111111', 'Carlos', 'Rodríguez', '12345678', '+5491123456789', 'carlos.rodriguez@email.com', 'local', true, 'Transportes Rápidos SA'),
('22222222-2222-4222-8222-222222222222', 'María', 'González', '87654321', '+5491234567890', 'maria.gonzalez@email.com', 'larga_distancia', true, 'Logística Nacional SRL'),
('33333333-3333-4333-8333-333333333333', 'Juan', 'López', '11223344', '+5491345678901', 'juan.lopez@email.com', 'local', true, 'Entregas Express'),
('44444444-4444-4444-8444-444444444444', 'Ana', 'Martínez', '55667788', '+5491456789012', 'ana.martinez@email.com', 'larga_distancia', true, 'Rutas del Sur'),
('55555555-5555-4555-8555-555555555555', 'Pedro', 'Silva', '99887766', '+5491567890123', 'pedro.silva@email.com', 'local', true, 'Distribuciones Metropolitanas');

-- Insertar hojas de ruta de prueba
INSERT INTO public.hojas_ruta (
  id, transportista_id, fecha, tipo_ruta, estado, observaciones, 
  codigo_seguimiento, deposito_origen, deposito_destino
) VALUES
-- Hoja de ruta 1: Local origen
('11111111-1111-4111-8111-111111111112', '11111111-1111-4111-8111-111111111111', '2024-01-15', 'local_origen', 'completada', 'Recogida en CABA para múltiples envíos', 'HR-2024-000001', NULL, NULL),

-- Hoja de ruta 2: Larga distancia CABA-La Plata
('22222222-2222-4222-8222-222222222223', '22222222-2222-4222-8222-222222222222', '2024-01-15', 'larga_distancia', 'en_curso', 'Transporte CABA a La Plata', 'HR-2024-000002', 'CABA, Ciudad Autónoma de Buenos Aires', 'La Plata, Buenos Aires'),

-- Hoja de ruta 3: Local destino La Plata
('33333333-3333-4333-8333-333333333334', '33333333-3333-4333-8333-333333333333', '2024-01-16', 'local_destino', 'planificada', 'Entrega final en La Plata', 'HR-2024-000003', NULL, NULL),

-- Hoja de ruta 4: Larga distancia CABA-Córdoba
('44444444-4444-4444-8444-444444444445', '44444444-4444-4444-8444-444444444444', '2024-01-15', 'larga_distancia', 'en_curso', 'Transporte CABA a Córdoba', 'HR-2024-000004', 'CABA, Ciudad Autónoma de Buenos Aires', 'Córdoba Capital, Córdoba'),

-- Hoja de ruta 5: Local origen Mar del Plata
('55555555-5555-4555-8555-555555555556', '55555555-5555-4555-8555-555555555555', '2024-01-16', 'local_origen', 'planificada', 'Recogida en Mar del Plata', 'HR-2024-000005', NULL, NULL);