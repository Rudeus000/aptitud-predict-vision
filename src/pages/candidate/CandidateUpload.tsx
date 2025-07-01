import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const CandidateUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "El archivo es demasiado grande. El tamaño máximo es 5MB.",
          variant: "destructive"
        });
        return;
      }
      setUploadedFile(file);
      toast({
        title: "Archivo seleccionado",
        description: `${file.name} listo para análisis`,
      });
    }
  };

  const processFile = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // 1. Subir el archivo a Supabase Storage
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `cvs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(filePath, uploadedFile);

      if (uploadError) {
        throw new Error(`Error al subir el archivo: ${uploadError.message}`);
      }

      // Espera 10 segundos para asegurar que el archivo esté disponible en el storage
      await new Promise(res => setTimeout(res, 10000));

      setProcessingProgress(20);

      // 2. Crear registro en la tabla documentos_cargados
      const { data: documento, error: docError } = await supabase
        .from('documentos_cargados')
        .insert([
          {
            nombre_archivo: fileName,
            ruta_almacenamiento_original: filePath,
            mime_type: uploadedFile.type,
            tamano_bytes: uploadedFile.size,
            uploader_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous'
          }
        ])
        .select()
        .single();

      if (docError || !documento || !documento.documento_id) {
        console.error('Error al crear registro:', docError, documento);
        throw new Error(`Error al crear registro: ${docError?.message || 'No se obtuvo documento_id'}`);
      }

      setProcessingProgress(40);

      // Espera 2 segundos antes de procesar
      await new Promise(res => setTimeout(res, 2000));

      // 3. Llamar al endpoint de procesamiento
      console.log("Enviando documento_id a /process-document:", documento.documento_id);
      const response = await fetch('http://localhost:8000/process-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documento_id: documento.documento_id,
          file_path: filePath
        })
      });

      if (!response.ok) {
        throw new Error('Error al procesar el documento');
      }

      setProcessingProgress(100);

      toast({
        title: "¡Análisis completado!",
        description: "Tu CV ha sido procesado exitosamente. Serás redirigido a tu panel...",
      });

      // Refresca los datos del candidato antes de redirigir
      await queryClient.invalidateQueries({ queryKey: ['candidateData'] });

      // Esperar 2 segundos antes de redirigir
      setTimeout(() => {
        navigate('/candidate/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al procesar el documento",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setUploadedFile(null);
      setProcessingProgress(0);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Subir mi Currículum</CardTitle>
            <CardDescription>
              Sube tu CV actualizado para ser considerado en futuras oportunidades en La Pontificia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
              onClick={() => document.getElementById('cv-upload')?.click()}
            >
              <div className="space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-white">📄</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Selecciona tu currículum
                  </h3>
                  <p className="text-slate-500 mt-2">
                    Formatos soportados: PDF, DOC, DOCX (máx. 5MB)
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Nuestro sistema de IA analizará automáticamente tu experiencia y habilidades
                  </p>
                </div>
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {uploadedFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">📄</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{uploadedFile.name}</p>
                      <p className="text-sm text-slate-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Analizando tu CV...</span>
                  <span className="text-sm text-slate-500">{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-3" />
                <p className="text-sm text-slate-600 text-center">
                  Estamos extrayendo y analizando tu información profesional con inteligencia artificial
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={processFile}
                disabled={!uploadedFile || isProcessing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isProcessing ? "Procesando..." : "Analizar mi CV"}
              </Button>
              
              {uploadedFile && !isProcessing && (
                <Button
                  variant="outline"
                  onClick={() => setUploadedFile(null)}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>¿Qué analizamos?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-slate-700">Experiencia laboral y trayectoria</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-slate-700">Habilidades técnicas y certificaciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-slate-700">Educación y formación académica</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-slate-700">Habilidades blandas y competencias</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✓</span>
                <span className="text-slate-700">Proyectos y logros destacados</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Beneficios del análisis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-blue-500">🎯</span>
                <span className="text-slate-700">Puntuación de aptitud personalizada</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-500">💡</span>
                <span className="text-slate-700">Recomendaciones para mejorar</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-500">🚀</span>
                <span className="text-slate-700">Mejor matching con posiciones</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-500">📊</span>
                <span className="text-slate-700">Comparación con otros candidatos</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-500">🔔</span>
                <span className="text-slate-700">Alertas de nuevas oportunidades</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🔒 Tu privacidad es importante
            </h3>
            <p className="text-green-700 text-sm">
              Tu CV es procesado de forma segura y confidencial. Solo será visible para los 
              reclutadores de La Pontificia cuando apliques a una posición específica. 
              Puedes eliminar tu información en cualquier momento.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CandidateUpload;
