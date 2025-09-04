-- Insertar transportistas de prueba
INSERT INTO public.transportistas (id, nombre, apellido, documento, telefono, email, tipo_transportista, activo, nombre_empresa) VALUES
('11111111-1111-1111-1111-111111111111', 'Carlos', 'Rodríguez', '12345678', '+5491123456789', 'carlos.rodriguez@email.com', 'local', true, 'Transportes Rápidos SA'),
('22222222-2222-2222-2222-222222222222', 'María', 'González', '87654321', '+5491234567890', 'maria.gonzalez@email.com', 'larga_distancia', true, 'Logística Nacional SRL'),
('33333333-3333-3333-3333-333333333333', 'Juan', 'López', '11223344', '+5491345678901', 'juan.lopez@email.com', 'local', true, 'Entregas Express'),
('44444444-4444-4444-4444-444444444444', 'Ana', 'Martínez', '55667788', '+5491456789012', 'ana.martinez@email.com', 'larga_distancia', true, 'Rutas del Sur'),
('55555555-5555-5555-5555-555555555555', 'Pedro', 'Silva', '99887766', '+5491567890123', 'pedro.silva@email.com', 'local', true, 'Distribuciones Metropolitanas');

-- Insertar órdenes de envío de prueba con estados válidos
INSERT INTO public.ordenes_envio (
  id, numero_orden, usuario_creacion_id, remitente_nombre, remitente_documento, remitente_domicilio, 
  remitente_provincia, remitente_localidad, tipo_recoleccion, destinatario_nombre, destinatario_documento, 
  destinatario_domicilio, destinatario_provincia, destinatario_localidad, tipo_entrega, estado, estado_detallado,
  fecha_recoleccion, hora_recoleccion, fecha_entrega, hora_entrega
) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PE-2024-000001', '00000000-0000-0000-0000-000000000000', 'Roberto Pérez', '20304050', 'Av. Corrientes 1234', 'CABA', 'Ciudad Autónoma de Buenos Aires', 'domicilio', 'Laura Fernández', '30405060', 'Calle Falsa 567', 'Buenos Aires', 'La Plata', 'domicilio', 'pendiente', 'pendiente', '2024-01-15', '09:00', '2024-01-16', '14:00'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'PE-2024-000002', '00000000-0000-0000-0000-000000000000', 'Carmen Torres', '40506070', 'San Martín 890', 'CABA', 'Ciudad Autónoma de Buenos Aires', 'domicilio', 'Diego Ramírez', '50607080', 'Belgrano 321', 'Córdoba', 'Córdoba Capital', 'domicilio', 'pendiente', 'pendiente', '2024-01-15', '10:30', '2024-01-17', '16:00'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'PE-2024-000003', '00000000-0000-0000-0000-000000000000', 'Alejandro Vega', '60708090', 'Rivadavia 456', 'Buenos Aires', 'Mar del Plata', 'domicilio', 'Sofía Morales', '70809010', 'Mitre 789', 'Buenos Aires', 'Bahía Blanca', 'domicilio', 'pendiente', 'pendiente', '2024-01-16', '08:00', '2024-01-18', '12:00'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'PE-2024-000004', '00000000-0000-0000-0000-000000000000', 'Gabriela Castro', '80901020', 'Sarmiento 654', 'CABA', 'Ciudad Autónoma de Buenos Aires', 'domicilio', 'Martín Herrera', '90102030', 'Alsina 987', 'Santa Fe', 'Rosario', 'domicilio', 'pendiente', 'pendiente', '2024-01-16', '11:00', '2024-01-18', '15:30'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'PE-2024-000005', '00000000-0000-0000-0000-000000000000', 'Fernando Blanco', '10203040', 'Libertador 123', 'Buenos Aires', 'Tigre', 'domicilio', 'Valeria Romero', '20304050', 'Independencia 456', 'Buenos Aires', 'San Isidro', 'domicilio', 'pendiente', 'pendiente', '2024-01-14', '07:30', '2024-01-15', '10:00');

-- Insertar hojas de ruta de prueba
INSERT INTO public.hojas_ruta (
  id, transportista_id, fecha, tipo_ruta, estado, observaciones, 
  codigo_seguimiento, deposito_origen, deposito_destino
) VALUES
-- Hoja de ruta 1: Local origen
('hr111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '2024-01-15', 'local_origen', 'completada', 'Recogida en CABA para envíos PE-2024-000001 y PE-2024-000004', 'HR-2024-000001', NULL, NULL),

-- Hoja de ruta 2: Larga distancia CABA-La Plata
('hr222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '2024-01-15', 'larga_distancia', 'en_curso', 'Transporte CABA a La Plata - PE-2024-000001', 'HR-2024-000002', 'CABA, Ciudad Autónoma de Buenos Aires', 'La Plata, Buenos Aires'),

-- Hoja de ruta 3: Local destino La Plata
('hr333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '2024-01-16', 'local_destino', 'planificada', 'Entrega final en La Plata - PE-2024-000001', 'HR-2024-000003', NULL, NULL),

-- Hoja de ruta 4: Larga distancia CABA-Córdoba
('hr444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '2024-01-15', 'larga_distancia', 'en_curso', 'Transporte CABA a Córdoba - PE-2024-000002', 'HR-2024-000004', 'CABA, Ciudad Autónoma de Buenos Aires', 'Córdoba Capital, Córdoba'),

-- Hoja de ruta 5: Local origen Mar del Plata
('hr555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '2024-01-16', 'local_origen', 'planificada', 'Recogida en Mar del Plata - PE-2024-000003', 'HR-2024-000005', NULL, NULL);

-- Relacionar órdenes con hojas de ruta
INSERT INTO public.ordenes_hoja_ruta (
  hoja_ruta_id, orden_envio_id, orden_visita, tipo_visita, completado, observaciones
) VALUES
-- Orden 1: CABA -> La Plata
('hr111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'recogida', true, 'Recogida exitosa en Av. Corrientes'),
('hr222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'transporte', false, 'En tránsito hacia La Plata'),
('hr333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'entrega', false, 'Pendiente de entrega'),

-- Orden 2: CABA -> Córdoba
('hr111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 'recogida', true, 'Recogida exitosa en San Martín'),
('hr444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 'transporte', false, 'En tránsito hacia Córdoba'),

-- Orden 3: Mar del Plata -> Bahía Blanca
('hr555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 1, 'recogida', false, 'Programada para mañana'),

-- Orden 4: CABA -> Rosario
('hr111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 3, 'recogida', true, 'Recogida exitosa en Sarmiento'),

-- Orden 5: Tigre -> San Isidro (completada)
('hr111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 4, 'entrega', true, 'Entrega completada exitosamente');

-- Crear asociaciones entre hojas de ruta
INSERT INTO public.hojas_ruta_asociaciones (
  hoja_ruta_local_origen_id, hoja_ruta_larga_distancia_id, hoja_ruta_local_destino_id, estado_asociacion
) VALUES
('hr111111-1111-1111-1111-111111111111', 'hr222222-2222-2222-2222-222222222222', 'hr333333-3333-3333-3333-333333333333', 'en_proceso'),
('hr111111-1111-1111-1111-111111111111', 'hr444444-4444-4444-4444-444444444444', NULL, 'en_proceso');

-- Insertar paquetes de prueba
INSERT INTO public.paquetes (
  orden_envio_id, descripcion, peso_kg, largo_cm, ancho_cm, alto_cm, valor_declarado, fragil
) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Documentos importantes', 0.5, 30, 25, 5, 100.00, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Electrónicos - Tablet', 2.3, 35, 25, 3, 50000.00, true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Ropa y accesorios', 1.8, 40, 30, 15, 5000.00, false),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Libros técnicos', 3.2, 25, 20, 10, 2500.00, false),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Medicamentos', 0.8, 20, 15, 8, 1200.00, true);