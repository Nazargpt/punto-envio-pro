import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Map, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Agencia {
  direccion: string;
  localidad: string;
  provincia: string;
  lat?: number;
  lng?: number;
}

const agenciasData: Agencia[] = [
  { direccion: "San Martin 501", localidad: "Azul", provincia: "Buenos Aires", lat: -36.7770, lng: -59.8581 },
  { direccion: "Gascon 1090", localidad: "Baradero", provincia: "Buenos Aires", lat: -33.7544, lng: -59.5044 },
  { direccion: "Calle 410 n°1015", localidad: "Berazategui-J.M.Gutierrez", provincia: "Buenos Aires", lat: -34.7574, lng: -58.2091 },
  { direccion: "av rivadavia 4215", localidad: "Capital Federal", provincia: "Buenos Aires", lat: -34.6118, lng: -58.4173 },
  { direccion: "Av.directorio 5787", localidad: "Capital Federal", provincia: "Buenos Aires", lat: -34.6404, lng: -58.4683 },
  { direccion: "Av.San Martin 1779", localidad: "Caseros", provincia: "Buenos Aires", lat: -34.6063, lng: -58.5639 },
  { direccion: "pringles 4017", localidad: "Caseros", provincia: "Buenos Aires", lat: -34.6063, lng: -58.5639 },
  { direccion: "Calle 522,N°618", localidad: "El Pato", provincia: "Buenos Aires", lat: -34.7574, lng: -58.2091 },
  { direccion: "Santa Sofia 715", localidad: "Florencio Varela", provincia: "Buenos Aires", lat: -34.7991, lng: -58.2764 },
  { direccion: "Rivadavia 597", localidad: "General Villegas", provincia: "Buenos Aires", lat: -35.0297, lng: -63.0110 },
  { direccion: "Lacarra 1852", localidad: "Gerli", provincia: "Buenos Aires", lat: -34.6774, lng: -58.3816 },
  { direccion: "felipe lavallol 1299", localidad: "Isidro Casanova", provincia: "Buenos Aires", lat: -34.6695, lng: -58.5445 },
  { direccion: "Rivadavia 277", localidad: "Junin", provincia: "Buenos Aires", lat: -34.5858, lng: -60.9428 },
  { direccion: "Belgrano 1190", localidad: "Lujan", provincia: "Buenos Aires", lat: -34.5664, lng: -59.1156 },
  { direccion: "Nuestras Malvinas 282", localidad: "Monte Grande", provincia: "Buenos Aires", lat: -34.8130, lng: -58.4658 },
  { direccion: "H.Yrigoyen 1075", localidad: "Moron", provincia: "Buenos Aires", lat: -34.6534, lng: -58.6198 },
  { direccion: "Av. San Martin 3278", localidad: "Rafael Calzada", provincia: "Buenos Aires", lat: -34.7892, lng: -58.3530 },
  { direccion: "Buenos aires 629", localidad: "salto", provincia: "Buenos Aires", lat: -34.2936, lng: -60.2423 },
  { direccion: "Calle 4 n°2416", localidad: "San Clemente del tuyu", provincia: "Buenos Aires", lat: -36.3597, lng: -56.7281 },
  { direccion: "SobreMonte 1635", localidad: "San Fernando", provincia: "Buenos Aires", lat: -34.4417, lng: -58.5597 },
  { direccion: "Calle 893,n°5435", localidad: "San Francisco Solano", provincia: "Buenos Aires", lat: -34.7825, lng: -58.3108 },
  { direccion: "Ricardo balbin 3135", localidad: "San Martin", provincia: "Buenos Aires", lat: -34.5736, lng: -58.5372 },
  { direccion: "Paseo 105 n°311", localidad: "Villa Gesel", provincia: "Buenos Aires", lat: -37.2647, lng: -56.9733 },
  { direccion: "Julio Besada 6946", localidad: "3 De febrero", provincia: "Buenos Aires", lat: -34.5986, lng: -58.5664 },
  { direccion: "Catamarca 3947", localidad: "Costa Azul", provincia: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  { direccion: "Cnel Dielia 3873", localidad: "Lanús", provincia: "Buenos Aires", lat: -34.7058, lng: -58.3928 },
  { direccion: "Avellaneda 5365", localidad: "Olavarria", provincia: "Buenos Aires", lat: -36.8927, lng: -60.3225 },
  { direccion: "Lavalle 474", localidad: "Quilmes", provincia: "Buenos Aires", lat: -34.7203, lng: -58.2538 },
  { direccion: "Av.santa maria de las conchas 2613", localidad: "Tigre", provincia: "Buenos Aires", lat: -34.4264, lng: -58.5797 },
  { direccion: "Av.Remedios de Escalada 4283", localidad: "Valentin Alsina", provincia: "Buenos Aires", lat: -34.6774, lng: -58.4086 },
  { direccion: "Mozart 1480", localidad: "Los polvorines", provincia: "Buenos Aires", lat: -34.5208, lng: -58.6931 },
  { direccion: "Calle 889", localidad: "Solano", provincia: "Buenos Aires", lat: -34.7825, lng: -58.3108 }
];

export const MapaAgenciasDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            Mapa Interactivo de Agencias ({agenciasData.length} ubicaciones)
          </DialogTitle>
        </DialogHeader>
        
        <div className="w-full h-full rounded-lg overflow-hidden">
          <MapContainer
            center={[-34.6037, -58.3816]}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {agenciasData.map((agencia, index) => (
              agencia.lat && agencia.lng && (
                <Marker key={index} position={[agencia.lat, agencia.lng]}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-semibold text-sm mb-1">{agencia.localidad}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{agencia.direccion}</p>
                      <p className="text-xs text-muted-foreground">{agencia.provincia}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};