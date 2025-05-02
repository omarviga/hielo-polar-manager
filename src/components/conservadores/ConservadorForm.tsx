import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']

const conservadorSchema = z.object({
  numero_serie: z.string().min(1, 'El número de serie es requerido'),
  modelo: z.string().min(1, 'El modelo es requerido'),
  capacidad: z.string().min(1, 'La capacidad es requerida'),
  cliente_id: z.string().uuid('Selecciona un cliente'),
  estado: z.enum(['activo', 'mantenimiento', 'inactivo']),
  // Campos detallados de ubicación
  ubicacion: z.object({
    calle: z.string().min(1, 'La calle es requerida'),
    numero_ext: z.string().min(1, 'El número exterior es requerido'),
    numero_int: z.string().optional(),
    colonia: z.string().min(1, 'La colonia es requerida'),
    municipio: z.string().min(1, 'El municipio es requerido'),
    estado: z.string().min(1, 'El estado es requerido'),
    cp: z.string().min(5, 'El código postal debe tener 5 dígitos'),
    referencias: z.string().optional(),
    coordenadas: z.object({
      latitud: z.number().optional(),
      longitud: z.number().optional(),
    }).optional(),
  }),
  // Métricas de productividad
  productividad: z.object({
    ventas_mensuales: z.number().min(0, 'Las ventas no pueden ser negativas'),
    rotacion_inventario: z.number().min(0, 'La rotación no puede ser negativa'),
    ocupacion_promedio: z.number().min(0).max(100, 'El porcentaje debe estar entre 0 y 100'),
    costos_mantenimiento: z.number().min(0, 'Los costos no pueden ser negativos'),
    ingresos_generados: z.number().min(0, 'Los ingresos no pueden ser negativos'),
    rentabilidad: z.number().optional(),
    historial_ventas: z.array(z.object({
      mes: z.string(),
      valor: z.number(),
    })).optional(),
    ultima_actualizacion: z.date().optional(),
    observaciones: z.string().optional(),
  }).optional(),
  notas: z.string().optional(),
})

type ConservadorFormValues = z.infer<typeof conservadorSchema>

interface ConservadorFormProps {
  conservador?: Tables['conservadores']['Row']
  onSubmit: (data: ConservadorFormValues) => void
  isLoading?: boolean
}

const estadosConservador = [
  { value: 'activo', label: 'Activo' },
  { value: 'mantenimiento', label: 'En Mantenimiento' },
  { value: 'inactivo', label: 'Inactivo' },
]

export function ConservadorForm({ conservador, onSubmit, isLoading }: ConservadorFormProps) {
  const form = useForm<ConservadorFormValues>({
    resolver: zodResolver(conservadorSchema),
    defaultValues: conservador || {
      estado: 'activo',
      ubicacion: {
        coordenadas: {},
      },
      productividad: {
        ventas_mensuales: 0,
        rotacion_inventario: 0,
        ocupacion_promedio: 0,
        costos_mantenimiento: 0,
        ingresos_generados: 0,
        ultima_actualizacion: new Date(),
      },
    },
  })

  // Función para obtener la ubicación actual usando la API de geolocalización
  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('ubicacion.coordenadas.latitud', position.coords.latitude)
          form.setValue('ubicacion.coordenadas.longitud', position.coords.longitude)
        },
        (error) => {
          console.error('Error obteniendo la ubicación:', error)
        }
      )
    }
  }

  // Calcular rentabilidad basada en ingresos y costos
  const calcularRentabilidad = () => {
    const ingresos = form.watch('productividad.ingresos_generados') || 0
    const costos = form.watch('productividad.costos_mantenimiento') || 0
    if (ingresos > 0) {
      const rentabilidad = ((ingresos - costos) / ingresos) * 100
      form.setValue('productividad.rentabilidad', rentabilidad)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="numero_serie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Serie</FormLabel>
                  <FormControl>
                    <Input placeholder="Número de serie del conservador" {...field} />
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
                    <Input placeholder="Capacidad del conservador" {...field} />
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
                      {estadosConservador.map((estado) => (
                        <SelectItem key={estado.value} value={estado.value}>
                          {estado.label}
                        </SelectItem>
                      ))}
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
                      placeholder="Notas adicionales sobre el conservador"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Métricas de Productividad</CardTitle>
                    <CardDescription>
                      Indicadores de rendimiento del conservador
                    </CardDescription>
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
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
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value))
                              calcularRentabilidad()
                            }}
                          />
                        </FormControl>
                        <FormDescription>Promedio de ventas mensuales</FormDescription>
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
                          step="1"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Porcentaje de ocupación del conservador</FormDescription>
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
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value))
                              calcularRentabilidad()
                            }}
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
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value))
                              calcularRentabilidad()
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch('productividad.rentabilidad') !== undefined && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium">
                      Rentabilidad:{' '}
                      <span className={form.watch('productividad.rentabilidad')! >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {form.watch('productividad.rentabilidad')?.toFixed(2)}%
                      </span>
                    </p>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="productividad.observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones de Productividad</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observaciones sobre el rendimiento del conservador"
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

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ubicación</CardTitle>
                    <CardDescription>
                      Dirección donde se encuentra el conservador
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={getCurrentLocation}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
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
                          <FormLabel>Número Interior</FormLabel>
                          <FormControl>
                            <Input placeholder="Número interior (opcional)" {...field} />
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
                          <FormLabel>Municipio</FormLabel>
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
                          <Input placeholder="Código postal" {...field} />
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

                  {form.watch('ubicacion.coordenadas.latitud') && (
                    <div className="text-sm text-muted-foreground">
                      Coordenadas: {form.watch('ubicacion.coordenadas.latitud')?.toFixed(6)},{' '}
                      {form.watch('ubicacion.coordenadas.longitud')?.toFixed(6)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Guardando...' : conservador ? 'Actualizar Conservador' : 'Crear Conservador'}
        </Button>
      </form>
    </Form>
  )
} 