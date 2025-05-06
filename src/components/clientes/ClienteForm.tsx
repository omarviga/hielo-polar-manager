import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MapPin, User, Store, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Esquema de validación con Zod
const formSchema = z.object({
  negocio: z.object({
    nombre: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
    imagen: z.instanceof(File).optional(),
    tipo_negocio: z.enum(["restaurante", "abarrotes", "tienda", "supermercado", "otro"]),
    rfc: z.string().min(12, "Mínimo 12 caracteres").max(13, "Máximo 13 caracteres").optional(),
    giro: z.string().min(3, "Mínimo 3 caracteres").optional(),
  }),
  responsable: z.object({
    nombre: z.string().min(2, "Mínimo 2 caracteres").max(50, "Máximo 50 caracteres"),
    apellidos: z.string().min(2, "Mínimo 2 caracteres").max(50, "Máximo 50 caracteres"),
    puesto: z.string().min(3, "Mínimo 3 caracteres").optional(),
  }),
  contacto: z.object({
    email: z.string().email("Email inválido"),
    telefono: z.string().min(10, "Mínimo 10 dígitos").max(15, "Máximo 15 dígitos"),
    whatsapp: z.string().min(10, "Mínimo 10 dígitos").max(15, "Máximo 15 dígitos").optional(),
  }),
  ubicacion: z.object({
    calle: z.string().min(3, "Mínimo 3 caracteres"),
    numero_ext: z.string().min(1, "Requerido"),
    numero_int: z.string().optional(),
    colonia: z.string().min(3, "Mínimo 3 caracteres"),
    municipio: z.string().min(3, "Mínimo 3 caracteres"),
    estado: z.string().min(3, "Mínimo 3 caracteres"),
    cp: z.string().length(5, "Debe tener 5 dígitos"),
    referencias: z.string().optional(),
  }),
  documentacion: z.object({
    contrato_comodato: z.instanceof(File, { message: "El contrato comodato es requerido" }),
    identificacion: z.instanceof(File, { message: "La identificación es requerida" }),
    comprobante_domicilio: z.instanceof(File, { message: "El comprobante de domicilio es requerido" }),
  }),
  notas: z.string().max(500, "Máximo 500 caracteres").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ClienteForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      negocio: {
        tipo_negocio: "tienda",
      },
      contacto: {
        email: "",
        telefono: "",
      },
      ubicacion: {
        calle: "",
        numero_ext: "",
        colonia: "",
        municipio: "",
        estado: "",
        cp: "",
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    // Convertimos el objeto a FormData para enviar los archivos
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue instanceof File) {
            formData.append(`${key}.${subKey}`, subValue);
          } else {
            formData.append(`${key}.${subKey}`, JSON.stringify(subValue));
          }
        });
      } else {
        formData.append(key, JSON.stringify(value));
      }
    });

    console.log("Datos del formulario:", data);
    onSuccess();
  };

  return (
    <ScrollArea className="h-[80vh]">
      <div className="p-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda - Datos del Negocio y Responsable */}
            <div className="space-y-6">
              {/* Card de Negocio */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Datos del Negocio</CardTitle>
                      <CardDescription>Información comercial</CardDescription>
                    </div>
                    <Store className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="negocio.nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Negocio</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre comercial" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="negocio.imagen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagen del Negocio</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="negocio.tipo_negocio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Negocio</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="restaurante">Restaurante</SelectItem>
                            <SelectItem value="abarrotes">Abarrotes</SelectItem>
                            <SelectItem value="tienda">Tienda</SelectItem>
                            <SelectItem value="supermercado">Supermercado</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="negocio.rfc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RFC (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="RFC del negocio" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="negocio.giro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giro (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Giro comercial" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Card de Responsable */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Datos del Responsable</CardTitle>
                      <CardDescription>Persona a cargo</CardDescription>
                    </div>
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="responsable.nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre(s)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="responsable.apellidos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellidos</FormLabel>
                          <FormControl>
                            <Input placeholder="Apellidos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="responsable.puesto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puesto (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Puesto o cargo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Columna derecha - Contacto, Ubicación y Documentación */}
            <div className="space-y-6">
              {/* Card de Contacto */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Información de Contacto</CardTitle>
                      <CardDescription>Medios para comunicación</CardDescription>
                    </div>
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contacto.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="correo@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contacto.telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="10 dígitos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contacto.whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="10 dígitos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Card de Ubicación */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Ubicación del Negocio</CardTitle>
                      <CardDescription>Dirección física</CardDescription>
                    </div>
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ubicacion.calle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calle</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre de la calle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ubicacion.numero_ext"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número Exterior</FormLabel>
                          <FormControl>
                            <Input placeholder="Número exterior" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ubicacion.numero_int"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número Interior (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Número interior" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ubicacion.colonia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Colonia</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre de la colonia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ubicacion.municipio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Municipio/Comunidad</FormLabel>
                          <FormControl>
                            <Input placeholder="Municipio o comunidad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ubicacion.estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="Estado" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ubicacion.cp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código Postal</FormLabel>
                        <FormControl>
                          <Input placeholder="5 dígitos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ubicacion.referencias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referencias (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Referencias para ubicar el negocio"
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

              {/* Card de Documentación */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Documentación</CardTitle>
                      <CardDescription>Archivos requeridos</CardDescription>
                    </div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="documentacion.contrato_comodato"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contrato Comodato*</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documentacion.identificacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Identificación Oficial*</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documentacion.comprobante_domicilio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comprobante de Domicilio*</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Botones de acción */}
            <div className="md:col-span-2 flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                <Plus className="h-4 w-4 mr-1" />
                Guardar Cliente
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}