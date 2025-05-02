import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'

export const useMantenimientos = (conservadorId?: string) => {
  const queryClient = useQueryClient()

  const { data: mantenimientos, isLoading } = useQuery({
    queryKey: ['mantenimientos', conservadorId],
    queryFn: async () => {
      let query = supabase
        .from('mantenimientos')
        .select(`
          *,
          conservador:conservadores(id, numero_serie, modelo)
        `)
        .order('fecha_programada', { ascending: true })

      if (conservadorId) {
        query = query.eq('conservador_id', conservadorId)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !conservadorId || typeof conservadorId === 'string',
  })

  const createMantenimiento = useMutation({
    mutationFn: async (newMantenimiento: Tables['mantenimientos']['Insert']) => {
      const { data, error } = await supabase
        .from('mantenimientos')
        .insert(newMantenimiento)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mantenimientos'] })
    },
  })

  const updateMantenimiento = useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: { id: string } & Tables['mantenimientos']['Update']) => {
      const { data, error } = await supabase
        .from('mantenimientos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mantenimientos'] })
    },
  })

  const deleteMantenimiento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('mantenimientos').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mantenimientos'] })
    },
  })

  return {
    mantenimientos,
    isLoading,
    createMantenimiento,
    updateMantenimiento,
    deleteMantenimiento,
  }
} 