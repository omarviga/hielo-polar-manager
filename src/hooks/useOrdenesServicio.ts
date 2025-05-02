import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'

export const useOrdenesServicio = (conservadorId?: string) => {
  const queryClient = useQueryClient()

  const { data: ordenesServicio, isLoading } = useQuery({
    queryKey: ['ordenes_servicio', conservadorId],
    queryFn: async () => {
      let query = supabase
        .from('ordenes_servicio')
        .select(`
          *,
          conservador:conservadores(
            id,
            numero_serie,
            modelo,
            cliente:clientes(
              id,
              nombre,
              rfc
            )
          ),
          proveedor:proveedores_servicio(
            id,
            razon_social,
            rfc
          ),
          evidencias:evidencias_servicio(
            id,
            tipo,
            url,
            descripcion
          ),
          firmas:firmas_conformidad(
            id,
            nombre_firmante,
            cargo_firmante,
            firma_url,
            fecha_firma
          )
        `)
        .order('fecha_solicitud', { ascending: false })

      if (conservadorId) {
        query = query.eq('conservador_id', conservadorId)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !conservadorId || typeof conservadorId === 'string',
  })

  const createOrdenServicio = useMutation({
    mutationFn: async (newOrden: Tables['ordenes_servicio']['Insert']) => {
      // Generar número de orden único
      const fecha = new Date()
      const año = fecha.getFullYear()
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
      const count = await supabase
        .from('ordenes_servicio')
        .select('id', { count: 'exact' })
        .gte('created_at', `${año}-${mes}-01`)
        .lt('created_at', `${año}-${parseInt(mes) + 1}-01`)

      const numeroSecuencial = ((count?.count || 0) + 1).toString().padStart(3, '0')
      const numeroOrden = `OS-${año}${mes}${numeroSecuencial}`

      const { data, error } = await supabase
        .from('ordenes_servicio')
        .insert({ ...newOrden, numero_orden: numeroOrden })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes_servicio'] })
    },
  })

  const updateOrdenServicio = useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: { id: string } & Tables['ordenes_servicio']['Update']) => {
      const { data, error } = await supabase
        .from('ordenes_servicio')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes_servicio'] })
    },
  })

  const deleteOrdenServicio = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('ordenes_servicio').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes_servicio'] })
    },
  })

  // Función para agregar evidencias
  const addEvidencia = useMutation({
    mutationFn: async (evidencia: Tables['evidencias_servicio']['Insert']) => {
      const { data, error } = await supabase
        .from('evidencias_servicio')
        .insert(evidencia)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes_servicio'] })
    },
  })

  // Función para agregar firma de conformidad
  const addFirma = useMutation({
    mutationFn: async (firma: Tables['firmas_conformidad']['Insert']) => {
      const { data, error } = await supabase
        .from('firmas_conformidad')
        .insert(firma)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes_servicio'] })
    },
  })

  return {
    ordenesServicio,
    isLoading,
    createOrdenServicio,
    updateOrdenServicio,
    deleteOrdenServicio,
    addEvidencia,
    addFirma,
  }
} 