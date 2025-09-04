-- Crear órdenes de prueba realistas con UUIDs generados automáticamente
-- Primero creamos las órdenes
WITH new_orders AS (
  INSERT INTO public.ordenes_envio (
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
  ('PE-2024-000001', 'Juan Pérez', '20345678901', 'Av. Libertador 1234', 'Buenos Aires', 'CABA', 'domicilio', 'María García', '27456789012', 'Calle Corrientes 567', 'Córdoba', 'Córdoba Capital', 'agencia', 'asignada', 'asignada_transportista_local_origen', '3ff5bfc0-6ac7-4580-b102-6046908dad4e', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', '997ae27f-c169-4b42-9777-460ccdaf581a', CURRENT_DATE, '09:00', CURRENT_DATE + 1, '14:00'),
  
  ('PE-2024-000002', 'Carlos López', '23567890123', 'San Martín 890', 'Buenos Aires', 'CABA', 'agencia', 'Ana Rodríguez', '24678901234', 'Mitre 345', 'Santa Fe', 'Rosario', 'domicilio', 'asignada', 'asignada_transportista_local_origen', '3ff5bfc0-6ac7-4580-b102-6046908dad4e', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', '40b63985-ff84-46a4-b136-8bb1d3e3af14', CURRENT_DATE, '10:30', CURRENT_DATE + 1, '16:00'),
  
  ('PE-2024-000003', 'Roberto Silva', '20789012345', 'Belgrano 456', 'Buenos Aires', 'CABA', 'domicilio', 'Laura Martín', '25789012346', 'Sarmiento 789', 'Mendoza', 'Mendoza Capital', 'agencia', 'asignada', 'asignada_transportista_local_origen', '3ff5bfc0-6ac7-4580-b102-6046908dad4e', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', '997ae27f-c169-4b42-9777-460ccdaf581a', CURRENT_DATE, '11:00', CURRENT_DATE + 2, '15:30'),
  
  -- Órdenes para transporte larga distancia
  ('PE-2024-000004', 'Patricia Gómez', '27890123456', 'Rivadavia 123', 'Córdoba', 'Córdoba Capital', 'agencia', 'Fernando Castro', '20901234567', 'San Juan 654', 'Buenos Aires', 'CABA', 'domicilio', 'en_transito', 'en_transporte_larga_distancia', '3ff5bfc0-6ac7-4580-b102-6046908dad4e', '997ae27f-c169-4b42-9777-460ccdaf581a', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', CURRENT_DATE - 1, '08:00', CURRENT_DATE + 1, '18:00'),
  
  ('PE-2024-000005', 'Gustavo Torres', '23012345678', 'Maipú 987', 'Santa Fe', 'Rosario', 'domicilio', 'Silvia Herrera', '24123456789', 'Entre Ríos 321', 'Buenos Aires', 'CABA', 'agencia', 'en_transito', 'en_transporte_larga_distancia', '3ff5bfc0-6ac7-4580-b102-6046908dad4e', '40b63985-ff84-46a4-b136-8bb1d3e3af14', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', CURRENT_DATE - 1, '07:30', CURRENT_DATE + 1, '19:30'),
  
  -- Órdenes para entrega local destino
  ('PE-2024-000006', 'Mónica Vega', '25234567890', 'Independencia 555', 'Mendoza', 'Mendoza Capital', 'agencia', 'Diego Morales', '22345678901', 'Palermo 888', 'Buenos Aires', 'CABA', 'domicilio', 'en_destino', 'pendiente_entrega_local', '3ff5bfc0-6ac7-4580-b102-6046908dad4e', '997ae27f-c169-4b42-9777-460ccdaf581a', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', CURRENT_DATE - 2, '09:15', CURRENT_DATE, '17:00'),
  
  ('PE-2024-000007', 'Alejandro Ruiz', '26345678902', 'Alsina 777', 'Buenos Aires', 'CABA', 'domicilio', 'Carmen Flores', '23456789013', 'Pellegrini 999', 'Córdoba', 'Córdoba Capital', 'agencia', 'en_destino', 'pendiente_entrega_local', '3ff5bfc0-6ac7-4580-b102-6046908dad4e', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', '997ae27f-c169-4b42-9777-460ccdaf581a', CURRENT_DATE - 2, '08:45', CURRENT_DATE, '16:30'),
  
  ('PE-2024-000008', 'Valeria Sosa', '27456789014', 'Tucumán 111', 'Santa Fe', 'Rosario', 'agencia', 'Marcos Paz', '24567890125', 'Defensa 222', 'Buenos Aires', 'CABA', 'domicilio', 'entregada', 'entregada_exitosamente', '3ff5bfc0-6ac7-4580-b102-6046908dad4e', '40b63985-ff84-46a4-b136-8bb1d3e3af14', '3cdcfbf8-770c-484e-8e0e-2a135166ba1e', CURRENT_DATE - 3, '10:00', CURRENT_DATE - 1, '14:45')
  
  RETURNING id, numero_orden
),

-- Crear paquetes para las órdenes
paquetes_created AS (
  INSERT INTO public.paquetes (orden_envio_id, peso_kg, descripcion, largo_cm, ancho_cm, alto_cm, valor_declarado, fragil)
  SELECT 
    no.id,
    CASE no.numero_orden
      WHEN 'PE-2024-000001' THEN 2.5
      WHEN 'PE-2024-000002' THEN 1.2
      WHEN 'PE-2024-000003' THEN 5.8
      WHEN 'PE-2024-000004' THEN 3.2
      WHEN 'PE-2024-000005' THEN 0.8
      WHEN 'PE-2024-000006' THEN 4.5
      WHEN 'PE-2024-000007' THEN 2.1
      WHEN 'PE-2024-000008' THEN 6.2
    END as peso_kg,
    CASE no.numero_orden
      WHEN 'PE-2024-000001' THEN 'Documentos comerciales'
      WHEN 'PE-2024-000002' THEN 'Libros y revistas'
      WHEN 'PE-2024-000003' THEN 'Productos artesanales'
      WHEN 'PE-2024-000004' THEN 'Componentes electrónicos'
      WHEN 'PE-2024-000005' THEN 'Contratos y certificados'
      WHEN 'PE-2024-000006' THEN 'Alimentos gourmet'
      WHEN 'PE-2024-000007' THEN 'Medicamentos'
      WHEN 'PE-2024-000008' THEN 'Herramientas pequeñas'
    END as descripcion,
    30 as largo_cm,
    20 as ancho_cm,
    10 as alto_cm,
    1000.00 as valor_declarado,
    CASE no.numero_orden
      WHEN 'PE-2024-000003' THEN true
      WHEN 'PE-2024-000004' THEN true
      WHEN 'PE-2024-000007' THEN true
      ELSE false
    END as fragil
  FROM new_orders no
  RETURNING orden_envio_id
)

-- Asociar órdenes con hojas de ruta
INSERT INTO public.ordenes_hoja_ruta (hoja_ruta_id, orden_envio_id, orden_visita, tipo_visita, observaciones)
SELECT 
  CASE 
    WHEN no.numero_orden IN ('PE-2024-000001', 'PE-2024-000002') THEN '11111111-1111-4111-8111-111111111112'::uuid
    WHEN no.numero_orden = 'PE-2024-000003' THEN '55555555-5555-4555-8555-555555555556'::uuid
    WHEN no.numero_orden IN ('PE-2024-000004', 'PE-2024-000005') THEN '22222222-2222-4222-8222-222222222223'::uuid
    WHEN no.numero_orden = 'PE-2024-000006' THEN '44444444-4444-4444-8444-444444444445'::uuid
    WHEN no.numero_orden IN ('PE-2024-000007', 'PE-2024-000008') THEN '33333333-3333-4333-8333-333333333334'::uuid
  END as hoja_ruta_id,
  no.id as orden_envio_id,
  CASE 
    WHEN no.numero_orden IN ('PE-2024-000001', 'PE-2024-000003', 'PE-2024-000004', 'PE-2024-000006', 'PE-2024-000007') THEN 1
    WHEN no.numero_orden IN ('PE-2024-000002', 'PE-2024-000005', 'PE-2024-000008') THEN 2
  END as orden_visita,
  CASE 
    WHEN no.numero_orden IN ('PE-2024-000001', 'PE-2024-000002', 'PE-2024-000003') THEN 'recogida'
    WHEN no.numero_orden IN ('PE-2024-000004', 'PE-2024-000005', 'PE-2024-000006') THEN 'transporte'
    WHEN no.numero_orden IN ('PE-2024-000007', 'PE-2024-000008') THEN 'entrega'
  END as tipo_visita,
  CASE no.numero_orden
    WHEN 'PE-2024-000001' THEN 'Recoger en Av. Libertador 1234 - Edificio con portero'
    WHEN 'PE-2024-000002' THEN 'Recoger en San Martín 890 - Casa particular'
    WHEN 'PE-2024-000003' THEN 'Recoger en Belgrano 456 - Local comercial'
    WHEN 'PE-2024-000004' THEN 'Transporte Córdoba → CABA - Carga frágil'
    WHEN 'PE-2024-000005' THEN 'Transporte Rosario → CABA - Documentación comercial'
    WHEN 'PE-2024-000006' THEN 'Transporte Mendoza → CABA - Productos alimentarios'
    WHEN 'PE-2024-000007' THEN 'Entregar en Pellegrini 999 - Oficina empresarial'
    WHEN 'PE-2024-000008' THEN 'Entregar en Defensa 222 - Casa de familia'
  END as observaciones
FROM new_orders no;