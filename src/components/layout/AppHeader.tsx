import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Package, MapPin, Users, TrendingUp, AlertTriangle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppHeader: React.FC = () => {
  const { user, signOut, isDevMode } = useAuth();
  const location = useLocation();

  const navItems = [
    { 
      title: "Dashboard", 
      path: "/", 
      icon: Home 
    },
    { 
      title: "Órdenes", 
      path: "/ordenes", 
      icon: Package 
    },
    { 
      title: "Hojas de Ruta", 
      path: "/hojas-ruta", 
      icon: MapPin 
    },
    { 
      title: "Transportistas", 
      path: "/transportistas", 
      icon: Users 
    },
    { 
      title: "Tarifas", 
      path: "/tarifas", 
      icon: TrendingUp 
    },
    { 
      title: "Incidencias", 
      path: "/incidencias", 
      icon: AlertTriangle 
    }
  ];

  return (
    <header className="bg-card border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/ee738c9e-a12c-41a3-b383-9a9759cfa8f3.png" alt="PuntoEnvío" className="h-8" />
            <div>
              <h1 className="text-xl font-bold">PuntoEnvío</h1>
              <p className="text-xs text-muted-foreground">Sistema de Cargas</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-9 px-3",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-sm">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {isDevMode ? 'Modo Desarrollo - SUPERADMIN' : 'Administrador'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              {isDevMode ? 'Salir del Modo Dev' : 'Cerrar Sesión'}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-2"
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