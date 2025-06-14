
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

const UploadScreen = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "Archivos añadidos",
      description: `${files.length} archivo(s) agregado(s) a la cola de procesamiento`,
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulación de procesamiento
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProcessingProgress(i);
    }

    toast({
      title: "¡Procesamiento completado!",
      description: `${uploadedFiles.length} CV(s) analizados exitosamente`,
    });

    setIsProcessing(false);
    setUploadedFiles([]);
    setProcessingProgress(0);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Carga de Currículums</CardTitle>
            <CardDescription>
              Sube los CVs de los candidatos para análisis automático con IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-slate-50/50"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </h3>
                  <p className="text-slate-500">
                    Formatos soportados: PDF, DOC, DOCX (máx. 10MB cada uno)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">
                  Archivos Cargados ({uploadedFiles.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-sm">📄</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{file.name}</p>
                          <p className="text-sm text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Procesando archivos...</span>
                  <span className="text-sm text-slate-500">{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
                <p className="text-sm text-slate-600">
                  Extrayendo datos, analizando habilidades y generando predicciones...
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={processFiles}
                disabled={uploadedFiles.length === 0 || isProcessing}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isProcessing ? "Procesando..." : `Analizar ${uploadedFiles.length} CV(s)`}
              </Button>
              
              {uploadedFiles.length > 0 && !isProcessing && (
                <Button
                  variant="outline"
                  onClick={() => setUploadedFiles([])}
                >
                  Limpiar Lista
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Procesamiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">247</div>
                <p className="text-slate-600">CVs Procesados</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">96.8%</div>
                <p className="text-slate-600">Tasa de Éxito</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2.3s</div>
                <p className="text-slate-600">Tiempo Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UploadScreen;
