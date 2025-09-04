-- Crear órdenes de prueba con UUIDs generados automáticamente
WITH orden_data AS (
  SELECT 
    gen_random_uuid() as id,
    'PE-2024-00000' || row_number() OVER() as numero_orden,
    nombres.remitente_nombre,
    nombres.remitente_documento,
    nombres.remitente_domicilio,
    nombres.remitente_provincia,
    nombres.remitente_localidad,
    nombres.tipo_recoleccion,
    nombres.destinatario_nombre,
    nombres.destinatario_documento,
    nombres.destinatario_domicilio,
    nombres.destinatario_provincia,
    nombres.destinatario_localidad,
    nombres.tipo_entrega,
    nombres.estado,
    nombres.estado_detallado,
    '3ff5bfc0-6ac7-4580-b102-6046908dad4e'::uuid as usuario_creacion_id,
    nombres.agencia_origen_id::uuid,
    nombres.agencia_destino_id::uuid,
    CURRENT_DATE + nombres.offset_recoleccion as fecha_recoleccion,
    nombres.hora_recoleccion::time,
    CURRENT_DATE + nombres.offset_entrega as fecha_entrega,
    nombres.hora_entrega::time
  FROM (VALUES 
    ('Juan Pérez', '20345678901', 'Av. Libertador 1234', 'Buenos Aires', 'CABA', 'domicilio', 'María García', '27456789012', 'Calle Corrientes 567', 'Córdoba', 'Córdoba Capital', 'agencia', 'asignada', 'asignada_transportista_local_origen', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', '997ae27f-c169-4b42-9777-460ccdaf581a', 0, '09:00', 1, '14:00'),
    ('Carlos López', '23567890123', 'San Martín 890', 'Buenos Aires', 'CABA', 'agencia', 'Ana Rodríguez', '24678901234', 'Mitre 345', 'Santa Fe', 'Rosario', 'domicilio', 'asignada', 'asignada_transportista_local_origen', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', '40b63985-ff84-46a4-b136-8bb1d3e3af14', 0, '10:30', 1, '16:00'),
    ('Roberto Silva', '20789012345', 'Belgrano 456', 'Buenos Aires', 'CABA', 'domicilio', 'Laura Martín', '25789012346', 'Sarmiento 789', 'Mendoza', 'Mendoza Capital', 'agencia', 'asignada', 'asignada_transportista_local_origen', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', '997ae27f-c169-4b42-9777-460ccdaf581a', 0, '11:00', 2, '15:30'),
    ('Patricia Gómez', '27890123456', 'Rivadavia 123', 'Córdoba', 'Córdoba Capital', 'agencia', 'Fernando Castro', '20901234567', 'San Juan 654', 'Buenos Aires', 'CABA', 'domicilio', 'en_transito', 'en_transporte_larga_distancia', '997ae27f-c169-4b42-9777-460ccdaf581a', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', -1, '08:00', 1, '18:00'),
    ('Gustavo Torres', '23012345678', 'Maipú 987', 'Santa Fe', 'Rosario', 'domicilio', 'Silvia Herrera', '24123456789', 'Entre Ríos 321', 'Buenos Aires', 'CABA', 'agencia', 'en_transito', 'en_transporte_larga_distancia', '40b63985-ff84-46a4-b136-8bb1d3e3af14', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', -1, '07:30', 1, '19:30'),
    ('Mónica Vega', '25234567890', 'Independencia 555', 'Mendoza', 'Mendoza Capital', 'agencia', 'Diego Morales', '22345678901', 'Palermo 888', 'Buenos Aires', 'CABA', 'domicilio', 'en_destino', 'pendiente_entrega_local', '997ae27f-c169-4b42-9777-460ccdaf581a', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', -2, '09:15', 0, '17:00'),
    ('Alejandro Ruiz', '26345678902', 'Alsina 777', 'Buenos Aires', 'CABA', 'domicilio', 'Carmen Flores', '23456789013', 'Pellegrini 999', 'Córdoba', 'Córdoba Capital', 'agencia', 'en_destino', 'pendiente_entrega_local', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', '997ae27f-c169-4b42-9777-460ccdaf581a', -2, '08:45', 0, '16:30'),
    ('Valeria Sosa', '27456789014', 'Tucumán 111', 'Santa Fe', 'Rosario', 'agencia', 'Marcos Paz', '24567890125', 'Defensa 222', 'Buenos Aires', 'CABA', 'domicilio', 'entregada', 'entregada_exitosamente', '40b63985-ff84-46a4-b136-8bb1d3e3af14', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', -3, '10:00', -1, '14:45')
  ) AS nombres(
    remitente_nombre, remitente_documento, remitente_domicilio, remitente_provincia, remitente_localidad, tipo_recoleccion,
    destinatario_nombre, destinatario_documento, destinatario_domicilio, destinatario_provincia, destinatario_localidad, tipo_entrega,
    estado, estado_detallado, agencia_origen_id, agencia_destino_id, offset_recoleccion, hora_recoleccion, offset_entrega, hora_entrega
  )
),
-- Guardar los IDs generados para usar en las relaciones
orden_ids AS (
  INSERT INTO public.ordenes_envio (
    id, numero_orden, remitente_nombre, remitente_documento, remitente_domicilio, remitente_provincia, remitente_localidad, tipo_recoleccion,
    destinatario_nombre, destinatario_documento, destinatario_domicilio, destinatario_provincia, destinatario_localidad, tipo_entrega,
    estado, estado_detallado, usuario_creacion_id, agencia_origen_id, agencia_destino_id, fecha_recoleccion, hora_recoleccion, fecha_entrega, hora_entrega
  )
  SELECT * FROM orden_data
  RETURNING id, numero_orden
)
SELECT 'Órdenes creadas: ' || count(*) FROM orden_ids;