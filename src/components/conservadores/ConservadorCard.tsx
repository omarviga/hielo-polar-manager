
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, QrCode, Wrench, FileText } from "lucide-react";

export interface ConservadorData {
  id: string;
  modelo: string;
  capacidad: string;
  cliente: string;
  ubicacion: string;
  estado: "activo" | "mantenimiento" | "inactivo";
  ultimoMantenimiento: string;
}

interface ConservadorCardProps {
  conservador: ConservadorData;
}

export function ConservadorCard({ conservador }: ConservadorCardProps) {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "mantenimiento":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "inactivo":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Conservador #{conservador.id}</CardTitle>
          <Badge className={getStatusColor(conservador.estado)}>
            {conservador.estado.charAt(0).toUpperCase() + conservador.estado.slice(1)}
          </Badge>
        </div>
        <CardDescription>{conservador.modelo}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <div>
          <p className="font-medium text-sm">Capacidad</p>
          <p className="text-sm text-muted-foreground">{conservador.capacidad}</p>
        </div>
        <div>
          <p className="font-medium text-sm">Cliente</p>
          <p className="text-sm text-muted-foreground">{conservador.cliente}</p>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-sm text-muted-foreground">{conservador.ubicacion}</p>
        </div>
        <div>
          <p className="font-medium text-sm">Último mantenimiento</p>
          <p className="text-sm text-muted-foreground">{conservador.ultimoMantenimiento}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" className="w-full">
          <FileText className="h-4 w-4 mr-1" />
          Detalles
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <QrCode className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Wrench className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
