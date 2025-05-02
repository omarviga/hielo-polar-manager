
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for recent activities
const activities = [
  {
    id: 1,
    description: "Conservador #2342 registrado para mantenimiento",
    timestamp: "Hace 2 horas",
    user: "Ana Martínez",
  },
  {
    id: 2,
    description: "Nuevo cliente registrado: Supermercados Norte",
    timestamp: "Hace 5 horas",
    user: "Carlos López",
  },
  {
    id: 3,
    description: "Conservador #1820 trasladado a nueva ubicación",
    timestamp: "Hace 8 horas",
    user: "Miguel Rodríguez",
  },
  {
    id: 4,
    description: "Reporte mensual de conservadores generado",
    timestamp: "Hace 1 día",
    user: "Laura González",
  },
];

export function RecentActivity() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas acciones realizadas en el sistema.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="flex flex-col space-y-1 border-b pb-3 last:border-0"
          >
            <p className="font-medium text-sm">{activity.description}</p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Por {activity.user}</span>
              <span>{activity.timestamp}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
