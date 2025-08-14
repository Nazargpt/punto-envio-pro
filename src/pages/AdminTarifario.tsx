import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Save, Plus, Trash2, DollarSign, MapPin, Grid3X3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Rangos de peso predefinidos
const PESO_RANGOS = [
  { min: 0, max: 5, label: '0 - 5 kg' },
  { min: 5, max: 10, label: '5 - 10 kg' },
  { min: 10, max: 15, label: '10 - 15 kg' },
  { min: 15, max: 20, label: '15 - 20 kg' },
  { min: 20, max: 25, label: '20 - 25 kg' },
];

interface TarifaItem {
  id?: string;
  provincia_origen: string;
  provincia_destino: string;
  peso_min: number;
  peso_max: number;
  precio: number;
}

interface ZonaTarifaria {
  id: string;
  nombre: string;
  descripcion: string;
  multiplicador: number;
  precio_base_0_5kg: number;
  precio_base_5_10kg: number;
  precio_base_10_15kg: number;
  precio_base_15_20kg: number;
  precio_base_20_25kg: number;
  activo: boolean;
}

interface MatrizProvinciaZona {
  id?: string;
  provincia_origen: string;
  provincia_destino: string;
  zona_id: string | null;
  activo: boolean;
}

const PROVINCIAS_ARGENTINA = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 
  'Tierra del Fuego', 'Tucumán'
];

const AdminTarifario: React.FC = () => {
  const [provincias, setProvincias] = useState<Array<{id: string, nombre: string}>>([]);
  const [provinciaOrigen, setProvinciaOrigen] = useState('');
  const [provinciaDestino, setProvinciaDestino] = useState('');
  const [tarifas, setTarifas] = useState<TarifaItem[]>([]);
  const [precios, setPrecios] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  
  // Estados para zonas tarifarias
  const [zonasTarifarias, setZonasTarifarias] = useState<ZonaTarifaria[]>([]);
  const [nuevaZona, setNuevaZona] = useState<Partial<ZonaTarifaria>>({
    nombre: '',
    descripcion: '',
    multiplicador: 1.0,
    precio_base_0_5kg: 0,
    precio_base_5_10kg: 0,
    precio_base_10_15kg: 0,
    precio_base_15_20kg: 0,
    precio_base_20_25kg: 0,
    activo: true
  });
  
  // Estados para matriz provincia-zona
  const [matrizProvincias, setMatrizProvincias] = useState<MatrizProvinciaZona[]>([]);
  const [editandoMatriz, setEditandoMatriz] = useState(false);
  
  const { toast } = useToast();

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar provincias
        const { data: provinciasData, error: provinciasError } = await supabase
          .from('provincias')
          .select('id, nombre')
          .order('nombre');

        if (provinciasError) throw provinciasError;
        setProvincias(provinciasData || []);

        // Cargar zonas tarifarias
        const { data: zonasData, error: zonasError } = await supabase
          .from('zonas_tarifarias')
          .select('*')
          .eq('activo', true)
          .order('nombre');

        if (zonasError) throw zonasError;
        setZonasTarifarias(zonasData || []);

        // Cargar matriz de provincias
        await cargarMatrizProvincias();

      } catch (error) {
        console.error('Error cargando datos:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos",
          variant: "destructive"
        });
      }
    };

    cargarDatos();
  }, [toast]);

  const cargarMatrizProvincias = async () => {
    try {
      const { data, error } = await supabase
        .from('matriz_provincias_zonas')
        .select('*');

      if (error) throw error;
      setMatrizProvincias(data || []);
    } catch (error) {
      console.error('Error cargando matriz:', error);
    }
  };

  // Cargar tarifas de zona cuando se seleccionan las provincias
  useEffect(() => {
    if (provinciaOrigen && provinciaDestino) {
      cargarTarifasDeZona();
    }
  }, [provinciaOrigen, provinciaDestino, matrizProvincias, zonasTarifarias]);

  const cargarTarifasDeZona = async () => {
    try {
      setLoading(true);
      
      // Obtener la zona asignada para esta ruta
      const zonaId = obtenerZonaParaRuta(provinciaOrigen, provinciaDestino);
      
      if (zonaId) {
        // Buscar la zona en el estado
        const zona = zonasTarifarias.find(z => z.id === zonaId);
        
        if (zona) {
          // Mapear los precios de la zona a los rangos de peso
          const preciosDeZona: {[key: string]: string} = {
            '0-5': zona.precio_base_0_5kg.toString(),
            '5-10': zona.precio_base_5_10kg.toString(),
            '10-15': zona.precio_base_10_15kg.toString(),
            '15-20': zona.precio_base_15_20kg.toString(),
            '20-25': zona.precio_base_20_25kg.toString(),
          };
          
          setPrecios(preciosDeZona);
        } else {
          // Si no se encuentra la zona, limpiar precios
          setPrecios({});
        }
      } else {
        // Si no hay zona asignada, verificar si hay tarifas individuales guardadas
        const { data, error } = await supabase
          .from('tarifas')
          .select('*')
          .eq('provincia_origen', provinciaOrigen)
          .eq('provincia_destino', provinciaDestino);

        if (error) throw error;

        // Crear un mapa de precios existentes
        const preciosExistentes: {[key: string]: string} = {};
        
        PESO_RANGOS.forEach(rango => {
          const tarifaExistente = data?.find(t => 
            t.precio_por_kg === rango.min && 
            t.precio_por_km === rango.max
          );
          
          const key = `${rango.min}-${rango.max}`;
          preciosExistentes[key] = tarifaExistente ? tarifaExistente.precio_base.toString() : '';
        });

        setPrecios(preciosExistentes);
      }
    } catch (error) {
      console.error('Error cargando tarifas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las tarifas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrecioChange = (rangoKey: string, valor: string) => {
    setPrecios(prev => ({
      ...prev,
      [rangoKey]: valor
    }));
  };

  const guardarTarifas = async () => {
    if (!provinciaOrigen || !provinciaDestino) {
      toast({
        title: "Error",
        description: "Debe seleccionar provincia de origen y destino",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Primero eliminar tarifas existentes para esta ruta
      await supabase
        .from('tarifas')
        .delete()
        .eq('provincia_origen', provinciaOrigen)
        .eq('provincia_destino', provinciaDestino);

      // Crear nuevas tarifas
      const nuevasTarifas = PESO_RANGOS
        .filter(rango => {
          const key = `${rango.min}-${rango.max}`;
          return precios[key] && parseFloat(precios[key]) > 0;
        })
        .map(rango => {
          const key = `${rango.min}-${rango.max}`;
          return {
            provincia_origen: provinciaOrigen,
            provincia_destino: provinciaDestino,
            precio_base: parseFloat(precios[key]),
            precio_por_kg: rango.min, // Usamos esto para almacenar el peso mínimo
            precio_por_km: rango.max,  // Usamos esto para almacenar el peso máximo
            activo: true
          };
        });

      if (nuevasTarifas.length > 0) {
        const { error } = await supabase
          .from('tarifas')
          .insert(nuevasTarifas);

        if (error) throw error;
      }

      toast({
        title: "Éxito",
        description: `Se guardaron ${nuevasTarifas.length} tarifas correctamente`,
      });

    } catch (error) {
      console.error('Error guardando tarifas:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las tarifas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setPrecios({});
    setProvinciaOrigen('');
    setProvinciaDestino('');
  };

  // Funciones para gestión de zonas
  const guardarZona = async () => {
    if (!nuevaZona.nombre || !nuevaZona.descripcion) {
      toast({
        title: "Error",
        description: "Complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('zonas_tarifarias')
        .insert([{
          nombre: nuevaZona.nombre!,
          descripcion: nuevaZona.descripcion!,
          multiplicador: nuevaZona.multiplicador!,
          precio_base_0_5kg: nuevaZona.precio_base_0_5kg!,
          precio_base_5_10kg: nuevaZona.precio_base_5_10kg!,
          precio_base_10_15kg: nuevaZona.precio_base_10_15kg!,
          precio_base_15_20kg: nuevaZona.precio_base_15_20kg!,
          precio_base_20_25kg: nuevaZona.precio_base_20_25kg!,
          activo: nuevaZona.activo!
        }])
        .select()
        .single();

      if (error) throw error;

      setZonasTarifarias(prev => [...prev, data]);
      setNuevaZona({
        nombre: '',
        descripcion: '',
        multiplicador: 1.0,
        precio_base_0_5kg: 0,
        precio_base_5_10kg: 0,
        precio_base_10_15kg: 0,
        precio_base_15_20kg: 0,
        precio_base_20_25kg: 0,
        activo: true
      });

      toast({
        title: "Éxito",
        description: "Zona tarifaria creada correctamente"
      });
    } catch (error) {
      console.error('Error guardando zona:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la zona tarifaria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const actualizarZonaEnMatriz = async (origen: string, destino: string, zonaId: string | null) => {
    try {
      const existeRegistro = matrizProvincias.find(
        m => m.provincia_origen === origen && m.provincia_destino === destino
      );

      if (existeRegistro) {
        const { error } = await supabase
          .from('matriz_provincias_zonas')
          .update({ zona_id: zonaId })
          .eq('id', existeRegistro.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('matriz_provincias_zonas')
          .insert([{
            provincia_origen: origen,
            provincia_destino: destino,
            zona_id: zonaId,
            activo: true
          }]);

        if (error) throw error;
      }

      await cargarMatrizProvincias();
    } catch (error) {
      console.error('Error actualizando matriz:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la matriz",
        variant: "destructive"
      });
    }
  };

  const obtenerZonaParaRuta = (origen: string, destino: string): string | null => {
    const registro = matrizProvincias.find(
      m => m.provincia_origen === origen && m.provincia_destino === destino
    );
    return registro?.zona_id || null;
  };

  const obtenerNombreZona = (zonaId: string | null): string => {
    if (!zonaId) return 'Sin asignar';
    const zona = zonasTarifarias.find(z => z.id === zonaId);
    return zona?.nombre || 'Desconocida';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calculator className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Tarifario por Peso</h1>
          <p className="text-muted-foreground">Sistema de zonas tarifarias y matriz de provincias</p>
        </div>
      </div>

      <Tabs defaultValue="zonas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zonas" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Zonas Tarifarias
          </TabsTrigger>
          <TabsTrigger value="matriz" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Matriz Provincias
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Configuración Individual
          </TabsTrigger>
        </TabsList>

        {/* Tab Zonas Tarifarias */}
        <TabsContent value="zonas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crear Nueva Zona */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nueva Zona Tarifaria
                </CardTitle>
                <CardDescription>
                  Define una nueva zona con precios base por rango de peso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      placeholder="Ej: Zona 1 - Nacional"
                      value={nuevaZona.nombre}
                      onChange={(e) => setNuevaZona(prev => ({ ...prev, nombre: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Multiplicador</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={nuevaZona.multiplicador}
                      onChange={(e) => setNuevaZona(prev => ({ ...prev, multiplicador: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Input
                    placeholder="Descripción de la zona"
                    value={nuevaZona.descripcion}
                    onChange={(e) => setNuevaZona(prev => ({ ...prev, descripcion: e.target.value }))}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Precios Base por Rango de Peso</Label>
                  {PESO_RANGOS.map((rango, index) => {
                    const field = `precio_base_${rango.min}_${rango.max}kg` as keyof ZonaTarifaria;
                    return (
                      <div key={rango.label} className="flex items-center gap-3">
                        <Label className="min-w-[100px] text-sm">{rango.label}</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">$</span>
                          <Input
                            type="number"
                            placeholder="0"
                            className="max-w-[120px]"
                            value={nuevaZona[field] as number || 0}
                            onChange={(e) => setNuevaZona(prev => ({ 
                              ...prev, 
                              [field]: parseFloat(e.target.value) || 0 
                            }))}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button onClick={guardarZona} disabled={loading} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Crear Zona'}
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Zonas Existentes */}
            <Card>
              <CardHeader>
                <CardTitle>Zonas Tarifarias Configuradas</CardTitle>
                <CardDescription>
                  Gestiona las zonas existentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {zonasTarifarias.map((zona) => (
                    <div key={zona.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{zona.nombre}</h4>
                        <span className="text-sm text-muted-foreground">
                          Multiplicador: {zona.multiplicador}x
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{zona.descripcion}</p>
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        <div>0-5kg: ${zona.precio_base_0_5kg}</div>
                        <div>5-10kg: ${zona.precio_base_5_10kg}</div>
                        <div>10-15kg: ${zona.precio_base_10_15kg}</div>
                        <div>15-20kg: ${zona.precio_base_15_20kg}</div>
                        <div>20-25kg: ${zona.precio_base_20_25kg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Matriz de Provincias */}
        <TabsContent value="matriz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Matriz Provincia a Provincia</span>
                <Button
                  variant="outline"
                  onClick={() => setEditandoMatriz(!editandoMatriz)}
                >
                  {editandoMatriz ? 'Finalizar Edición' : 'Editar Matriz'}
                </Button>
              </CardTitle>
              <CardDescription>
                Asigna zonas tarifarias para cada combinación de provincia origen-destino
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border text-xs">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left min-w-[120px]">Origen / Destino</th>
                      {PROVINCIAS_ARGENTINA.map(provincia => (
                        <th key={provincia} className="border border-border p-1 text-center min-w-[80px] writing-mode-vertical">
                          <div className="transform -rotate-90 whitespace-nowrap">{provincia}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PROVINCIAS_ARGENTINA.map(origen => (
                      <tr key={origen} className="hover:bg-muted/50">
                        <td className="border border-border p-2 font-medium bg-muted/50">
                          {origen}
                        </td>
                        {PROVINCIAS_ARGENTINA.map(destino => {
                          const zonaId = obtenerZonaParaRuta(origen, destino);
                          const nombreZona = obtenerNombreZona(zonaId);
                          
                          return (
                            <td key={`${origen}-${destino}`} className="border border-border p-1">
                              {editandoMatriz ? (
                                <Select
                                  value={zonaId || 'sin-asignar'}
                                  onValueChange={(value) => {
                                    const nuevaZonaId = value === 'sin-asignar' ? null : value;
                                    actualizarZonaEnMatriz(origen, destino, nuevaZonaId);
                                  }}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="z-50 max-h-48">
                                    <SelectItem value="sin-asignar">Sin asignar</SelectItem>
                                    {zonasTarifarias.map(zona => (
                                      <SelectItem key={zona.id} value={zona.id}>
                                        {zona.nombre}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div className={`text-center p-1 rounded text-xs ${
                                  zonaId ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                }`}>
                                  {nombreZona}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {!editandoMatriz && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>La matriz muestra la zona asignada para cada combinación origen-destino.</p>
                  <p>Haga clic en "Editar Matriz" para modificar las asignaciones.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Configuración Individual (código existente) */}
        <TabsContent value="individual" className="space-y-4">

          {/* Selección de Provincias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Configuración de Ruta Individual
              </CardTitle>
              <CardDescription>
                Configura tarifas específicas para una ruta origen-destino
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provincia-origen">Provincia de Origen</Label>
                  <Select value={provinciaOrigen} onValueChange={setProvinciaOrigen}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar provincia..." />
                    </SelectTrigger>
                    <SelectContent className="z-50 max-h-60">
                      {provincias.map((provincia) => (
                        <SelectItem key={provincia.id} value={provincia.nombre}>
                          {provincia.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia-destino">Provincia de Destino</Label>
                  <Select value={provinciaDestino} onValueChange={setProvinciaDestino}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar provincia..." />
                    </SelectTrigger>
                    <SelectContent className="z-50 max-h-60">
                      {provincias.map((provincia) => (
                        <SelectItem key={provincia.id} value={provincia.nombre}>
                          {provincia.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {provinciaOrigen && provinciaDestino && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">
                    Ruta seleccionada: <span className="text-primary">{provinciaOrigen}</span> → <span className="text-primary">{provinciaDestino}</span>
                  </p>
                  {(() => {
                    const zonaAsignada = obtenerZonaParaRuta(provinciaOrigen, provinciaDestino);
                    return zonaAsignada ? (
                      <p className="text-sm text-muted-foreground mt-1">
                        Zona asignada en matriz: <span className="font-medium">{obtenerNombreZona(zonaAsignada)}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-amber-600 mt-1">
                        ⚠️ Esta ruta no tiene zona asignada en la matriz
                      </p>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabla de Tarifas por Peso */}
          {provinciaOrigen && provinciaDestino && (
            <Card>
              <CardHeader>
                <CardTitle>Tarifas por Rango de Peso</CardTitle>
                <CardDescription>
                  {(() => {
                    const zonaAsignada = obtenerZonaParaRuta(provinciaOrigen, provinciaDestino);
                    return zonaAsignada 
                      ? `Precios cargados automáticamente desde: ${obtenerNombreZona(zonaAsignada)}`
                      : "Configure una zona en la matriz o defina precios individuales";
                  })()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const zonaAsignada = obtenerZonaParaRuta(provinciaOrigen, provinciaDestino);
                    if (zonaAsignada) {
                      const zona = zonasTarifarias.find(z => z.id === zonaAsignada);
                      return (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-800">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Zona: {zona?.nombre}</span>
                          </div>
                          <p className="text-sm text-blue-600 mt-1">{zona?.descripcion}</p>
                          <p className="text-xs text-blue-500 mt-1">
                            Multiplicador de zona: {zona?.multiplicador}x
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Rango de Peso</TableHead>
                        <TableHead>Precio Base (ARS)</TableHead>
                        <TableHead>Precio Final (ARS)</TableHead>
                        <TableHead className="w-[100px]">Origen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PESO_RANGOS.map((rango) => {
                        const key = `${rango.min}-${rango.max}`;
                        const precioBase = precios[key] || '';
                        const zonaAsignada = obtenerZonaParaRuta(provinciaOrigen, provinciaDestino);
                        const zona = zonaAsignada ? zonasTarifarias.find(z => z.id === zonaAsignada) : null;
                        const multiplicador = zona?.multiplicador || 1;
                        const precioFinal = precioBase ? (parseFloat(precioBase) * multiplicador).toFixed(2) : '';
                        const tienePrecio = precioBase && parseFloat(precioBase) > 0;
                        const esDeZona = zonaAsignada && tienePrecio;

                        return (
                          <TableRow key={key}>
                            <TableCell className="font-medium">
                              {rango.label}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">$</span>
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  value={precioBase}
                                  onChange={(e) => handlePrecioChange(key, e.target.value)}
                                  className="max-w-[150px]"
                                  min="0"
                                  step="0.01"
                                  disabled={esDeZona}
                                />
                              </div>
                              {esDeZona && (
                                <p className="text-xs text-blue-600 mt-1">
                                  Valor de zona tarifaria
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-green-600">
                                {precioFinal ? `$${precioFinal}` : '-'}
                              </span>
                              {multiplicador !== 1 && precioFinal && (
                                <p className="text-xs text-muted-foreground">
                                  (${precioBase} × {multiplicador})
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                esDeZona 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : tienePrecio
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {esDeZona ? 'Zona' : tienePrecio ? 'Manual' : 'Sin precio'}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={guardarTarifas} 
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Guardando...' : 'Guardar Tarifas'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={limpiarFormulario}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Limpiar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resumen */}
          {provinciaOrigen && provinciaDestino && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Configuración</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ruta</p>
                    <p className="font-medium">{provinciaOrigen} → {provinciaDestino}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rangos Configurados</p>
                    <p className="font-medium">
                      {Object.values(precios).filter(p => p && parseFloat(p) > 0).length} de {PESO_RANGOS.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Precio Promedio</p>
                    <p className="font-medium">
                      ${Object.values(precios)
                        .filter(p => p && parseFloat(p) > 0)
                        .reduce((sum, p) => sum + parseFloat(p), 0) / 
                        Math.max(1, Object.values(precios).filter(p => p && parseFloat(p) > 0).length)
                      } ARS
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTarifario;