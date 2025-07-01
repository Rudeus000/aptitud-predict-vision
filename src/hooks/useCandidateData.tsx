import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useCandidateData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['candidateData', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      // 1. Obtener el documento más reciente subido por el usuario
      const { data: documentos, error: docError } = await supabase
        .from('documentos_cargados')
        .select('*')
        .eq('uploader_id', user.id)
        .order('fecha_carga', { ascending: false })
        .limit(1);

      if (docError) {
        console.error('Error al obtener documentos:', docError);
        throw docError;
      }
      if (!documentos || documentos.length === 0) {
        return {
          document: null,
          applications: [],
          processedData: null,
          prediction: null
        };
      }
      const documento = documentos[0];
      // 2. Obtener el análisis del CV (datos_documentos_procesados)
      const { data: procesados, error: procError } = await supabase
        .from('datos_documentos_procesados')
        .select('*, predicciones(*)')
        .eq('documento_id', documento.documento_id)
        .order('fecha_procesamiento', { ascending: false })
        .limit(1);
      if (procError) {
        console.error('Error al obtener datos procesados:', procError);
        throw procError;
      }
      // 3. Obtener postulaciones si hay datos procesados
      let postulaciones = [];
      let prediction = null;
      let processedData = null;
      if (procesados && procesados.length > 0) {
        processedData = procesados[0];
        prediction = processedData.predicciones?.[0] || null;
        const { data: postData, error: postError } = await supabase
          .from('postulaciones')
          .select('*')
          .eq('procesado_data_id', processedData.procesado_id);
        if (postError) {
          console.error('Error al obtener postulaciones:', postError);
        } else {
          postulaciones = postData || [];
        }
      }
      return {
        document: documento,
        applications: postulaciones,
        processedData,
        prediction
      };
    },
  });
};

export const useRecommendations = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('recomendaciones')
        .select('*')
        .eq('usuario_id', user.id)
        .order('fecha_generacion', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });
};
