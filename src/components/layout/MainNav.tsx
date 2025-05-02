import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  ClipboardList,
  Home,
  Settings,
  Users,
  Snowflake,
  Wrench,
  FileText,
} from 'lucide-react'

export function MainNav() {
  const location = useLocation()

  const routes = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home,
    },
    {
      href: '/clientes',
      label: 'Clientes',
      icon: Users,
    },
    {
      href: '/conservadores',
      label: 'Conservadores',
      icon: Snowflake,
    },
    {
      href: '/ordenes-servicio',
      label: 'Órdenes de Servicio',
      icon: ClipboardList,
    },
    {
      href: '/mantenimiento',
      label: 'Mantenimiento',
      icon: Wrench,
    },
    {
      href: '/reportes',
      label: 'Reportes',
      icon: FileText,
    },
    {
      href: '/estadisticas',
      label: 'Estadísticas',
      icon: BarChart3,
    },
    {
      href: '/configuracion',
      label: 'Configuración',
      icon: Settings,
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              'flex items-center text-sm font-medium transition-colors hover:text-primary',
              location.pathname === route.href
                ? 'text-black dark:text-white'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4 mr-2" />
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
} 