import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, DollarSign, Package, Globe, Upload, Download } from 'lucide-react';

const Tarifas: React.FC = () => {
  const [selectedOrigen, setSelectedOrigen] = useState('Buenos Aires');

  const provincias = [
    'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
    'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza',
    'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
    'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego',
    'Tucumán', 'CABA'
  ];

  const rangoPesos = ['0-5kg', '5-10kg', '10-15kg', '15-20kg', '20-25kg'];

  // Mock data para tarifas interprovinciales
  const tarifasInterprovinciales = {
    'Buenos Aires': {
      'Córdoba': { '0-5kg': 2500, '5-10kg': 3200, '10-15kg': 4100, '15-20kg': 4800, '20-25kg': 5500 },
      'Santa Fe': { '0-5kg': 2200, '5-10kg': 2900, '10-15kg': 3700, '15-20kg': 4300, '20-25kg': 4900 },
      'Mendoza': { '0-5kg': 3500, '5-10kg': 4400, '10-15kg': 5600, '15-20kg': 6500, '20-25kg': 7300 },
      'Tucumán': { '0-5kg': 3800, '5-10kg': 4800, '10-15kg': 6100, '15-20kg': 7100, '20-25kg': 8000 }
    }
  };

  const mockTarifasLocales = [
    {
      agencia: 'Agencia Central CABA',
      zona: 'Palermo',
      rango: '0-5kg',
      precio: 800,
      seguro: '2%',
      admin: 150
    },
    {
      agencia: 'Agencia Central CABA',
      zona: 'Belgrano',
      rango: '0-5kg',
      precio: 850,
      seguro: '2%',
      admin: 150
    },
    {
      agencia: 'Agencia Córdoba Norte',
      zona: 'Nueva Córdoba',
      rango: '0-5kg',
      precio: 600,
      seguro: '2%',
      admin: 120
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tarifas</h1>
          <p className="text-muted-foreground">Gestiona tarifas locales e interprovinciales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarifa Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3.240</div>
            <p className="text-xs text-muted-foreground">Por envío 0-5kg</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rutas Configuradas</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92</div>
            <p className="text-xs text-muted-foreground">De 552 posibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zonas Locales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Ajuste</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5%</div>
            <p className="text-xs text-muted-foreground">Hace 7 días</p>
          </CardContent>
        </Card>
      </div>

      {/* Tarifas Tabs */}
      <Tabs defaultValue="interprovinciales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interprovinciales">Interprovinciales</TabsTrigger>
          <TabsTrigger value="locales">Locales</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="interprovinciales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Tarifas Interprovinciales</CardTitle>
              <CardDescription>
                Configura tarifas por provincia origen y destino para cada rango de peso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selector de Provincia Origen */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="provincia-origen">Provincia de Origen</Label>
                  <select
                    id="provincia-origen"
                    className="w-full p-2 border border-input rounded-md"
                    value={selectedOrigen}
                    onChange={(e) => setSelectedOrigen(e.target.value)}
                  >
                    {provincias.map(provincia => (
                      <option key={provincia} value={provincia}>{provincia}</option>
                    ))}
                  </select>
                </div>
                <Button>Cargar Fila Completa</Button>
              </div>

              {/* Matriz de Tarifas */}
              <div className="overflow-x-auto">
                <table className="w-full border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Destino</th>
                      {rangoPesos.map(rango => (
                        <th key={rango} className="border border-border p-2 text-center">
                          {rango}
                        </th>
                      ))}
                      <th className="border border-border p-2 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provincias.filter(p => p !== selectedOrigen).slice(0, 5).map(destino => (
                      <tr key={destino} className="hover:bg-muted/50">
                        <td className="border border-border p-2 font-medium">{destino}</td>
                        {rangoPesos.map(rango => {
                          const tarifa = tarifasInterprovinciales[selectedOrigen]?.[destino]?.[rango];
                          return (
                            <td key={rango} className="border border-border p-1">
                              <Input
                                type="number"
                                value={tarifa || ''}
                                placeholder="0"
                                className="w-20 text-center"
                              />
                            </td>
                          );
                        })}
                        <td className="border border-border p-2 text-center">
                          <Button variant="outline" size="sm">Guardar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-sm text-muted-foreground">
                Mostrando 5 de {provincias.length - 1} provincias destino. 
                Usar paginación para ver todas las rutas.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tarifas Locales por Zona</CardTitle>
              <CardDescription>
                Configura tarifas para entregas locales por agencia y zona
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filtros */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="agencia-filter">Filtrar por Agencia</Label>
                    <select
                      id="agencia-filter"
                      className="w-full p-2 border border-input rounded-md"
                    >
                      <option value="">Todas las agencias</option>
                      <option value="central">Agencia Central CABA</option>
                      <option value="cordoba">Agencia Córdoba Norte</option>
                      <option value="rosario">Agencia Rosario</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Nueva Tarifa Local
                    </Button>
                  </div>
                </div>

                {/* Tabla de Tarifas Locales */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Agencia</th>
                        <th className="text-left p-2">Zona</th>
                        <th className="text-left p-2">Rango Peso</th>
                        <th className="text-left p-2">Precio Base</th>
                        <th className="text-left p-2">Seguro %</th>
                        <th className="text-left p-2">Gastos Admin</th>
                        <th className="text-left p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTarifasLocales.map((tarifa, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2">{tarifa.agencia}</td>
                          <td className="p-2">{tarifa.zona}</td>
                          <td className="p-2">{tarifa.rango}</td>
                          <td className="p-2">${tarifa.precio}</td>
                          <td className="p-2">{tarifa.seguro}</td>
                          <td className="p-2">${tarifa.admin}</td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">Editar</Button>
                              <Button variant="outline" size="sm">Eliminar</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>
                Parámetros globales para el cálculo de tarifas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="iva">IVA (%)</Label>
                  <Input id="iva" type="number" defaultValue="21" />
                </div>
                
                <div>
                  <Label htmlFor="seguro-base">Seguro Base (%)</Label>
                  <Input id="seguro-base" type="number" defaultValue="2" />
                </div>
                
                <div>
                  <Label htmlFor="gastos-admin">Gastos Administrativos Base</Label>
                  <Input id="gastos-admin" type="number" defaultValue="150" />
                </div>
                
                <div>
                  <Label htmlFor="termosellado-max">Límite Termosellado (% del flete)</Label>
                  <Input id="termosellado-max" type="number" defaultValue="10" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ajustes Masivos</h3>
                
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label htmlFor="ajuste-porcentaje">Ajuste Porcentual</Label>
                      <Input id="ajuste-porcentaje" type="number" placeholder="5" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="aplicar-a">Aplicar a</Label>
                      <select className="w-full p-2 border border-input rounded-md">
                        <option value="todas">Todas las tarifas</option>
                        <option value="interprovinciales">Solo interprovinciales</option>
                        <option value="locales">Solo locales</option>
                      </select>
                    </div>
                    <Button>Aplicar Ajuste</Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Este ajuste se aplicará a todas las tarifas seleccionadas. 
                    Use valores negativos para reducir precios.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Guardar Configuración</Button>
                <Button variant="outline">Restaurar Valores por Defecto</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tarifas;