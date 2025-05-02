import { useConservadorAlerts } from '@/hooks/useConservadorAlerts'
import { ConservadorAlerts } from './ConservadorAlerts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ConservadorDetailsProps {
  conservadorId: string
  customThresholds?: {
    minCapacityUsagePercent?: number
    evaluationPeriodWeeks?: number
    minExpectedRotation?: number
    downsizeThresholdPercent?: number
  }
}

export function ConservadorDetails({ conservadorId, customThresholds }: ConservadorDetailsProps) {
  const { alerts, isLoading } = useConservadorAlerts(conservadorId, customThresholds)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-[200px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[100px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado del Conservador</CardTitle>
      </CardHeader>
      <CardContent>
        <ConservadorAlerts alerts={alerts} />
      </CardContent>
    </Card>
  )
} 