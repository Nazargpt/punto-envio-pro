-- Crear órdenes de prueba realistas con datos completos
INSERT INTO public.ordenes_envio (
  id,
  numero_orden, 
  remitente_nombre, 
  remitente_documento, 
  remitente_domicilio,
  remitente_provincia,
  remitente_localidad,
  tipo_recoleccion,
  destinatario_nombre,
  destinatario_documento, 
  destinatario_domicilio,
  destinatario_provincia,
  destinatario_localidad,
  tipo_entrega,
  estado,
  estado_detallado,
  usuario_creacion_id,
  agencia_origen_id,
  agencia_destino_id,
  fecha_recoleccion,
  hora_recoleccion,
  fecha_entrega,
  hora_entrega
) VALUES 
-- Órdenes para transporte local origen
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'PE-2024-000001', 'Juan Pérez', '20345678901', 'Av. Libertador 1234', 'Buenos Aires', 'CABA', 'domicilio', 'María García', '27456789012', 'Calle Corrientes 567', 'Córdoba', 'Córdoba Capital', 'agencia', 'asignada', 'asignada_transportista_local_origen', 'auth_user_1', 'agencia_caba_1', 'agencia_cordoba_1', CURRENT_DATE, '09:00', CURRENT_DATE + 1, '14:00'),

('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'PE-2024-000002', 'Carlos López', '23567890123', 'San Martín 890', 'Buenos Aires', 'CABA', 'agencia', 'Ana Rodríguez', '24678901234', 'Mitre 345', 'Santa Fe', 'Rosario', 'domicilio', 'asignada', 'asignada_transportista_local_origen', 'auth_user_1', 'agencia_caba_1', 'agencia_rosario_1', CURRENT_DATE, '10:30', CURRENT_DATE + 1, '16:00'),

('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'PE-2024-000003', 'Roberto Silva', '20789012345', 'Belgrano 456', 'Buenos Aires', 'CABA', 'domicilio', 'Laura Martín', '25789012346', 'Sarmiento 789', 'Mendoza', 'Mendoza Capital', 'agencia', 'asignada', 'asignada_transportista_local_origen', 'auth_user_1', 'agencia_caba_1', 'agencia_mendoza_1', CURRENT_DATE, '11:00', CURRENT_DATE + 2, '15:30'),

-- Órdenes para transporte larga distancia
('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'PE-2024-000004', 'Patricia Gómez', '27890123456', 'Rivadavia 123', 'Córdoba', 'Córdoba Capital', 'agencia', 'Fernando Castro', '20901234567', 'San Juan 654', 'Buenos Aires', 'CABA', 'domicilio', 'en_transito', 'en_transporte_larga_distancia', 'auth_user_1', 'agencia_cordoba_1', 'agencia_caba_1', CURRENT_DATE - 1, '08:00', CURRENT_DATE + 1, '18:00'),

('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'PE-2024-000005', 'Gustavo Torres', '23012345678', 'Maipú 987', 'Santa Fe', 'Rosario', 'domicilio', 'Silvia Herrera', '24123456789', 'Entre Ríos 321', 'Buenos Aires', 'CABA', 'agencia', 'en_transito', 'en_transporte_larga_distancia', 'auth_user_1', 'agencia_rosario_1', 'agencia_caba_1', CURRENT_DATE - 1, '07:30', CURRENT_DATE + 1, '19:30'),

-- Órdenes para entrega local destino
('ffffffff-ffff-4fff-8fff-ffffffffffff', 'PE-2024-000006', 'Mónica Vega', '25234567890', 'Independencia 555', 'Mendoza', 'Mendoza Capital', 'agencia', 'Diego Morales', '22345678901', 'Palermo 888', 'Buenos Aires', 'CABA', 'domicilio', 'en_destino', 'pendiente_entrega_local', 'auth_user_1', 'agencia_mendoza_1', 'agencia_caba_1', CURRENT_DATE - 2, '09:15', CURRENT_DATE, '17:00'),

('gggggggg-gggg-4ggg-8ggg-gggggggggggg', 'PE-2024-000007', 'Alejandro Ruiz', '26345678902', 'Alsina 777', 'Buenos Aires', 'CABA', 'domicilio', 'Carmen Flores', '23456789013', 'Pellegrini 999', 'Córdoba', 'Córdoba Capital', 'agencia', 'en_destino', 'pendiente_entrega_local', 'auth_user_1', 'agencia_caba_1', 'agencia_cordoba_1', CURRENT_DATE - 2, '08:45', CURRENT_DATE, '16:30'),

('hhhhhhhh-hhhh-4hhh-8hhh-hhhhhhhhhhhh', 'PE-2024-000008', 'Valeria Sosa', '27456789014', 'Tucumán 111', 'Santa Fe', 'Rosario', 'agencia', 'Marcos Paz', '24567890125', 'Defensa 222', 'Buenos Aires', 'CABA', 'domicilio', 'entregada', 'entregada_exitosamente', 'auth_user_1', 'agencia_rosario_1', 'agencia_caba_1', CURRENT_DATE - 3, '10:00', CURRENT_DATE - 1, '14:45');

-- Asociar órdenes con las hojas de ruta existentes
-- Hoja de ruta local origen (recogidas)
INSERT INTO public.ordenes_hoja_ruta (hoja_ruta_id, orden_envio_id, orden_visita, tipo_visita, observaciones) VALUES
('11111111-1111-4111-8111-111111111112', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 1, 'recogida', 'Recoger en Av. Libertador 1234 - Edificio con portero'),
('11111111-1111-4111-8111-111111111112', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 2, 'recogida', 'Recoger en San Martín 890 - Casa particular'),
('55555555-5555-4555-8555-555555555556', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 1, 'recogida', 'Recoger en Belgrano 456 - Local comercial');

-- Hoja de ruta larga distancia (transportes)
INSERT INTO public.ordenes_hoja_ruta (hoja_ruta_id, orden_envio_id, orden_visita, tipo_visita, observaciones) VALUES
('22222222-2222-4222-8222-222222222223', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 1, 'transporte', 'Transporte Córdoba → CABA - Carga frágil'),
('22222222-2222-4222-8222-222222222223', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 2, 'transporte', 'Transporte Rosario → CABA - Documentación comercial'),
('44444444-4444-4444-8444-444444444445', 'ffffffff-ffff-4fff-8fff-ffffffffffff', 1, 'transporte', 'Transporte Mendoza → CABA - Productos alimentarios');

-- Hoja de ruta local destino (entregas)
INSERT INTO public.ordenes_hoja_ruta (hoja_ruta_id, orden_envio_id, orden_visita, tipo_visita, observaciones) VALUES
('33333333-3333-4333-8333-333333333334', 'ffffffff-ffff-4fff-8fff-ffffffffffff', 1, 'entrega', 'Entregar en Palermo 888 - Coordinar horario con destinatario'),
('33333333-3333-4333-8333-333333333334', 'gggggggg-gggg-4ggg-8ggg-gggggggggggg', 2, 'entrega', 'Entregar en Pellegrini 999 - Oficina empresarial'),
('33333333-3333-4333-8333-333333333334', 'hhhhhhhh-hhhh-4hhh-8hhh-hhhhhhhhhhhh', 3, 'entrega', 'Entregar en Defensa 222 - Casa de familia');

-- Crear algunos paquetes para las órdenes
INSERT INTO public.paquetes (orden_envio_id, peso_kg, descripcion, largo_cm, ancho_cm, alto_cm, valor_declarado, fragil) VALUES
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 2.5, 'Documentos comerciales', 30, 20, 5, 500.00, false),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 1.2, 'Libros y revistas', 25, 15, 10, 800.00, false),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 5.8, 'Productos artesanales', 40, 30, 20, 1200.00, true),
('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 3.2, 'Componentes electrónicos', 35, 25, 15, 2500.00, true),
('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 0.8, 'Contratos y certificados', 32, 22, 3, 300.00, false),
('ffffffff-ffff-4fff-8fff-ffffffffffff', 4.5, 'Alimentos gourmet', 50, 30, 25, 900.00, false),
('gggggggg-gggg-4ggg-8ggg-gggggggggggg', 2.1, 'Medicamentos', 20, 15, 8, 1800.00, true),
('hhhhhhhh-hhhh-4hhh-8hhh-hhhhhhhhhhhh', 6.2, 'Herramientas pequeñas', 60, 40, 20, 750.00, false);