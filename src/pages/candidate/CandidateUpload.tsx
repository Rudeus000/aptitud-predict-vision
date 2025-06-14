
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

const CandidateUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

    // Simulación de procesamiento
    const steps = [
      { progress: 20, message: "Extrayendo texto del documento..." },
      { progress: 40, message: "Analizando experiencia laboral..." },
      { progress: 60, message: "Identificando habilidades técnicas..." },
      { progress: 80, message: "Evaluando habilidades blandas..." },
      { progress: 100, message: "Generando puntuación de aptitud..." }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingProgress(step.progress);
    }

    toast({
      title: "¡Análisis completado!",
      description: "Tu CV ha sido procesado exitosamente. Puntuación de aptitud: 87%",
    });

    setIsProcessing(false);
    setUploadedFile(null);
    setProcessingProgress(0);
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
