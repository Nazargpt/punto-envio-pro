import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Route, Package, Loader2, CheckCircle } from 'lucide-react';
import { useHojasRuta } from '@/hooks/useHojasRuta';
import { useAuth } from '@/contexts/AuthContext';

interface GenerarHojasRutaButtonProps {
  agenciaId: string;
  className?: string;
}

export const GenerarHojasRutaButton: React.FC<GenerarHojasRutaButtonProps> = ({ 
  agenciaId, 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const { generarHojasRutaAgencia, loading } = useHojasRuta();
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return null;
  }

  const handleGenerar = async () => {
    try {
      const result = await generarHojasRutaAgencia(agenciaId);
      setResultado(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setResultado(null);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          className={className}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Route className="mr-2 h-4 w-4" />
          )}
          Generar Hojas de Ruta
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Generar Hojas de Ruta
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {!resultado ? (
                <>
                  <p>
                    Este proceso creará automáticamente las hojas de ruta para todas las órdenes pendientes de esta agencia.
                  </p>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Package className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Se asignarán transportistas locales de origen y destino según zonas de cobertura</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Route className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Se asignarán transportistas de larga distancia según rutas configuradas</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Se crearán las asociaciones entre hojas de ruta para seguimiento completo</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <p className="text-sm text-muted-foreground">
                    ¿Está seguro que desea continuar?
                  </p>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-lg">¡Proceso Completado!</h3>
                  </div>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green-800 text-base">Resumen de Generación</CardTitle>
                    </CardHeader>
                    <CardContent className="text-green-700">
                      <p className="font-medium">
                        {resultado.hojas_creadas} hojas de ruta generadas exitosamente
                      </p>
                      <p className="text-sm mt-1">
                        Las órdenes han sido asignadas a los transportistas correspondientes
                      </p>
                    </CardContent>
                  </Card>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    Los transportistas ya pueden ver sus hojas de ruta asignadas en sus perfiles
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          {!resultado ? (
            <>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleGenerar} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  'Generar Hojas de Ruta'
                )}
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction onClick={handleClose} className="w-full">
              Cerrar
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};