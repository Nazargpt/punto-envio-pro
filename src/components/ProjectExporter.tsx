import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Copy, FileJson, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { generateProjectExport } from '@/utils/projectExporter';

interface ProjectExportData {
  metadata: {
    name: string;
    version: string;
    description: string;
    dependencies: string[];
    author?: string;
    exportedAt: string;
  };
  files: Record<string, string>;
  migrations: string[];
  modifications: any;
  featureFlags?: any[];
  instructions: string[];
}

const ProjectExporter: React.FC = () => {
  const [exportData, setExportData] = useState<ProjectExportData | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportMessage, setExportMessage] = useState('');
  const [step, setStep] = useState<'ready' | 'exporting' | 'complete'>('ready');

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setStep('exporting');
    setExportProgress(0);

    try {
      const data = await generateProjectExport((progress, message) => {
        setExportProgress(progress);
        setExportMessage(message);
      });

      setExportData(data);
      setStep('complete');
      toast.success('Exportación completada exitosamente');
    } catch (error) {
      console.error('Error durante la exportación:', error);
      toast.error('Error durante la exportación');
      setStep('ready');
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!exportData) return;

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `puntoenvio-export-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    toast.success('Archivo descargado exitosamente');
  }, [exportData]);

  const handleCopy = useCallback(() => {
    if (!exportData) return;

    const dataStr = JSON.stringify(exportData, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      toast.success('JSON copiado al portapapeles');
    }).catch(() => {
      toast.error('Error copiando al portapapeles');
    });
  }, [exportData]);

  const resetExporter = () => {
    setExportData(null);
    setStep('ready');
    setExportProgress(0);
    setExportMessage('');
  };

  if (step === 'ready') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileJson className="h-6 w-6 text-primary" />
              <CardTitle>Exportador de Proyecto PuntoEnvío</CardTitle>
            </div>
            <CardDescription>
              Genera un archivo JSON completo con todo el sistema PuntoEnvío para ser importado en otros proyectos de Lovable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Esta herramienta recopila todos los archivos, configuraciones, migraciones de base de datos
                e instrucciones necesarias para recrear completamente el sistema PuntoEnvío.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Qué incluye la exportación:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Código Fuente</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Todos los componentes, páginas, hooks y utilidades del sistema
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Base de Datos</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Esquema completo, tablas, funciones, triggers y políticas RLS
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Dependencias</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Lista completa de paquetes NPM necesarios
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Instrucciones</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Guía paso a paso para la importación completa
                    </p>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="flex justify-center">
                <Button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-8 py-2"
                  size="lg"
                >
                  <FileJson className="mr-2 h-4 w-4" />
                  Generar Exportación
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'exporting') {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileJson className="h-6 w-6 text-primary animate-pulse" />
              <CardTitle>Exportando Proyecto...</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={exportProgress} className="w-full" />
              <p className="text-center text-muted-foreground">
                {exportMessage}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'complete' && exportData) {
    const filePaths = Object.keys(exportData.files);
    
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <CardTitle>Exportación Completada</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar JSON
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </Button>
              </div>
            </div>
            <CardDescription>
              El proyecto {exportData.metadata.name} ha sido exportado exitosamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="files">Archivos</TabsTrigger>
                <TabsTrigger value="migrations">Migraciones</TabsTrigger>
                <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Información del Proyecto</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nombre:</strong> {exportData.metadata.name}</div>
                      <div><strong>Versión:</strong> {exportData.metadata.version}</div>
                      <div><strong>Exportado:</strong> {new Date(exportData.metadata.exportedAt).toLocaleString()}</div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Estadísticas</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Archivos: <Badge variant="secondary">{filePaths.length}</Badge></div>
                      <div>Migraciones: <Badge variant="secondary">{exportData.migrations.length}</Badge></div>
                      <div>Dependencias: <Badge variant="secondary">{exportData.metadata.dependencies.length}</Badge></div>
                      <div>Features: <Badge variant="secondary">{exportData.featureFlags?.length || 0}</Badge></div>
                    </div>
                  </Card>
                </div>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-sm text-muted-foreground">{exportData.metadata.description}</p>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Archivos Incluidos ({filePaths.length})</h3>
                </div>
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <div className="space-y-2">
                    {filePaths.map((filePath, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <code className="bg-muted px-2 py-1 rounded text-xs">{filePath}</code>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="migrations" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Migraciones de Base de Datos ({exportData.migrations.length})</h3>
                </div>
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {exportData.migrations.map((migration, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-semibold mb-2">Migración {index + 1}</h4>
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                          {migration.substring(0, 200)}...
                        </pre>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="instructions" className="space-y-4">
                <h3 className="text-lg font-semibold">Instrucciones de Importación</h3>
                <Card className="p-4">
                  <ol className="space-y-2">
                    {exportData.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Badge variant="outline" className="min-w-fit">{index + 1}</Badge>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              </TabsContent>

              <TabsContent value="json" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">JSON de Exportación</h3>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Archivo muy grande - se muestra solo un preview
                    </AlertDescription>
                  </Alert>
                </div>
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <pre className="text-xs">
                    {JSON.stringify(exportData, null, 2).substring(0, 2000)}...
                  </pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />
            
            <div className="flex justify-center">
              <Button onClick={resetExporter} variant="outline">
                Nueva Exportación
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default ProjectExporter;