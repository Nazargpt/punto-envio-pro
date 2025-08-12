import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="/lovable-uploads/2b896867-2539-4b4e-8e0a-14d4fec450a4.png" 
                alt="Punto Envío Logo" 
                className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          
          {/* Company Information */}
          <div className="text-center md:text-right space-y-2">
            <div className="text-sm">
              <strong>Domicilio:</strong> Av. Brasil 2335, Parque Patricios, CABA, Buenos Aires, Argentina
            </div>
            <div className="text-sm">
              <strong>Código Postal:</strong> 1260
            </div>
            <div className="text-sm">
              <strong>Teléfono:</strong> +54 9 11 3056 1116
            </div>
            <div className="text-sm">
              <strong>Email:</strong> admin@puntoenvio.com
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;