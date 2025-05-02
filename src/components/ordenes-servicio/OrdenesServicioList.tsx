import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ChevronDownIcon,
  DotsHorizontalIcon,
  PlusCircleIcon,
} from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useOrdenesServicio } from '@/hooks/useOrdenesServicio'
import type { Tables, TipoServicio, EstadoOrden } from '@/integrations/supabase/types'

type OrdenServicio = Tables['ordenes_servicio'] & {
  conservador?: {
    numero_serie: string
    modelo: string | null
    cliente?: {
      nombre: string
    } | null
  } | null
  proveedor?: {
    razon_social: string
  } | null
}

const tiposServicio: { value: TipoServicio; label: string }[] = [
  { value: 'mantenimiento_preventivo', label: 'Mantenimiento Preventivo' },
  { value: 'mantenimiento_correctivo', label: 'Mantenimiento Correctivo' },
  { value: 'reparacion', label: 'Reparación' },
  { value: 'instalacion', label: 'Instalación' },
  { value: 'desinstalacion', label: 'Desinstalación' },
  { value: 'otro', label: 'Otro' },
]

const estadosOrden: { value: EstadoOrden; label: string }[] = [
  { value: 'borrador', label: 'Borrador' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'facturada', label: 'Facturada' },
]

const getEstadoBadgeVariant = (estado: EstadoOrden) => {
  switch (estado) {
    case 'borrador':
      return 'secondary'
    case 'pendiente':
      return 'warning'
    case 'en_proceso':
      return 'default'
    case 'completada':
      return 'success'
    case 'cancelada':
      return 'destructive'
    case 'facturada':
      return 'outline'
    default:
      return 'default'
  }
}

interface OrdenesServicioListProps {
  onEdit: (orden: OrdenServicio) => void
  onDelete: (orden: OrdenServicio) => void
  onView: (orden: OrdenServicio) => void
  onCreate: () => void
}

export function OrdenesServicioList({
  onEdit,
  onDelete,
  onView,
  onCreate,
}: OrdenesServicioListProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const { ordenesServicio, isLoading } = useOrdenesServicio()

  const columns: ColumnDef<OrdenServicio>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'numero_orden',
      header: 'Número de Orden',
      cell: ({ row }) => <div className="font-medium">{row.getValue('numero_orden')}</div>,
    },
    {
      accessorKey: 'conservador',
      header: 'Conservador',
      cell: ({ row }) => {
        const conservador = row.original.conservador
        return (
          <div>
            <div className="font-medium">{conservador?.numero_serie}</div>
            <div className="text-sm text-muted-foreground">{conservador?.modelo}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'cliente',
      header: 'Cliente',
      cell: ({ row }) => row.original.conservador?.cliente?.nombre || 'N/A',
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => {
        const tipo = tiposServicio.find((t) => t.value === row.getValue('tipo'))
        return tipo?.label || row.getValue('tipo')
      },
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => {
        const estado = row.getValue('estado') as EstadoOrden
        return (
          <Badge variant={getEstadoBadgeVariant(estado)}>
            {estadosOrden.find((e) => e.value === estado)?.label || estado}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'fecha_solicitud',
      header: 'Fecha Solicitud',
      cell: ({ row }) => format(new Date(row.getValue('fecha_solicitud')), 'PPP', { locale: es }),
    },
    {
      accessorKey: 'fecha_programada',
      header: 'Fecha Programada',
      cell: ({ row }) => {
        const fecha = row.getValue('fecha_programada')
        return fecha ? format(new Date(fecha as string), 'PPP', { locale: es }) : 'Sin programar'
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const orden = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(orden)}>
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(orden)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(orden)}
                className="text-destructive"
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: ordenesServicio || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filtrar por número de orden..."
          value={(table.getColumn('numero_orden')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('numero_orden')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={(table.getColumn('tipo')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) => table.getColumn('tipo')?.setFilterValue(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de servicio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {tiposServicio.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={(table.getColumn('estado')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) => table.getColumn('estado')?.setFilterValue(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {estadosOrden.map((estado) => (
              <SelectItem key={estado.value} value={estado.value}>
                {estado.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onCreate} className="ml-auto">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Nueva Orden
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columnas <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? 'Cargando...' : 'No hay órdenes de servicio'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
} 