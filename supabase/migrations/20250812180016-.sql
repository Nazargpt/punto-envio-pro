-- Crear tabla de transportistas
CREATE TABLE public.transportistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  documento TEXT NOT NULL UNIQUE,
  telefono TEXT,
  email TEXT,
  licencia_conducir TEXT,
  fecha_vencimiento_licencia DATE,
  activo BOOLEAN DEFAULT true,
  calificacion DECIMAL(3,2) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de vehículos
CREATE TABLE public.vehiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transportista_id UUID REFERENCES public.transportistas(id) ON DELETE CASCADE,
  patente TEXT NOT NULL UNIQUE,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  año INTEGER,
  tipo_vehiculo TEXT NOT NULL CHECK (tipo_vehiculo IN ('moto', 'auto', 'van', 'camion')),
  capacidad_kg DECIMAL(8,2),
  capacidad_m3 DECIMAL(8,2),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de tarifas por zona
CREATE TABLE public.tarifas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provincia_origen TEXT NOT NULL,
  provincia_destino TEXT NOT NULL,
  localidad_origen TEXT,
  localidad_destino TEXT,
  precio_base DECIMAL(10,2) NOT NULL,
  precio_por_kg DECIMAL(10,2) DEFAULT 0,
  precio_por_km DECIMAL(10,2) DEFAULT 0,
  tiempo_estimado_horas INTEGER DEFAULT 24,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(provincia_origen, provincia_destino, localidad_origen, localidad_destino)
);

-- Crear tabla de paquetes/items de cada orden
CREATE TABLE public.paquetes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_envio_id UUID REFERENCES public.ordenes_envio(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  peso_kg DECIMAL(8,2),
  largo_cm DECIMAL(8,2),
  ancho_cm DECIMAL(8,2),
  alto_cm DECIMAL(8,2),
  valor_declarado DECIMAL(10,2),
  fragil BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de seguimiento detallado
CREATE TABLE public.seguimiento_detallado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_envio_id UUID REFERENCES public.ordenes_envio(id) ON DELETE CASCADE,
  estado TEXT NOT NULL,
  descripcion TEXT,
  ubicacion TEXT,
  fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT now(),
  transportista_id UUID REFERENCES public.transportistas(id),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de incidencias
CREATE TABLE public.incidencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_envio_id UUID REFERENCES public.ordenes_envio(id) ON DELETE CASCADE,
  tipo_incidencia TEXT NOT NULL CHECK (tipo_incidencia IN ('retraso', 'daño', 'perdida', 'direccion_incorrecta', 'destinatario_ausente', 'otro')),
  descripcion TEXT NOT NULL,
  estado TEXT DEFAULT 'abierta' CHECK (estado IN ('abierta', 'en_proceso', 'resuelta')),
  prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta')),
  reportado_por TEXT,
  asignado_a TEXT,
  fecha_resolucion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de hojas de ruta
CREATE TABLE public.hojas_ruta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transportista_id UUID REFERENCES public.transportistas(id) ON DELETE CASCADE,
  vehiculo_id UUID REFERENCES public.vehiculos(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  estado TEXT DEFAULT 'planificada' CHECK (estado IN ('planificada', 'en_curso', 'completada', 'cancelada')),
  km_inicial DECIMAL(10,2),
  km_final DECIMAL(10,2),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de órdenes en hoja de ruta
CREATE TABLE public.ordenes_hoja_ruta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hoja_ruta_id UUID REFERENCES public.hojas_ruta(id) ON DELETE CASCADE,
  orden_envio_id UUID REFERENCES public.ordenes_envio(id) ON DELETE CASCADE,
  orden_visita INTEGER NOT NULL,
  tipo_visita TEXT NOT NULL CHECK (tipo_visita IN ('recoleccion', 'entrega')),
  completado BOOLEAN DEFAULT false,
  hora_planificada TIME,
  hora_real TIME,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(hoja_ruta_id, orden_envio_id, tipo_visita)
);