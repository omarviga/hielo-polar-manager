import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'

export const useConservadores = () => {
  const queryClient = useQueryClient()

  const { data: conservadores, isLoading } = useQuery({
    queryKey: ['conservadores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conservadores')
        .select(`
          *,
          cliente:clientes(id, nombre),
          ubicaciones(id, latitud, longitud, direccion, fecha_registro)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const createConservador = useMutation({
    mutationFn: async (newConservador: Tables['conservadores']['Insert']) => {
      const { data, error } = await supabase
        .from('conservadores')
        .insert(newConservador)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conservadores'] })
    },
  })

  const updateConservador = useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: { id: string } & Tables['conservadores']['Update']) => {
      const { data, error } = await supabase
        .from('conservadores')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conservadores'] })
    },
  })

  const deleteConservador = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('conservadores').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conservadores'] })
    },
  })

  return {
    conservadores,
    isLoading,
    createConservador,
    updateConservador,
    deleteConservador,
  }
} 