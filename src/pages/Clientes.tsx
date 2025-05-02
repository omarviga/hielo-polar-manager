
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail, MapPin, Package } from "lucide-react";

interface Cliente {
  id: string;
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  direccion: string;
  conservadores: number;
}

// Datos de ejemplo
const clientesData: Cliente[] = [
  {
    id: "C001",
    nombre: "Supermercados Norte",
    contacto: "Juan Pérez",
    email: "juan.perez@norte.com",
    telefono: "+52 555 123 4567",
    direccion: "Av. Principal #123, Centro",
    conservadores: 12,
  },
  {
    id: "C002",
    nombre: "Tiendas Express",
    contacto: "María Rodríguez",
    email: "maria@tiendasexpress.mx",
    telefono: "+52 555 987 6543",
    direccion: "Calle Reforma #45, Juárez",
    conservadores: 8,
  },
  {
    id: "C003",
    nombre: "Cafetería El Mirador",
    contacto: "Roberto Gómez",
    email: "contacto@elmirador.com",
    telefono: "+52 555 456 7890",
    direccion: "Plaza Central #8, Centro",
    conservadores: 2,
  },
  {
    id: "C004",
    nombre: "Restaurante La Terraza",
    contacto: "Carmen López",
    email: "reservas@laterraza.mx",
    telefono: "+52 555 234 5678",
    direccion: "Av. de los Pinos #67, Las Flores",
    conservadores: 3,
  },
  {
    id: "C005",
    nombre: "Hotel Panorama",
    contacto: "Alejandro Díaz",
    email: "reservaciones@hotelpanorama.com",
    telefono: "+52 555 876 5432",
    direccion: "Blvd. Costero #215, Zona Turística",
    conservadores: 6,
  },
  {
    id: "C006",
    nombre: "Supermercado El Ahorro",
    contacto: "Laura Sánchez",
    email: "laura@elahorro.com.mx",
    telefono: "+52 555 345 6789",
    direccion: "Calle Morelos #78, Centro",
    conservadores: 10,
  },
];

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = clientesData.filter((cliente) =>
    Object.values(cliente).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id}>
            <CardHeader>
              <CardTitle>{cliente.nombre}</CardTitle>
              <CardDescription>ID: {cliente.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Contacto</p>
                <p className="text-sm text-muted-foreground">{cliente.contacto}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{cliente.telefono}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{cliente.email}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">{cliente.direccion}</p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Package className="h-4 w-4 text-hielo-600" />
                <p className="text-sm font-medium">{cliente.conservadores} conservadores</p>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Ver detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No se encontraron clientes</h3>
          <p className="text-muted-foreground mt-1">
            Intenta cambiar los términos de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default Clientes;
