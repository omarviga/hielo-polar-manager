import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Tables, TipoServicio } from '@/integrations/supabase/types'
import { useConservadores } from '@/hooks/useConservadores'
import { useProveedoresServicio } from '@/hooks/useProveedoresServicio'

const ordenServicioSchema = z.object({
  conservador_id: z.string().uuid(),
  proveedor_id: z.string().uuid(),
  tipo: z.enum(['mantenimiento_preventivo', 'mantenimiento_correctivo', 'reparacion', 'instalacion', 'desinstalacion', 'otro'] as const),
  fecha_solicitud: z.date(),
  fecha_programada: z.date().optional(),
  descripcion_problema: z.string().optional(),
  notas_internas: z.string().optional(),
  // SAT compliance fields
  factura_uuid: z.string().uuid().optional(),
  factura_pdf: z.any().optional(), // File upload
  factura_xml: z.any().optional(), // File upload
  evidencia_fotos: z.array(z.any()).optional(), // Multiple file upload
  evidencia_notas: z.string().optional(),
  firma_conformidad: z.any().optional(), // Signature data
  monto_total: z.number().min(0),
  metodo_pago: z.enum(['efectivo', 'transferencia', 'cheque', 'tarjeta']),
  forma_pago: z.string(), // SAT payment form codes
  uso_cfdi: z.string(), // SAT CFDI usage codes
})

type OrdenServicioFormValues = z.infer<typeof ordenServicioSchema>

interface OrdenServicioFormProps {
  orden?: Tables['ordenes_servicio']
  onSubmit: (data: OrdenServicioFormValues) => void
  isLoading?: boolean
}

const tiposServicio: { value: TipoServicio; label: string }[] = [
  { value: 'mantenimiento_preventivo', label: 'Mantenimiento Preventivo' },
  { value: 'mantenimiento_correctivo', label: 'Mantenimiento Correctivo' },
  { value: 'reparacion', label: 'Reparación' },
  { value: 'instalacion', label: 'Instalación' },
  { value: 'desinstalacion', label: 'Desinstalación' },
  { value: 'otro', label: 'Otro' },
]

const metodosPago = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia Bancaria' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'tarjeta', label: 'Tarjeta' },
]

const formasPago = [
  { value: '01', label: '01 - Efectivo' },
  { value: '02', label: '02 - Cheque nominativo' },
  { value: '03', label: '03 - Transferencia electrónica' },
  { value: '04', label: '04 - Tarjeta de crédito' },
  { value: '28', label: '28 - Tarjeta de débito' },
]

const usosCFDI = [
  { value: 'G03', label: 'G03 - Gastos en general' },
  { value: 'I04', label: 'I04 - Equipo de cómputo y accesorios' },
  { value: 'I05', label: 'I05 - Dados, troqueles, moldes, matrices y herramental' },
]

export function OrdenServicioForm({ orden, onSubmit, isLoading }: OrdenServicioFormProps) {
  const { conservadores } = useConservadores()
  const { proveedores } = useProveedoresServicio()

  const form = useForm<OrdenServicioFormValues>({
    resolver: zodResolver(ordenServicioSchema),
    defaultValues: orden
      ? {
        ...orden,
        fecha_solicitud: orden.fecha_solicitud ? new Date(orden.fecha_solicitud) : new Date(),
        fecha_programada: orden.fecha_programada ? new Date(orden.fecha_programada) : undefined,
      }
      : {
        fecha_solicitud: new Date(),
        monto_total: 0,
      },
  })

  const handleFileUpload = (field: keyof OrdenServicioFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.length) {
      form.setValue(field, field === 'evidencia_fotos' ? Array.from(files) : files[0])
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="conservador_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conservador</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un conservador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {conservadores?.map((conservador) => (
                        <SelectItem key={conservador.id} value={conservador.id}>
                          {conservador.numero_serie} - {conservador.modelo}
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
              name="proveedor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor de Servicio</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un proveedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {proveedores?.map((proveedor) => (
                        <SelectItem key={proveedor.id} value={proveedor.id}>
                          {proveedor.razon_social}
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
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Servicio</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de servicio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposServicio.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fecha_solicitud"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Solicitud</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fecha_programada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Programada</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="descripcion_problema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Problema</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el problema o el servicio requerido"
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
              name="notas_internas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Internas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas internas adicionales"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Información Fiscal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="monto_total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto Total</FormLabel>
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
                name="metodo_pago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pago</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el método de pago" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {metodosPago.map((metodo) => (
                          <SelectItem key={metodo.value} value={metodo.value}>
                            {metodo.label}
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
                name="forma_pago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pago SAT</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la forma de pago" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formasPago.map((forma) => (
                          <SelectItem key={forma.value} value={forma.value}>
                            {forma.label}
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
                name="uso_cfdi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uso de CFDI</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el uso de CFDI" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usosCFDI.map((uso) => (
                          <SelectItem key={uso.value} value={uso.value}>
                            {uso.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="factura_uuid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UUID de Factura</FormLabel>
                    <FormControl>
                      <Input placeholder="UUID de la factura" {...field} />
                    </FormControl>
                    <FormDescription>
                      Folio fiscal único de la factura CFDI
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="factura_pdf"
                render={({ field: { value, ...field } }) => (
                  <FormItem>
                    <FormLabel>PDF de Factura</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload('factura_pdf')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="factura_xml"
                render={({ field: { value, ...field } }) => (
                  <FormItem>
                    <FormLabel>XML de Factura</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".xml"
                        onChange={handleFileUpload('factura_xml')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evidencia_fotos"
                render={({ field: { value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Evidencia Fotográfica</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload('evidencia_fotos')}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Fotos del servicio realizado (máximo 5 imágenes)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evidencia_notas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas de Evidencia</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas adicionales sobre la evidencia del servicio"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Guardando...' : orden ? 'Actualizar Orden' : 'Crear Orden'}
        </Button>
      </form>
    </Form>
  )
} 