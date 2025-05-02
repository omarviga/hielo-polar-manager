
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLocation } from "react-router-dom";

// Helper function to format the pathname
const formatPathname = (pathname: string) => {
  if (pathname === "/") return "Dashboard";
  
  const path = pathname.slice(1);
  return path.charAt(0).toUpperCase() + path.slice(1);
};

export default function Header() {
  const location = useLocation();
  const pageTitle = formatPathname(location.pathname);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <h1 className="text-xl font-semibold">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-hielo-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium">Notificaciones</h3>
              <div className="space-y-2">
                <div className="rounded-md bg-accent p-3">
                  <p className="font-medium text-sm">Conservador requiere mantenimiento</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    El conservador #2342 en Supermercados Norte requiere revisión.
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-medium text-sm">Registro de nuevo conservador</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Se ha completado el registro del conservador #3188.
                  </p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
