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
import { Button } from '@/components/ui/button'
import { FileText, MapPin, Package, Phone, User } from 'lucide-react'

interface ClienteDetailsProps {
  cliente: {
    id: string
    nombre: string
    razon_social: string
    rfc: string
    telefono: string
    email: string
    direccion: {
      calle: string
      numero: string
      colonia: string
      municipio: string
      estado: string
      cp: string
    }
    conservadores: Array<{
      id: string
      numero_serie: string
      modelo: string
      capacidad: string
      estado: string
    }>
    contratos: Array<{
      id: string
      tipo: string
      fecha_inicio: string
      fecha_fin?: string
      estado: string
    }>
  }
}

export function ClienteDetails({ cliente }: ClienteDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{cliente.nombre}</CardTitle>
            <CardDescription>{cliente.razon_social}</CardDescription>
          </div>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Ver Contrato
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="informacion" className="space-y-4">
          <TabsList>
            <TabsTrigger value="informacion">Información</TabsTrigger>
            <TabsTrigger value="conservadores">Conservadores</TabsTrigger>
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
          </TabsList>

          <TabsContent value="informacion">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">RFC:</span>
                    {cliente.rfc}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Teléfono:</span>
                    {cliente.telefono}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Dirección:</span>
                    {`${cliente.direccion.calle} ${cliente.direccion.numero}, ${cliente.direccion.colonia}`}
                  </div>
                  <div className="text-sm pl-6">
                    {`${cliente.direccion.municipio}, ${cliente.direccion.estado} CP: ${cliente.direccion.cp}`}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conservadores">
            <div className="space-y-4">
              {cliente.conservadores.map((conservador) => (
                <Card key={conservador.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{conservador.modelo}</p>
                          <p className="text-sm text-muted-foreground">
                            Serie: {conservador.numero_serie}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Capacidad: {conservador.capacidad}</p>
                        <p className="text-sm text-muted-foreground">
                          Estado: {conservador.estado}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contratos">
            <div className="space-y-4">
              {cliente.contratos.map((contrato) => (
                <Card key={contrato.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Contrato de {contrato.tipo}</p>
                        <p className="text-sm text-muted-foreground">
                          Inicio: {new Date(contrato.fecha_inicio).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Estado: {contrato.estado}</p>
                        {contrato.fecha_fin && (
                          <p className="text-sm text-muted-foreground">
                            Vence: {new Date(contrato.fecha_fin).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 