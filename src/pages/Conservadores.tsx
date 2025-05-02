
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConservadorCard, ConservadorData } from "@/components/conservadores/ConservadorCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

// Datos de ejemplo para conservadores
const conservadoresData: ConservadorData[] = [
  {
    id: "2342",
    modelo: "FrioMax 3000",
    capacidad: "500L",
    cliente: "Supermercados Norte",
    ubicacion: "Av. Principal #123, Centro",
    estado: "activo",
    ultimoMantenimiento: "15/04/2023",
  },
  {
    id: "1820",
    modelo: "IceCold XL",
    capacidad: "750L",
    cliente: "Tiendas Express",
    ubicacion: "Calle Reforma #45, Juárez",
    estado: "mantenimiento",
    ultimoMantenimiento: "02/03/2023",
  },
  {
    id: "3188",
    modelo: "FrioMax 2500",
    capacidad: "350L",
    cliente: "Cafetería El Mirador",
    ubicacion: "Plaza Central #8, Centro",
    estado: "activo",
    ultimoMantenimiento: "20/04/2023",
  },
  {
    id: "2754",
    modelo: "IceCold Standard",
    capacidad: "250L",
    cliente: "Restaurante La Terraza",
    ubicacion: "Av. de los Pinos #67, Las Flores",
    estado: "inactivo",
    ultimoMantenimiento: "10/01/2023",
  },
  {
    id: "4102",
    modelo: "FrioMax 3000",
    capacidad: "500L",
    cliente: "Hotel Panorama",
    ubicacion: "Blvd. Costero #215, Zona Turística",
    estado: "activo",
    ultimoMantenimiento: "05/04/2023",
  },
  {
    id: "1567",
    modelo: "IceCold XL",
    capacidad: "750L",
    cliente: "Supermercado El Ahorro",
    ubicacion: "Calle Morelos #78, Centro",
    estado: "activo",
    ultimoMantenimiento: "28/03/2023",
  },
];

const Conservadores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredConservadores = conservadoresData.filter((conservador) => {
    // Filtro por término de búsqueda
    const matchesSearch =
      conservador.id.includes(searchTerm) ||
      conservador.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conservador.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conservador.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por estado
    const matchesStatus =
      statusFilter === "todos" || conservador.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, cliente o ubicación..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center">
            <Select
              defaultValue="todos"
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="mantenimiento">En mantenimiento</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Nuevo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConservadores.map((conservador) => (
          <ConservadorCard key={conservador.id} conservador={conservador} />
        ))}
      </div>

      {filteredConservadores.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No se encontraron conservadores</h3>
          <p className="text-muted-foreground mt-1">
            Intenta cambiar los filtros o términos de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default Conservadores;
