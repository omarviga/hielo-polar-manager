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
import { Plus, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Esquema de validación con Zod
const formSchema = z.object({
  numero_serie: z.string().min(4, "Mínimo 4 caracteres"),
  modelo: z.string().min(2, "Mínimo 2 caracteres"),
  capacidad: z.string().min(1, "Requerido"),
  estado: z.enum(["activo", "mantenimiento", "inactivo"]),
  notas: z.string().optional(),
  productividad: z.object({
    ventas_mensuales: z.number().min(0, "Mínimo 0"),
    rotacion_inventario: z.number().min(0, "Mínimo 0"),
    ocupacion_promedio: z.number().min(0).max(100, "Máximo 100%"),
    costos_mantenimiento: z.number().min(0, "Mínimo 0"),
    ingresos_generados: z.number().min(0, "Mínimo 0"),
    observaciones: z.string().optional(),
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
});

type FormValues = z.infer<typeof formSchema>;

export function ConservadorForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado: "activo",
      productividad: {
        ventas_mensuales: 0,
        rotacion_inventario: 0,
        ocupacion_promedio: 0,
        costos_mantenimiento: 0,
        ingresos_generados: 0,
      },
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Datos del formulario:", data);
    onSuccess();
  };

  return (
    <ScrollArea className="h-[80vh]">
      <div className="p-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda - Datos básicos */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>Datos principales del conservador</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="numero_serie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Serie</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de serie" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input placeholder="Modelo del conservador" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacidad</FormLabel>
                        <FormControl>
                          <Input placeholder="Capacidad en litros" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="activo">
                              <Badge variant="default">Activo</Badge>
                            </SelectItem>
                            <SelectItem value="mantenimiento">
                              <Badge variant="secondary">En Mantenimiento</Badge>
                            </SelectItem>
                            <SelectItem value="inactivo">
                              <Badge variant="destructive">Inactivo</Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notas adicionales"
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
            </div>

            {/* Columna derecha - Métricas y Ubicación */}
            <div className="space-y-6">
              {/* Card de Métricas */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Métricas de Productividad</CardTitle>
                      <CardDescription>Indicadores de rendimiento</CardDescription>
                    </div>
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="productividad.ventas_mensuales"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ventas Mensuales</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Promedio mensual</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productividad.rotacion_inventario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rotación de Inventario</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Veces por mes</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="productividad.ocupacion_promedio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ocupación Promedio</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Porcentaje de ocupación</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="productividad.costos_mantenimiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Costos de Mantenimiento</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productividad.ingresos_generados"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ingresos Generados</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="productividad.observaciones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observaciones</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observaciones sobre rendimiento"
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

              {/* Card de Ubicación */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Ubicación</CardTitle>
                      <CardDescription>Dirección del conservador</CardDescription>
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
                          <FormLabel>Municipio/Alcaldía</FormLabel>
                          <FormControl>
                            <Input placeholder="Municipio o alcaldía" {...field} />
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
                        <FormLabel>Referencias</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Referencias para ubicar el conservador"
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
            </div>

            {/* Botones de acción */}
            <div className="md:col-span-2 flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                <Plus className="h-4 w-4 mr-1" />
                Guardar Conservador
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}
