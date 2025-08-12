import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, Save, Plus, Trash2, DollarSign } from 'lucide-react';
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

const AdminTarifario: React.FC = () => {
  const [provincias, setProvincias] = useState<Array<{id: string, nombre: string}>>([]);
  const [provinciaOrigen, setProvinciaOrigen] = useState('');
  const [provinciaDestino, setProvinciaDestino] = useState('');
  const [tarifas, setTarifas] = useState<TarifaItem[]>([]);
  const [precios, setPrecios] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Cargar provincias
  useEffect(() => {
    const cargarProvincias = async () => {
      try {
        const { data, error } = await supabase
          .from('provincias')
          .select('id, nombre')
          .order('nombre');

        if (error) throw error;
        setProvincias(data || []);
      } catch (error) {
        console.error('Error cargando provincias:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las provincias",
          variant: "destructive"
        });
      }
    };

    cargarProvincias();
  }, [toast]);

  // Cargar tarifas existentes cuando se seleccionan las provincias
  useEffect(() => {
    if (provinciaOrigen && provinciaDestino) {
      cargarTarifasExistentes();
    }
  }, [provinciaOrigen, provinciaDestino]);

  const cargarTarifasExistentes = async () => {
    try {
      setLoading(true);
      
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
    } catch (error) {
      console.error('Error cargando tarifas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las tarifas existentes",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calculator className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Tarifario por Peso</h1>
          <p className="text-muted-foreground">Gestiona las tarifas según rangos de peso y provincias</p>
        </div>
      </div>

      {/* Selección de Provincias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuración de Ruta
          </CardTitle>
          <CardDescription>
            Selecciona las provincias de origen y destino para configurar las tarifas
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
                <SelectContent>
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
                <SelectContent>
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
              Define los precios para cada rango de peso en pesos argentinos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Rango de Peso</TableHead>
                    <TableHead>Precio (ARS)</TableHead>
                    <TableHead className="w-[100px]">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PESO_RANGOS.map((rango) => {
                    const key = `${rango.min}-${rango.max}`;
                    const precio = precios[key] || '';
                    const tienePrecio = precio && parseFloat(precio) > 0;

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
                              value={precio}
                              onChange={(e) => handlePrecioChange(key, e.target.value)}
                              className="max-w-[150px]"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            tienePrecio 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {tienePrecio ? 'Configurado' : 'Sin precio'}
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
    </div>
  );
};

export default AdminTarifario;