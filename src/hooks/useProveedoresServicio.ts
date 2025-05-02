import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'

export const useProveedoresServicio = () => {
  const queryClient = useQueryClient()

  const { data: proveedores, isLoading } = useQuery({
    queryKey: ['proveedores_servicio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proveedores_servicio')
        .select('*')
        .order('razon_social', { ascending: true })

      if (error) throw error
      return data
    },
  })

  const createProveedor = useMutation({
    mutationFn: async (newProveedor: Tables['proveedores_servicio']['Insert']) => {
      const { data, error } = await supabase
        .from('proveedores_servicio')
        .insert(newProveedor)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores_servicio'] })
    },
  })

  const updateProveedor = useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: { id: string } & Tables['proveedores_servicio']['Update']) => {
      const { data, error } = await supabase
        .from('proveedores_servicio')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores_servicio'] })
    },
  })

  const deleteProveedor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('proveedores_servicio').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores_servicio'] })
    },
  })

  return {
    proveedores,
    isLoading,
    createProveedor,
    updateProveedor,
    deleteProveedor,
  }
} 