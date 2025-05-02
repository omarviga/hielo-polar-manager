
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function LocationMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubicación de Conservadores</CardTitle>
        <CardDescription>Distribución geográfica de los equipos</CardDescription>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="bg-gray-200 h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-hielo-600" />
            <p className="text-sm font-medium">Vista previa del mapa</p>
            <p className="text-xs text-muted-foreground mt-1">
              (Se integrará con API de mapas)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
