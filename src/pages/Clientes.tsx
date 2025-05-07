import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ClienteForm } from "@/components/clientes/ClienteForm";

interface Cliente {
  id: string;
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  direccion: string;
  conservadores: number;
  negocioImagen?: File | null;
  contratoPdf?: File | null;
}

// Datos de ejemplo
const clientesData: Cliente[] = [
  // ... (tus datos existentes de clientes)
];

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState(clientesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const agregarCliente = (nuevoCliente: Omit<Cliente, "id">) => {
    const nuevoId = `C${(clientes.length + 1).toString().padStart(3, "0")}`;
    const clienteCompleto = { ...nuevoCliente, id: nuevoId };

    setClientes([...clientes, clienteCompleto]);
    setIsDialogOpen(false);
  };

  const filteredClientes = clientes.filter((cliente) =>
    Object.values(cliente).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-polar-600 hover:bg-polar-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <Tabs defaultValue="list-view" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="list-view">Lista de Clientes</TabsTrigger>
          <TabsTrigger value="add-client">Agregar Cliente</TabsTrigger>
        </TabsList>

        <TabsContent value="list-view">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                Visualice todos los clientes registrados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full md:w-96 mb-4">
                <Input
                  placeholder="Buscar clientes..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div> {/* Asegúrate de que esta etiqueta de cierre esté presente */}
              <ul className="space-y-4">
                {filteredClientes.map((cliente) => (
                  <li key={cliente.id} className="border p-4 rounded-md">
                    <h3 className="font-bold">{cliente.nombre}</h3>
                    <p>Contacto: {cliente.contacto}</p>
                    <p>Email: {cliente.email}</p>
                    <p>Teléfono: {cliente.telefono}</p>
                    <p>Dirección: {cliente.direccion}</p>
                    <p>Conservadores: {cliente.conservadores}</p>
                    {cliente.negocioImagen && (
                      <img
                        src={URL.createObjectURL(cliente.negocioImagen)}
                        alt="Imagen del negocio"
                        className="w-32 h-32 object-cover mt-2"
                      />
                    )}
                    {cliente.contratoPdf && (
                      <a
                        href={URL.createObjectURL(cliente.contratoPdf)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline mt-2 block"
                      >
                        Ver Contrato
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-client">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nuevo Cliente</CardTitle>
              <CardDescription>
                Complete el formulario para registrar un nuevo cliente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClienteForm
                onSuccess={() => {
                  agregarCliente(/* lógica para obtener los datos del cliente */);
                }}
                onCancel={() => setIsDialogOpen(false)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <ClienteForm
            onSuccess={() => {
              agregarCliente(/* lógica para obtener los datos del cliente */);
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clientes;
