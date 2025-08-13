import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, Clock, Shield, MapPin, Users, CheckCircle, Phone } from 'lucide-react';
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

  const services = [
    {
      icon: Package,
      title: "Gestión de Encomiendas",
      description: "Control completo de paquetes desde el origen hasta el destino final"
    },
    {
      icon: Truck,
      title: "Transporte Especializado",
      description: "Flota de vehículos adaptados para cada tipo de carga"
    },
    {
      icon: Clock,
      title: "Entregas Rápidas",
      description: "Tiempos de entrega optimizados con seguimiento en tiempo real"
    },
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description: "Protección total de mercadería con seguro incluido"
    },
    {
      icon: MapPin,
      title: "Cobertura Nacional",
      description: "Llegamos a todo el país con nuestra red de distribución"
    },
    {
      icon: Users,
      title: "Equipo Profesional",
      description: "Personal capacitado y experimentado en logística"
    },
    {
      icon: CheckCircle,
      title: "Calidad Certificada",
      description: "Procesos certificados bajo normas internacionales"
    },
    {
      icon: Phone,
      title: "Soporte 24/7",
      description: "Atención al cliente disponible las 24 horas del día"
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section with Carousel */}
      <section className="relative h-[70vh] overflow-hidden">
          <Carousel 
            className="w-full h-full"
            opts={{
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 6000,
              }),
            ]}
          >
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
      
      {/* Services Section */}
      <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos soluciones integrales de logística y transporte con la más alta calidad y eficiencia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
    </div>
  );
};

export default Index;