-- Insertar transportistas de prueba
INSERT INTO public.transportistas (nombre, apellido, documento, telefono, email, tipo_transportista, activo, nombre_empresa) VALUES
('Carlos', 'Rodríguez', '12345678', '+5491123456789', 'carlos.rodriguez@email.com', 'local', true, 'Transportes Rápidos SA'),
('María', 'González', '87654321', '+5491234567890', 'maria.gonzalez@email.com', 'larga_distancia', true, 'Logística Nacional SRL'),
('Juan', 'López', '11223344', '+5491345678901', 'juan.lopez@email.com', 'local', true, 'Entregas Express'),
('Ana', 'Martínez', '55667788', '+5491456789012', 'ana.martinez@email.com', 'larga_distancia', true, 'Rutas del Sur'),
('Pedro', 'Silva', '99887766', '+5491567890123', 'pedro.silva@email.com', 'local', true, 'Distribuciones Metropolitanas');

-- Obtener IDs de transportistas insertados
DO $$
DECLARE
    transportista_local_1 UUID;
    transportista_ld_1 UUID;
    transportista_local_2 UUID;
    transportista_ld_2 UUID;
    transportista_local_3 UUID;
    orden_1 UUID;
    orden_2 UUID;
    orden_3 UUID;
    orden_4 UUID;
    orden_5 UUID;
    hoja_1 UUID;
    hoja_2 UUID;
    hoja_3 UUID;
    hoja_4 UUID;
    hoja_5 UUID;
BEGIN
    -- Obtener IDs de transportistas
    SELECT id INTO transportista_local_1 FROM public.transportistas WHERE nombre = 'Carlos' AND apellido = 'Rodríguez';
    SELECT id INTO transportista_ld_1 FROM public.transportistas WHERE nombre = 'María' AND apellido = 'González';
    SELECT id INTO transportista_local_2 FROM public.transportistas WHERE nombre = 'Juan' AND apellido = 'López';
    SELECT id INTO transportista_ld_2 FROM public.transportistas WHERE nombre = 'Ana' AND apellido = 'Martínez';
    SELECT id INTO transportista_local_3 FROM public.transportistas WHERE nombre = 'Pedro' AND apellido = 'Silva';

    -- Insertar órdenes de envío
    INSERT INTO public.ordenes_envio (
        usuario_creacion_id, remitente_nombre, remitente_documento, remitente_domicilio, 
        remitente_provincia, remitente_localidad, tipo_recoleccion, destinatario_nombre, 
        destinatario_documento, destinatario_domicilio, destinatario_provincia, 
        destinatario_localidad, tipo_entrega, fecha_recoleccion, hora_recoleccion, 
        fecha_entrega, hora_entrega
    ) VALUES
    ('00000000-0000-0000-0000-000000000000', 'Roberto Pérez', '20304050', 'Av. Corrientes 1234', 'CABA', 'Ciudad Autónoma de Buenos Aires', 'domicilio', 'Laura Fernández', '30405060', 'Calle Falsa 567', 'Buenos Aires', 'La Plata', 'domicilio', '2024-01-15', '09:00', '2024-01-16', '14:00'),
    ('00000000-0000-0000-0000-000000000000', 'Carmen Torres', '40506070', 'San Martín 890', 'CABA', 'Ciudad Autónoma de Buenos Aires', 'domicilio', 'Diego Ramírez', '50607080', 'Belgrano 321', 'Córdoba', 'Córdoba Capital', 'domicilio', '2024-01-15', '10:30', '2024-01-17', '16:00'),
    ('00000000-0000-0000-0000-000000000000', 'Alejandro Vega', '60708090', 'Rivadavia 456', 'Buenos Aires', 'Mar del Plata', 'domicilio', 'Sofía Morales', '70809010', 'Mitre 789', 'Buenos Aires', 'Bahía Blanca', 'domicilio', '2024-01-16', '08:00', '2024-01-18', '12:00'),
    ('00000000-0000-0000-0000-000000000000', 'Gabriela Castro', '80901020', 'Sarmiento 654', 'CABA', 'Ciudad Autónoma de Buenos Aires', 'domicilio', 'Martín Herrera', '90102030', 'Alsina 987', 'Santa Fe', 'Rosario', 'domicilio', '2024-01-16', '11:00', '2024-01-18', '15:30'),
    ('00000000-0000-0000-0000-000000000000', 'Fernando Blanco', '10203040', 'Libertador 123', 'Buenos Aires', 'Tigre', 'domicilio', 'Valeria Romero', '20304050', 'Independencia 456', 'Buenos Aires', 'San Isidro', 'domicilio', '2024-01-14', '07:30', '2024-01-15', '10:00')
    RETURNING id INTO orden_1, orden_2, orden_3, orden_4, orden_5;

    -- Obtener IDs de las órdenes insertadas
    SELECT id INTO orden_1 FROM public.ordenes_envio WHERE remitente_nombre = 'Roberto Pérez' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO orden_2 FROM public.ordenes_envio WHERE remitente_nombre = 'Carmen Torres' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO orden_3 FROM public.ordenes_envio WHERE remitente_nombre = 'Alejandro Vega' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO orden_4 FROM public.ordenes_envio WHERE remitente_nombre = 'Gabriela Castro' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO orden_5 FROM public.ordenes_envio WHERE remitente_nombre = 'Fernando Blanco' ORDER BY created_at DESC LIMIT 1;

    -- Insertar hojas de ruta
    INSERT INTO public.hojas_ruta (
        transportista_id, fecha, tipo_ruta, estado, observaciones, deposito_origen, deposito_destino
    ) VALUES
    (transportista_local_1, '2024-01-15', 'local_origen', 'completada', 'Recogida en CABA para múltiples envíos', NULL, NULL),
    (transportista_ld_1, '2024-01-15', 'larga_distancia', 'en_curso', 'Transporte CABA a La Plata', 'CABA, Ciudad Autónoma de Buenos Aires', 'La Plata, Buenos Aires'),
    (transportista_local_2, '2024-01-16', 'local_destino', 'planificada', 'Entrega final en La Plata', NULL, NULL),
    (transportista_ld_2, '2024-01-15', 'larga_distancia', 'en_curso', 'Transporte CABA a Córdoba', 'CABA, Ciudad Autónoma de Buenos Aires', 'Córdoba Capital, Córdoba'),
    (transportista_local_3, '2024-01-16', 'local_origen', 'planificada', 'Recogida en Mar del Plata', NULL, NULL);

    -- Obtener IDs de las hojas de ruta insertadas
    SELECT id INTO hoja_1 FROM public.hojas_ruta WHERE transportista_id = transportista_local_1 ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO hoja_2 FROM public.hojas_ruta WHERE transportista_id = transportista_ld_1 ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO hoja_3 FROM public.hojas_ruta WHERE transportista_id = transportista_local_2 ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO hoja_4 FROM public.hojas_ruta WHERE transportista_id = transportista_ld_2 ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO hoja_5 FROM public.hojas_ruta WHERE transportista_id = transportista_local_3 ORDER BY created_at DESC LIMIT 1;

    -- Relacionar órdenes con hojas de ruta
    INSERT INTO public.ordenes_hoja_ruta (
        hoja_ruta_id, orden_envio_id, orden_visita, tipo_visita, completado, observaciones
    ) VALUES
    (hoja_1, orden_1, 1, 'recogida', true, 'Recogida exitosa en Av. Corrientes'),
    (hoja_2, orden_1, 1, 'transporte', false, 'En tránsito hacia La Plata'),
    (hoja_3, orden_1, 1, 'entrega', false, 'Pendiente de entrega'),
    (hoja_1, orden_2, 2, 'recogida', true, 'Recogida exitosa en San Martín'),
    (hoja_4, orden_2, 1, 'transporte', false, 'En tránsito hacia Córdoba'),
    (hoja_5, orden_3, 1, 'recogida', false, 'Programada para mañana'),
    (hoja_1, orden_4, 3, 'recogida', true, 'Recogida exitosa en Sarmiento'),
    (hoja_1, orden_5, 4, 'entrega', true, 'Entrega completada exitosamente');

    -- Crear asociaciones entre hojas de ruta
    INSERT INTO public.hojas_ruta_asociaciones (
        hoja_ruta_local_origen_id, hoja_ruta_larga_distancia_id, hoja_ruta_local_destino_id, estado_asociacion
    ) VALUES
    (hoja_1, hoja_2, hoja_3, 'en_proceso'),
    (hoja_1, hoja_4, NULL, 'en_proceso');

    -- Insertar paquetes de prueba
    INSERT INTO public.paquetes (
        orden_envio_id, descripcion, peso_kg, largo_cm, ancho_cm, alto_cm, valor_declarado, fragil
    ) VALUES
    (orden_1, 'Documentos importantes', 0.5, 30, 25, 5, 100.00, false),
    (orden_2, 'Electrónicos - Tablet', 2.3, 35, 25, 3, 50000.00, true),
    (orden_3, 'Ropa y accesorios', 1.8, 40, 30, 15, 5000.00, false),
    (orden_4, 'Libros técnicos', 3.2, 25, 20, 10, 2500.00, false),
    (orden_5, 'Medicamentos', 0.8, 20, 15, 8, 1200.00, true);

END $$;