import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCandidateData = () => {
  return useQuery({
    queryKey: ['candidateData'],
    queryFn: async () => {
      try {
        // Primero obtenemos los documentos sin el join forzado
        const { data: documentos, error: docError } = await supabase
          .from('documentos_cargados')
          .select(`
            *,
            datos_documentos_procesados (
              *,
              predicciones (*)
            )
          `)
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

        // Si hay datos procesados, obtenemos las postulaciones
        if (documento.datos_documentos_procesados && Array.isArray(documento.datos_documentos_procesados) && documento.datos_documentos_procesados.length > 0) {
          const { data: postulaciones, error: postError } = await supabase
            .from('postulaciones')
            .select('*')
            .eq('procesado_data_id', documento.datos_documentos_procesados[0]?.procesado_id);

          if (postError) {
            console.error('Error al obtener postulaciones:', postError);
            throw postError;
          }

          return {
            document: documento,
            applications: postulaciones || [],
            processedData: documento.datos_documentos_procesados[0],
            prediction: documento.datos_documentos_procesados[0]?.predicciones[0]
          };
        }

        // Si no hay datos procesados, retornamos solo el documento
        return {
          document: documento,
          applications: [],
          processedData: null,
          prediction: null
        };
      } catch (error) {
        console.error('Error en useCandidateData:', error);
        throw error;
      }
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
