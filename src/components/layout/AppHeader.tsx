import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Search, Calculator, MapPin, Building2, Truck, Shield, User, Home, LogOut, LogIn } from 'lucide-react';
import { AuthForm } from '@/components/auth/AuthForm';
import { cn } from '@/lib/utils';

const AppHeader: React.FC = () => {
  const { user, signOut, isDevMode } = useAuth();
  const location = useLocation();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

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
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/lovable-uploads/ee738c9e-a12c-41a3-b383-9a9759cfa8f3.png" alt="PuntoEnvío" className="h-8" />
          </div>

          {/* Navigation Menu and Action Buttons - All in one line */}
          <div className="flex items-center space-x-1">
            {/* Navigation Links - hidden on small screens */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 px-2 text-white hover:bg-gray-800 text-xs",
                        isActive && "bg-gray-800 text-white"
                      )}
                    >
                      <Icon className="mr-1 h-3 w-3" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
              
              {/* Separator */}
              <div className="w-px h-6 bg-gray-600 mx-2" />
            </div>

            {/* Three colored buttons - always visible */}
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-2 text-xs"
            >
              <Building2 className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Agencias</span>
            </Button>
            
            <Button 
              size="sm" 
              className="bg-orange-600 hover:bg-orange-700 text-white h-8 px-2 text-xs"
            >
              <Truck className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Transportistas</span>
            </Button>
            
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white h-8 px-2 text-xs"
            >
              <Shield className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </div>

          {/* User Menu and Login */}
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-white hover:bg-gray-800 h-8 px-2">
                    <User className="h-3 w-3" />
                    <span className="hidden sm:inline text-xs">{user?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white z-50">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user?.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {isDevMode ? 'Modo Desarrollo - SUPERADMIN' : 'Administrador'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex items-center">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {isDevMode ? 'Salir del Modo Dev' : 'Cerrar Sesión'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="bg-black hover:bg-gray-900 text-white border border-gray-600 h-8 w-8 p-0"
                  >
                    <LogIn className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center">Acceso al Sistema</DialogTitle>
                  </DialogHeader>
                  <AuthForm onSuccess={() => setAuthDialogOpen(false)} />
                </DialogContent>
              </Dialog>
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