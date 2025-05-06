import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const clienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  razon_social: z.string().min(1, "La razón social es requerida"),
  rfc: z.string().min(12, "El RFC debe tener al menos 12 caracteres"),
  direccion_fiscal: z.string().min(1, "La dirección fiscal es requerida"),
  telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  email: z.string().email("El email no es válido"),
  tipo_cliente: z.enum(["Canal Tradicional", "Canal Moderno", "Industrial"]),
  contrato_comodato: z.any().optional(), // Archivo PDF
  imagen_negocio: z.any().optional(), // Imagen del negocio
  notas: z.string().optional(),
});

type ClienteFormValues = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  onSubmit: (data: ClienteFormValues) => void;
  isLoading?: boolean;
}

export function ClienteForm({ onSubmit, isLoading }: ClienteFormProps) {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la ventana modal
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: "",
      razon_social: "",
      rfc: "",
      direccion_fiscal: "",
      telefono: "",
      email: "",
      tipo_cliente: "Canal Tradicional",
      contrato_comodato: null,
      imagen_negocio: null,
      notas: "",
    },
  });

  const handleFileUpload = (fieldName: keyof ClienteFormValues) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(fieldName, file);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-polar-600 hover:bg-polar-700">
        Crear Cliente
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Formulario de Cliente</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="razon_social"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razón Social</FormLabel>
                        <FormControl>
                          <Input placeholder="Razón social del cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rfc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RFC</FormLabel>
                        <FormControl>
                          <Input placeholder="RFC del cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="direccion_fiscal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección Fiscal</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Dirección fiscal completa"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Teléfono de contacto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email de contacto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipo_cliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Cliente</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="border rounded-md p-2 w-full"
                          >
                            <option value="Canal Tradicional">Canal Tradicional</option>
                            <option value="Canal Moderno">Canal Moderno</option>
                            <option value="Industrial">Industrial</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Archivos</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contrato_comodato"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contrato Comodato (PDF)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload("contrato_comodato")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imagen_negocio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagen del Negocio</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload("imagen_negocio")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notas adicionales sobre el cliente"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Button
                type="submit"
                className="w-full bg-polar-600 hover:bg-polar-700"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar Cliente"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}