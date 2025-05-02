import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Tables } from '@/integrations/supabase/types'

type ConservadorWithDetails = Tables['conservadores'] & {
  cliente?: {
    id: string
    nombre: string
  } | null
  ubicaciones?: {
    id: string
    latitud: number | null
    longitud: number | null
    direccion: string | null
    fecha_registro: string
  }[]
}

type MantenimientoWithDetails = Tables['mantenimientos'] & {
  conservador?: {
    id: string
    numero_serie: string
    modelo: string | null
  } | null
}

export const generateConservadorReport = (conservador: ConservadorWithDetails) => {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.text('Reporte de Conservador', 105, 20, { align: 'center' })

  // Logo or header image could be added here
  // doc.addImage('logo.png', 'PNG', 10, 10, 50, 20)

  // Basic Info
  doc.setFontSize(12)
  doc.text('Información General', 20, 40)

  const basicInfo = [
    ['Número de Serie:', conservador.numero_serie],
    ['Modelo:', conservador.modelo || 'N/A'],
    ['Capacidad:', conservador.capacidad?.toString() || 'N/A'],
    ['Estado:', conservador.status],
    ['Cliente:', conservador.cliente?.nombre || 'Sin asignar'],
  ]

  doc.autoTable({
    startY: 45,
    head: [],
    body: basicInfo,
    theme: 'plain',
    margin: { left: 20 },
  })

  // Location Info
  if (conservador.ubicaciones && conservador.ubicaciones.length > 0) {
    const lastLocation = conservador.ubicaciones[0]
    doc.text('Ubicación Actual', 20, doc.lastAutoTable.finalY + 20)

    const locationInfo = [
      ['Dirección:', lastLocation.direccion || 'N/A'],
      ['Coordenadas:', lastLocation.latitud && lastLocation.longitud
        ? `${lastLocation.latitud}, ${lastLocation.longitud}`
        : 'N/A'],
      ['Última Actualización:', format(new Date(lastLocation.fecha_registro), 'PPpp', { locale: es })],
    ]

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [],
      body: locationInfo,
      theme: 'plain',
      margin: { left: 20 },
    })
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  doc.setFontSize(10)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `Generado el ${format(new Date(), 'PPpp', { locale: es })}`,
      20,
      doc.internal.pageSize.height - 10
    )
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    )
  }

  return doc
}

export const generateMantenimientosReport = (mantenimientos: MantenimientoWithDetails[]) => {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.text('Reporte de Mantenimientos', 105, 20, { align: 'center' })

  // Summary
  doc.setFontSize(12)
  doc.text('Resumen de Mantenimientos', 20, 40)

  const tableData = mantenimientos.map(m => [
    m.conservador?.numero_serie || 'N/A',
    m.tipo_servicio,
    m.fecha_programada ? format(new Date(m.fecha_programada), 'PP', { locale: es }) : 'N/A',
    m.fecha_realizado ? format(new Date(m.fecha_realizado), 'PP', { locale: es }) : 'Pendiente',
    m.status,
    m.costo ? `$${m.costo.toFixed(2)}` : 'N/A',
  ])

  doc.autoTable({
    startY: 45,
    head: [['Conservador', 'Tipo', 'Programado', 'Realizado', 'Estado', 'Costo']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] },
  })

  // Statistics
  const total = mantenimientos.reduce((sum, m) => sum + (m.costo || 0), 0)
  const pending = mantenimientos.filter(m => m.status === 'pendiente').length
  const completed = mantenimientos.filter(m => m.status === 'completado').length

  doc.setFontSize(12)
  doc.text('Estadísticas', 20, doc.lastAutoTable.finalY + 20)

  const stats = [
    ['Total Mantenimientos:', mantenimientos.length.toString()],
    ['Pendientes:', pending.toString()],
    ['Completados:', completed.toString()],
    ['Costo Total:', `$${total.toFixed(2)}`],
  ]

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 25,
    head: [],
    body: stats,
    theme: 'plain',
    margin: { left: 20 },
  })

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  doc.setFontSize(10)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `Generado el ${format(new Date(), 'PPpp', { locale: es })}`,
      20,
      doc.internal.pageSize.height - 10
    )
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    )
  }

  return doc
} 