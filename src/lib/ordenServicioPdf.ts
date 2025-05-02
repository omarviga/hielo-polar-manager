import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Tables } from '@/integrations/supabase/types'

type OrdenServicioWithDetails = Tables['ordenes_servicio'] & {
  conservador?: {
    id: string
    numero_serie: string
    modelo: string | null
    cliente?: {
      id: string
      nombre: string
      rfc: string | null
    } | null
  } | null
  proveedor?: {
    id: string
    razon_social: string
    rfc: string
  } | null
  evidencias?: {
    id: string
    tipo: string
    url: string
    descripcion: string | null
  }[]
  firmas?: {
    id: string
    nombre_firmante: string
    cargo_firmante: string | null
    firma_url: string
    fecha_firma: string
  }[]
}

export const generateOrdenServicioPDF = async (orden: OrdenServicioWithDetails) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const margin = 20

  // Título y número de orden
  doc.setFontSize(20)
  doc.text('Orden de Servicio', pageWidth / 2, 20, { align: 'center' })
  doc.setFontSize(16)
  doc.text(orden.numero_orden, pageWidth / 2, 30, { align: 'center' })

  // Información del cliente y proveedor
  doc.setFontSize(12)
  doc.text('Datos del Cliente:', margin, 45)
  const clienteInfo = [
    ['Nombre:', orden.conservador?.cliente?.nombre || 'N/A'],
    ['RFC:', orden.conservador?.cliente?.rfc || 'N/A'],
  ]
  doc.autoTable({
    startY: 50,
    head: [],
    body: clienteInfo,
    theme: 'plain',
    margin: { left: margin },
  })

  doc.text('Datos del Proveedor:', margin, doc.lastAutoTable.finalY + 15)
  const proveedorInfo = [
    ['Razón Social:', orden.proveedor?.razon_social || 'N/A'],
    ['RFC:', orden.proveedor?.rfc || 'N/A'],
  ]
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [],
    body: proveedorInfo,
    theme: 'plain',
    margin: { left: margin },
  })

  // Información del conservador
  doc.text('Datos del Conservador:', margin, doc.lastAutoTable.finalY + 15)
  const conservadorInfo = [
    ['Número de Serie:', orden.conservador?.numero_serie || 'N/A'],
    ['Modelo:', orden.conservador?.modelo || 'N/A'],
  ]
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [],
    body: conservadorInfo,
    theme: 'plain',
    margin: { left: margin },
  })

  // Detalles del servicio
  doc.text('Detalles del Servicio:', margin, doc.lastAutoTable.finalY + 15)
  const servicioInfo = [
    ['Tipo de Servicio:', orden.tipo],
    ['Estado:', orden.estado],
    ['Fecha Solicitud:', format(new Date(orden.fecha_solicitud), 'PPP', { locale: es })],
    ['Fecha Programada:', orden.fecha_programada
      ? format(new Date(orden.fecha_programada), 'PPP', { locale: es })
      : 'N/A'],
    ['Fecha Inicio:', orden.fecha_inicio
      ? format(new Date(orden.fecha_inicio), 'PPP', { locale: es })
      : 'N/A'],
    ['Fecha Fin:', orden.fecha_fin
      ? format(new Date(orden.fecha_fin), 'PPP', { locale: es })
      : 'N/A'],
  ]
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [],
    body: servicioInfo,
    theme: 'plain',
    margin: { left: margin },
  })

  // Descripción del problema y diagnóstico
  if (orden.descripcion_problema) {
    doc.text('Descripción del Problema:', margin, doc.lastAutoTable.finalY + 15)
    doc.setFontSize(10)
    const splitDescripcion = doc.splitTextToSize(orden.descripcion_problema, pageWidth - 2 * margin)
    doc.text(splitDescripcion, margin, doc.lastAutoTable.finalY + 25)
  }

  if (orden.diagnostico) {
    doc.setFontSize(12)
    doc.text('Diagnóstico:', margin, doc.getTextDimensions(orden.descripcion_problema || '').h + doc.lastAutoTable.finalY + 35)
    doc.setFontSize(10)
    const splitDiagnostico = doc.splitTextToSize(orden.diagnostico, pageWidth - 2 * margin)
    doc.text(splitDiagnostico, margin, doc.getTextDimensions(orden.descripcion_problema || '').h + doc.lastAutoTable.finalY + 45)
  }

  // Nueva página para trabajo realizado y materiales
  doc.addPage()

  // Trabajo realizado
  doc.setFontSize(12)
  doc.text('Trabajo Realizado:', margin, 20)
  if (orden.trabajo_realizado) {
    doc.setFontSize(10)
    const splitTrabajo = doc.splitTextToSize(orden.trabajo_realizado, pageWidth - 2 * margin)
    doc.text(splitTrabajo, margin, 30)
  }

  // Materiales utilizados
  if (orden.materiales_utilizados) {
    doc.setFontSize(12)
    doc.text('Materiales Utilizados:', margin, doc.getTextDimensions(orden.trabajo_realizado || '').h + 40)
    doc.setFontSize(10)
    const splitMateriales = doc.splitTextToSize(orden.materiales_utilizados, pageWidth - 2 * margin)
    doc.text(splitMateriales, margin, doc.getTextDimensions(orden.trabajo_realizado || '').h + 50)
  }

  // Costos
  doc.setFontSize(12)
  doc.text('Costos:', margin, doc.getTextDimensions(orden.materiales_utilizados || '').h + 70)
  const costosInfo = [
    ['Materiales:', orden.costo_materiales ? `$${orden.costo_materiales.toFixed(2)}` : 'N/A'],
    ['Mano de Obra:', orden.costo_mano_obra ? `$${orden.costo_mano_obra.toFixed(2)}` : 'N/A'],
    ['Total:', orden.costo_total ? `$${orden.costo_total.toFixed(2)}` : 'N/A'],
  ]
  doc.autoTable({
    startY: doc.getTextDimensions(orden.materiales_utilizados || '').h + 75,
    head: [],
    body: costosInfo,
    theme: 'plain',
    margin: { left: margin },
  })

  // Información de facturación
  if (orden.numero_factura) {
    doc.text('Datos de Facturación:', margin, doc.lastAutoTable.finalY + 15)
    const facturaInfo = [
      ['Número de Factura:', orden.numero_factura],
      ['Fecha de Factura:', orden.fecha_factura
        ? format(new Date(orden.fecha_factura), 'PPP', { locale: es })
        : 'N/A'],
      ['UUID:', orden.uuid_factura || 'N/A'],
    ]
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [],
      body: facturaInfo,
      theme: 'plain',
      margin: { left: margin },
    })
  }

  // Firmas
  if (orden.firmas && orden.firmas.length > 0) {
    doc.addPage()
    doc.setFontSize(12)
    doc.text('Firmas de Conformidad:', margin, 20)

    let yPos = 40
    orden.firmas.forEach((firma) => {
      // Aquí se podría agregar la imagen de la firma usando doc.addImage
      doc.text(`${firma.nombre_firmante}${firma.cargo_firmante ? ` - ${firma.cargo_firmante}` : ''}`, margin, yPos)
      doc.text(format(new Date(firma.fecha_firma), 'PPP', { locale: es }), margin, yPos + 10)
      yPos += 40
    })
  }

  // Pie de página en todas las páginas
  const pageCount = doc.internal.getNumberOfPages()
  doc.setFontSize(10)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `Generado el ${format(new Date(), 'PPpp', { locale: es })}`,
      margin,
      doc.internal.pageSize.height - 10
    )
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    )
  }

  return doc
} 