
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCandidateData = () => {
  return useQuery({
    queryKey: ['candidateData'],
    queryFn: async () => {
      // Obtener documentos del candidato
      const { data: documentos, error: docError } = await supabase
        .from('documentos_cargados')
        .select(`
          *,
          datos_documentos_procesados (
            *,
            predicciones (*)
          )
        `)
        .limit(1)
        .single();

      if (docError) throw docError;

      // Obtener postulaciones del candidato
      const { data: postulaciones, error: postError } = await supabase
        .from('postulaciones')
        .select('*')
        .eq('procesado_data_id', documentos.datos_documentos_procesados[0]?.procesado_id);

      if (postError) throw postError;

      return {
        document: documentos,
        applications: postulaciones || [],
        processedData: documentos.datos_documentos_procesados[0],
        prediction: documentos.datos_documentos_procesados[0]?.predicciones[0]
      };
    }
  });
};

export const useRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recomendaciones')
        .select('*')
        .order('fecha_generacion', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });
};
