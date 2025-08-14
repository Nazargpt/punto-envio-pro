import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Search, Calculator, MapPin, Building2, Truck, Shield, LogIn, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const AppHeader: React.FC = () => {
  const location = useLocation();
  const { user, signOut, isAdmin, isSuperAdmin } = useAuth();

  const navItems = [
    { 
      title: "Crear Orden de Envío", 
      path: "/crear-orden", 
      icon: Package 
    },
    { 
      title: "Seguimiento", 
      path: "/seguimiento", 
      icon: Search 
    },
    { 
      title: "Cotizador", 
      path: "/cotizador", 
      icon: Calculator 
    },
    { 
      title: "Buscar Agencias", 
      path: "/buscar-agencias", 
      icon: MapPin 
    }
  ];

  return (
    <header className="bg-black border-b border-gray-800">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img src="/lovable-uploads/ee738c9e-a12c-41a3-b383-9a9759cfa8f3.png" alt="PuntoEnvío" className="h-8 cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
          </div>

          {/* Navigation Menu and Action Buttons - All inline */}
          <div className="flex items-center gap-2">
            {/* Navigation Links */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 px-2 text-white hover:bg-gray-800 text-xs hidden lg:flex",
                      isActive && "bg-gray-800 text-white"
                    )}
                  >
                    <Icon className="mr-1 h-3 w-3" />
                    {item.title}
                  </Button>
                </Link>
              );
            })}

            {/* Admin buttons - only show if user is authenticated and has admin role */}
            {user && isAdmin() && (
              <>
                <Link to="/admin/agencias">
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 text-xs"
                  >
                    <Building2 className="mr-1 h-3 w-3" />
                    <span className="hidden md:inline">Agencias</span>
                  </Button>
                </Link>
                
                <Link to="/transportistas">
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700 text-white h-7 px-2 text-xs"
                  >
                    <Truck className="mr-1 h-3 w-3" />
                    <span className="hidden md:inline">Transportistas</span>
                  </Button>
                </Link>
                
                <Link to="/admin">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white h-7 px-2 text-xs"
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    <span className="hidden md:inline">Admin</span>
                  </Button>
                </Link>
              </>
            )}

            {/* Authentication buttons */}
            {user ? (
              <Button
                onClick={signOut}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white h-7 px-2 text-xs"
              >
                <LogOut className="mr-1 h-3 w-3" />
                <span className="hidden md:inline">Salir</span>
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white h-7 px-2 text-xs"
                >
                  <LogIn className="mr-1 h-3 w-3" />
                  <span className="hidden md:inline">Ingresar</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden mt-4 flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-2 text-white hover:bg-gray-800",
                    isActive && "bg-gray-800 text-white"
                  )}
                >
                  <Icon className="mr-1 h-3 w-3" />
                  <span className="text-xs">{item.title}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;