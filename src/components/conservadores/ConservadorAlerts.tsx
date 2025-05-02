import { AlertCircle, AlertTriangle, Bell, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import type { ConservadorAlert } from '@/hooks/useConservadorAlerts'

interface ConservadorAlertsProps {
  alerts: ConservadorAlert[]
}

type AlertVariant = "default" | "destructive"
type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export function ConservadorAlerts({ alerts }: ConservadorAlertsProps) {
  if (alerts.length === 0) return null

  const getSeverityIcon = (type: ConservadorAlert['type'], severity: ConservadorAlert['severity']) => {
    switch (type) {
      case 'NEGATIVE_TREND':
        return <TrendingDown className="h-4 w-4" />
      case 'HIGH_MAINTENANCE_COST':
        return <DollarSign className="h-4 w-4" />
      case 'SEASONAL_PATTERN':
        return <Calendar className="h-4 w-4" />
      default:
        switch (severity) {
          case 'high':
            return <AlertCircle className="h-4 w-4" />
          case 'medium':
            return <AlertTriangle className="h-4 w-4" />
          default:
            return <Bell className="h-4 w-4" />
        }
    }
  }

  const getSeverityColor = (severity: ConservadorAlert['severity']): AlertVariant => {
    switch (severity) {
      case 'high':
        return 'destructive'
      case 'medium':
      case 'low':
        return 'default'
      default:
        return 'default'
    }
  }

  const getBadgeVariant = (severity: ConservadorAlert['severity']): BadgeVariant => {
    switch (severity) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'default'
    }
  }

  const formatMetric = (key: string, value: number): string => {
    switch (key) {
      case 'ocupacion':
      case 'promedioUso':
      case 'declinePorcentaje':
        return `${value.toFixed(1)}%`
      case 'costoRatio':
        return `${(value * 100).toFixed(1)}%`
      case 'costosMensuales':
        return `$${value.toFixed(2)}`
      case 'rotacion':
        return `${value.toFixed(1)} veces/mes`
      default:
        return value.toString()
    }
  }

  const getMetricLabel = (key: string): string => {
    const labels: Record<string, string> = {
      ocupacion: 'Ocupación',
      promedioUso: 'Uso Promedio',
      declinePorcentaje: 'Decline',
      costoRatio: 'Ratio de Costos',
      costosMensuales: 'Costos Mensuales',
      rotacion: 'Rotación',
      variacionEstacional: 'Variación Estacional',
      promedioAnual: 'Promedio Anual',
      ventasIniciales: 'Ventas Iniciales',
      ventasFinales: 'Ventas Finales',
    }
    return labels[key] || key
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          variant={getSeverityColor(alert.severity)}
          className="border-l-4"
        >
          <div className="flex items-center gap-2">
            {getSeverityIcon(alert.type, alert.severity)}
            <AlertTitle className="flex items-center gap-2">
              {alert.type.replace(/_/g, ' ')}
              <Badge variant={getBadgeVariant(alert.severity)}>
                {alert.severity}
              </Badge>
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2 space-y-2">
            <p>{alert.message}</p>
            <p className="font-medium">Acción sugerida: {alert.suggestedAction}</p>
            {alert.metrics && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(alert.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center bg-muted/50 p-1.5 rounded">
                    <span className="font-medium">{getMetricLabel(key)}:</span>
                    <span>{formatMetric(key, value)}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Detectado: {alert.createdAt.toLocaleDateString()}
            </p>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
} 