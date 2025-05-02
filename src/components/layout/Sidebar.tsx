
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Menu, 
  X, 
  Package, 
  Users, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  Wrench,
  QrCode,
  ChartBar
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Conservadores", path: "/conservadores", icon: Package },
  { name: "Clientes", path: "/clientes", icon: Users },
  { name: "Mantenimiento", path: "/mantenimiento", icon: Wrench },
  { name: "Reportes", path: "/reportes", icon: FileText },
  { name: "Estadísticas", path: "/estadisticas", icon: ChartBar },
  { name: "QR Codes", path: "/qr", icon: QrCode },
  { name: "Configuración", path: "/configuracion", icon: Settings },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar border-r shadow-sm transition-all duration-300",
          expanded ? "w-64" : "w-20",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 border-b px-4">
          <div className={cn("flex items-center", !expanded && "hidden")}>
            <div className="h-8 w-8 rounded-md bg-hielo-700 flex items-center justify-center text-white font-bold mr-2">
              HP
            </div>
            <span className="font-semibold text-lg">Hielo Polar</span>
          </div>
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="hidden md:flex"
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <Button
            onClick={toggleMobileSidebar}
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <X />
          </Button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-all",
                location.pathname === item.path
                  ? "bg-hielo-100 text-hielo-700 font-medium"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              <item.icon className={cn("h-5 w-5", location.pathname === item.path && "text-hielo-700")} />
              {expanded && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t">
          <div className={cn("flex items-center", !expanded && "justify-center")}>
            <div className="rounded-full h-8 w-8 bg-hielo-800 flex items-center justify-center text-white">
              A
            </div>
            {expanded && (
              <div className="ml-2">
                <p className="font-medium text-sm">Administrador</p>
                <p className="text-xs text-muted-foreground">admin@hielopolar.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
