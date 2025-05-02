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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Phone, Mail, MapPin, Package, X } from "lucide-react";

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
  // ... (tus datos existentes de clientes)
];

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState(clientesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState<Omit<Cliente, 'id'>>({
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    conservadores: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarCliente = () => {
    const nuevoId = `C${(clientes.length + 1).toString().padStart(3, '0')}`;
    const clienteCompleto = { ...nuevoCliente, id: nuevoId };

    setClientes([...clientes, clienteCompleto]);
    setIsDialogOpen(false);
    setNuevoCliente({
      nombre: '',
      contacto: '',
      email: '',
      telefono: '',
      direccion: '',
      conservadores: 0
    });
  };

  const filteredClientes = clientes.filter((cliente) =>
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={nuevoCliente.nombre}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contacto" className="text-right">
                  Contacto
                </Label>
                <Input
                  id="contacto"
                  name="contacto"
                  value={nuevoCliente.contacto}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={nuevoCliente.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={nuevoCliente.telefono}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direccion" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={nuevoCliente.direccion}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="conservadores" className="text-right">
                  Conservadores
                </Label>
                <Input
                  id="conservadores"
                  name="conservadores"
                  type="number"
                  value={nuevoCliente.conservadores}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={agregarCliente}>Guardar Cliente</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ... (el resto de tu código existente para mostrar los clientes) ... */}
    </div>
  );
};

export default Clientes;