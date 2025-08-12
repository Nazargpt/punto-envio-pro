import React from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import heroWarehouse from '@/assets/hero-warehouse.jpg';
import heroDrivers from '@/assets/hero-drivers.jpg';
import heroStaff from '@/assets/hero-staff.jpg';

const Index = () => {
  const heroImages = [
    {
      src: heroWarehouse,
      alt: "Depósito de encomiendas con personal organizando paquetes",
      title: "Gestión de Almacén",
      description: "Control total de tu inventario y encomiendas"
    },
    {
      src: heroDrivers,
      alt: "Transportistas profesionales bajando de camiones",
      title: "Red de Transportistas",
      description: "Conectamos con los mejores profesionales del transporte"
    },
    {
      src: heroStaff,
      alt: "Personal de PuntoEnvío trabajando con documentos y cajas",
      title: "Equipo Profesional",
      description: "Personal capacitado para un servicio de excelencia"
    }
  ];

  return (
    <div className="min-h-screen bg-muted/50">
      <AppHeader />
      <main>
        {/* Hero Section with Carousel */}
        <section className="relative h-[70vh] overflow-hidden">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {heroImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[70vh] w-full">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white space-y-4 max-w-2xl px-6">
                        <h1 className="text-4xl md:text-6xl font-bold">{image.title}</h1>
                        <p className="text-lg md:text-xl text-white/90">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>
      </main>
    </div>
  );
};

export default Index;