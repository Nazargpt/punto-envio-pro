import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Map, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Agencia {
  direccion: string;
  localidad: string;
  provincia: string;
}

const agenciasData: Agencia[] = [
  { direccion: "San Martin 501", localidad: "Azul", provincia: "Buenos Aires" },
  { direccion: "Gascon 1090", localidad: "Baradero", provincia: "Buenos Aires" },
  { direccion: "Calle 410 n°1015", localidad: "Berazategui-J.M.Gutierrez", provincia: "Buenos Aires" },
  { direccion: "av rivadavia 4215", localidad: "Capital Federal", provincia: "Buenos Aires" },
  { direccion: "Av.directorio 5787", localidad: "Capital Federal", provincia: "Buenos Aires" },
  { direccion: "Av.San Martin 1779", localidad: "Caseros", provincia: "Buenos Aires" },
  { direccion: "pringles 4017", localidad: "Caseros", provincia: "Buenos Aires" },
  { direccion: "Calle 522,N°618", localidad: "El Pato", provincia: "Buenos Aires" },
  { direccion: "Santa Sofia 715", localidad: "Florencio Varela", provincia: "Buenos Aires" },
  { direccion: "Rivadavia 597", localidad: "General Villegas", provincia: "Buenos Aires" },
  { direccion: "Lacarra 1852", localidad: "Gerli", provincia: "Buenos Aires" },
  { direccion: "felipe lavallol 1299", localidad: "Isidro Casanova", provincia: "Buenos Aires" },
  { direccion: "Rivadavia 277", localidad: "Junin", provincia: "Buenos Aires" },
  { direccion: "Belgrano 1190", localidad: "Lujan", provincia: "Buenos Aires" },
  { direccion: "Nuestras Malvinas 282", localidad: "Monte Grande", provincia: "Buenos Aires" },
  { direccion: "H.Yrigoyen 1075", localidad: "Moron", provincia: "Buenos Aires" },
  { direccion: "Av. San Martin 3278", localidad: "Rafael Calzada", provincia: "Buenos Aires" },
  { direccion: "Buenos aires 629", localidad: "salto", provincia: "Buenos Aires" },
  { direccion: "Calle 4 n°2416", localidad: "San Clemente del tuyu", provincia: "Buenos Aires" },
  { direccion: "SobreMonte 1635", localidad: "San Fernando", provincia: "Buenos Aires" },
  { direccion: "Calle 893,n°5435", localidad: "San Francisco Solano", provincia: "Buenos Aires" },
  { direccion: "Ricardo balbin 3135", localidad: "San Martin", provincia: "Buenos Aires" },
  { direccion: "Paseo 105 n°311", localidad: "Villa Gesel", provincia: "Buenos Aires" },
  { direccion: "Julio Besada 6946", localidad: "3 De febrero", provincia: "Buenos Aires" },
  { direccion: "Catamarca 3947", localidad: "Costa Azul", provincia: "Buenos Aires" },
  { direccion: "Cnel Dielia 3873", localidad: "Lanús", provincia: "Buenos Aires" },
  { direccion: "Avellaneda 5365", localidad: "Olavarria", provincia: "Buenos Aires" },
  { direccion: "Lavalle 474", localidad: "Quilmes", provincia: "Buenos Aires" },
  { direccion: "Av.santa maria de las conchas 2613", localidad: "Tigre", provincia: "Buenos Aires" },
  { direccion: "Av.Remedios de Escalada 4283", localidad: "Valentin Alsina", provincia: "Buenos Aires" },
  { direccion: "Mozart 1480", localidad: "Los polvorines", provincia: "Buenos Aires" },
  { direccion: "Calle 889", localidad: "Solano", provincia: "Buenos Aires" }
];

export const MapaAgenciasDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const initializeMap = async () => {
    if (!mapboxToken.trim()) {
      toast({
        title: "Token requerido",
        description: "Por favor ingresa tu token de Mapbox",
        variant: "destructive",
      });
      return;
    }

    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-58.3816, -34.6037], // Buenos Aires center
        zoom: 8
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for each agency
      const geocodePromises = agenciasData.map(async (agencia, index) => {
        const address = `${agencia.direccion}, ${agencia.localidad}, ${agencia.provincia}, Argentina`;
        
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}&country=AR&limit=1`
          );
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            
            // Create popup content
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-sm">${agencia.localidad}</h3>
                <p class="text-xs text-gray-600">${agencia.direccion}</p>
                <p class="text-xs text-gray-500">${agencia.provincia}</p>
              </div>
            `);

            // Create marker
            new mapboxgl.Marker({
              color: '#3B82F6'
            })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current!);
          }
        } catch (error) {
          console.error(`Error geocoding address: ${address}`, error);
        }
      });

      await Promise.all(geocodePromises);
      setShowTokenInput(false);

      toast({
        title: "Mapa cargado",
        description: `Se mostraron ${agenciasData.length} agencias en el mapa`,
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Error al inicializar el mapa. Verifica tu token de Mapbox.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      setShowTokenInput(true);
      setMapboxToken('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-20 flex-col w-full">
          <Map className="h-6 w-6 mb-2" />
          <span>Mapa de Agencias</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa Interactivo de Agencias
          </DialogTitle>
        </DialogHeader>
        
        {showTokenInput ? (
          <div className="space-y-4 p-4">
            <div className="text-sm text-muted-foreground">
              Para mostrar el mapa, necesitas un token público de Mapbox. 
              Puedes obtenerlo gratis en{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ingresa tu token público de Mapbox..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && initializeMap()}
              />
              <Button onClick={initializeMap}>
                Cargar Mapa
              </Button>
            </div>
          </div>
        ) : (
          <div ref={mapContainer} className="w-full h-full rounded-lg" />
        )}
      </DialogContent>
    </Dialog>
  );
};