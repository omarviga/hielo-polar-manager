import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export type AlertType =
  | 'LOW_USAGE'
  | 'UNDERPERFORMING'
  | 'MAINTENANCE_NEEDED'
  | 'CONSIDER_DOWNSIZE'
  | 'NEGATIVE_TREND'
  | 'HIGH_MAINTENANCE_COST'
  | 'SEASONAL_PATTERN'

export interface ConservadorAlert {
  type: AlertType
  message: string
  severity: 'low' | 'medium' | 'high'
  suggestedAction: string
  createdAt: Date
  metrics?: Record<string, number>
}

export interface AlertThresholds {
  minCapacityUsagePercent: number
  evaluationPeriodWeeks: number
  minExpectedRotation: number
  downsizeThresholdPercent: number
  maxMaintenanceCostRatio: number
  minTrendDeclinePercent: number
}

const DEFAULT_THRESHOLDS: AlertThresholds = {
  minCapacityUsagePercent: 60, // Uso mínimo esperado de la capacidad
  evaluationPeriodWeeks: 4, // Período de evaluación en semanas
  minExpectedRotation: 2, // Rotación mínima esperada por mes
  downsizeThresholdPercent: 50, // Porcentaje bajo el cual se sugiere reducir tamaño
  maxMaintenanceCostRatio: 0.3, // Máximo ratio de costos de mantenimiento vs ingresos (30%)
  minTrendDeclinePercent: 15, // Porcentaje mínimo de decline para considerar tendencia negativa
}

export function useConservadorAlerts(
  conservadorId: string,
  customThresholds?: Partial<AlertThresholds>
) {
  const [alerts, setAlerts] = useState<ConservadorAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useSupabaseClient()

  const thresholds = { ...DEFAULT_THRESHOLDS, ...customThresholds }

  useEffect(() => {
    const checkAlerts = async () => {
      setIsLoading(true)
      try {
        // Obtener datos del conservador y sus métricas de productividad
        const { data: conservador, error: conservadorError } = await supabase
          .from('conservadores')
          .select('*, productividad (*)')
          .eq('id', conservadorId)
          .single()

        if (conservadorError) throw conservadorError

        // Obtener historial de ventas de las últimas 4 semanas
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - (thresholds.evaluationPeriodWeeks * 7))

        const { data: ventasRecientes, error: ventasError } = await supabase
          .from('ventas')
          .select('*')
          .eq('conservador_id', conservadorId)
          .gte('fecha', startDate.toISOString())
          .order('fecha', { ascending: false })

        if (ventasError) throw ventasError

        const newAlerts: ConservadorAlert[] = []

        // Análisis de uso de capacidad
        if (conservador.productividad.ocupacion_promedio < thresholds.minCapacityUsagePercent) {
          newAlerts.push({
            type: 'LOW_USAGE',
            message: `Uso de capacidad bajo (${conservador.productividad.ocupacion_promedio}%)`,
            severity: 'medium',
            suggestedAction: 'Revisar estrategia de ventas o considerar reubicación',
            createdAt: new Date(),
            metrics: {
              ocupacion: conservador.productividad.ocupacion_promedio
            }
          })
        }

        // Análisis de rotación de inventario
        if (conservador.productividad.rotacion_inventario < thresholds.minExpectedRotation) {
          newAlerts.push({
            type: 'UNDERPERFORMING',
            message: 'Baja rotación de inventario',
            severity: 'high',
            suggestedAction: 'Evaluar estrategia comercial o considerar reubicación',
            createdAt: new Date(),
            metrics: {
              rotacion: conservador.productividad.rotacion_inventario
            }
          })
        }

        // Análisis de costos de mantenimiento
        const costoMantenimientoRatio = conservador.productividad.costos_mantenimiento /
          (conservador.productividad.ingresos_generados || 1)

        if (costoMantenimientoRatio > thresholds.maxMaintenanceCostRatio) {
          newAlerts.push({
            type: 'HIGH_MAINTENANCE_COST',
            message: `Costos de mantenimiento elevados (${(costoMantenimientoRatio * 100).toFixed(1)}% de ingresos)`,
            severity: 'high',
            suggestedAction: 'Evaluar estado del equipo y considerar reemplazo',
            createdAt: new Date(),
            metrics: {
              costoRatio: costoMantenimientoRatio,
              costosMensuales: conservador.productividad.costos_mantenimiento
            }
          })
        }

        // Análisis de tendencias
        const ventasPorSemana = new Array(thresholds.evaluationPeriodWeeks).fill(0)
        ventasRecientes.forEach(venta => {
          const semanaIndex = Math.floor(
            (new Date().getTime() - new Date(venta.fecha).getTime()) /
            (7 * 24 * 60 * 60 * 1000)
          )
          if (semanaIndex >= 0 && semanaIndex < thresholds.evaluationPeriodWeeks) {
            ventasPorSemana[semanaIndex] += venta.cantidad
          }
        })

        // Calcular tendencia
        const primeraMitad = ventasPorSemana.slice(0, Math.floor(thresholds.evaluationPeriodWeeks / 2))
        const segundaMitad = ventasPorSemana.slice(Math.floor(thresholds.evaluationPeriodWeeks / 2))
        const promedioPrimeraMitad = primeraMitad.reduce((a, b) => a + b, 0) / primeraMitad.length
        const promedioSegundaMitad = segundaMitad.reduce((a, b) => a + b, 0) / segundaMitad.length

        const declinePorcentaje = ((promedioPrimeraMitad - promedioSegundaMitad) / promedioPrimeraMitad) * 100

        if (declinePorcentaje > thresholds.minTrendDeclinePercent) {
          newAlerts.push({
            type: 'NEGATIVE_TREND',
            message: `Tendencia negativa en ventas (${declinePorcentaje.toFixed(1)}% de decline)`,
            severity: 'high',
            suggestedAction: 'Investigar causas de la disminución en ventas',
            createdAt: new Date(),
            metrics: {
              declinePorcentaje,
              ventasIniciales: promedioPrimeraMitad,
              ventasFinales: promedioSegundaMitad
            }
          })
        }

        // Análisis para reducción de tamaño
        const promedioUsoCapacidad = ventasRecientes.reduce((acc, venta) =>
          acc + (venta.cantidad / conservador.capacidad * 100), 0) / ventasRecientes.length

        if (promedioUsoCapacidad < thresholds.downsizeThresholdPercent) {
          newAlerts.push({
            type: 'CONSIDER_DOWNSIZE',
            message: `Uso promedio de capacidad muy bajo (${promedioUsoCapacidad.toFixed(1)}%)`,
            severity: 'high',
            suggestedAction: 'Considerar cambio a un conservador de menor capacidad',
            createdAt: new Date(),
            metrics: {
              promedioUso: promedioUsoCapacidad,
              capacidadActual: conservador.capacidad
            }
          })

          // Actualizar el estado del conservador si es necesario
          await supabase
            .from('conservadores')
            .update({
              estado: 'revision_pendiente',
              notas: `Revisión de capacidad requerida - Uso promedio: ${promedioUsoCapacidad.toFixed(1)}%`,
            })
            .eq('id', conservadorId)
        }

        // Detectar patrones estacionales
        const { data: ventasAnuales } = await supabase
          .from('ventas')
          .select('*')
          .eq('conservador_id', conservadorId)
          .gte('fecha', new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString())

        if (ventasAnuales) {
          const ventasPorMes = new Array(12).fill(0)
          ventasAnuales.forEach(venta => {
            const mes = new Date(venta.fecha).getMonth()
            ventasPorMes[mes] += venta.cantidad
          })

          const promedioAnual = ventasPorMes.reduce((a, b) => a + b, 0) / 12
          const variacionEstacional = Math.max(...ventasPorMes) / promedioAnual

          if (variacionEstacional > 1.5) { // Si hay más de 50% de variación entre meses
            newAlerts.push({
              type: 'SEASONAL_PATTERN',
              message: 'Se detectó un patrón estacional significativo',
              severity: 'medium',
              suggestedAction: 'Planificar estrategia según temporada',
              createdAt: new Date(),
              metrics: {
                variacionEstacional,
                promedioAnual
              }
            })
          }
        }

        setAlerts(newAlerts)
      } catch (error) {
        console.error('Error checking alerts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAlerts()
    // Configurar un intervalo para verificar periódicamente
    const interval = setInterval(checkAlerts, 24 * 60 * 60 * 1000) // Verificar cada 24 horas

    return () => clearInterval(interval)
  }, [conservadorId, supabase, thresholds])

  return {
    alerts,
    isLoading,
  }
} 