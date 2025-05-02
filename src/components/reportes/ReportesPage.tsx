import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Button } from '@/components/ui/button'
import { Download, FileSpreadsheet, Printer } from 'lucide-react'

export function ReportesPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [reportType, setReportType] = useState('ventas')

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reportes y Estadísticas</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ventas">Reporte de Ventas</SelectItem>
              <SelectItem value="mantenimiento">Reporte de Mantenimiento</SelectItem>
              <SelectItem value="productividad">Productividad de Conservadores</SelectItem>
              <SelectItem value="clientes">Análisis de Clientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="detalle">Detalle</TabsTrigger>
          <TabsTrigger value="graficas">Gráficas</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conservadores Activos</CardTitle>
                <CardDescription>Total de conservadores en operación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">127</div>
                <p className="text-sm text-muted-foreground">+3.2% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mantenimientos Pendientes</CardTitle>
                <CardDescription>Servicios programados sin realizar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-sm text-muted-foreground">2 urgentes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eficiencia Promedio</CardTitle>
                <CardDescription>Uso de capacidad instalada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">76.4%</div>
                <p className="text-sm text-muted-foreground">+5.1% vs mes anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen del Período</CardTitle>
              <CardDescription>
                {dateRange?.from
                  ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString() || 'Actual'
                  }`
                  : 'Seleccione un rango de fechas'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Nuevos Clientes</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Servicios Realizados</p>
                    <p className="text-2xl font-bold">47</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alertas Generadas</p>
                    <p className="text-2xl font-bold">15</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Conservadores Reubicados</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detalle">
          <Card>
            <CardHeader>
              <CardTitle>Detalle del Reporte</CardTitle>
              <CardDescription>
                Información detallada según el tipo de reporte seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aquí irá el contenido detallado según el tipo de reporte */}
              <p className="text-muted-foreground">
                Seleccione un tipo de reporte y rango de fechas para ver el detalle
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graficas">
          <Card>
            <CardHeader>
              <CardTitle>Gráficas y Visualizaciones</CardTitle>
              <CardDescription>
                Representación visual de los datos del período
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aquí irán las gráficas según el tipo de reporte */}
              <p className="text-muted-foreground">
                Seleccione un tipo de reporte y rango de fechas para ver las gráficas
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 