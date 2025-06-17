import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText, X, Brain, Clock, CheckCircle } from 'lucide-react';
import { uploadDocument, processDocument } from '../services/api';

const UploadScreen = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);

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
    setResults([]);

    let processed = 0;
    for (const file of uploadedFiles) {
      try {
        // 1. Subir el documento
        const uploadResult = await uploadDocument(file);
        // 2. Procesar el documento
        const processResult = await processDocument(uploadResult.documento_id);
        setResults(prev => [...prev, { file: file.name, status: 'ok', result: processResult }]);
        toast({
          title: `✔️ ${file.name}`,
          description: 'Procesado correctamente',
        });
      } catch (error: any) {
        setResults(prev => [...prev, { file: file.name, status: 'error', error: error?.message || 'Error' }]);
        toast({
          title: `❌ ${file.name}`,
          description: error?.message || 'Error al procesar',
          variant: 'destructive',
        });
      }
      processed++;
      setProcessingProgress(Math.round((processed / uploadedFiles.length) * 100));
    }

    toast({
      title: "¡Procesamiento completado!",
      description: `${uploadedFiles.length} CV(s) analizados`,
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
            <div className="flex items-center space-x-2">
              <Upload className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl">Carga de Currículums</CardTitle>
            </div>
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
                  <Upload className="h-8 w-8 text-blue-600" />
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
                <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Archivos Cargados ({uploadedFiles.length})</span>
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
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
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Procesando archivos...</span>
                  </div>
                  <span className="text-sm text-slate-500">{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
                <p className="text-sm text-slate-600">
                  Extrayendo datos, analizando habilidades y generando predicciones...
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Resultados</span>
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {results.map((res, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 border rounded">
                      <div className="font-medium text-slate-700">{res.file}</div>
                      {res.status === 'ok' ? (
                        <pre className="text-xs text-green-700 whitespace-pre-wrap">{JSON.stringify(res.result, null, 2)}</pre>
                      ) : (
                        <div className="text-xs text-red-600">Error: {res.error}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={processFiles}
                disabled={uploadedFiles.length === 0 || isProcessing}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                {isProcessing ? "Procesando..." : `Analizar ${uploadedFiles.length} CV(s)`}
              </Button>
              
              {uploadedFiles.length > 0 && !isProcessing && (
                <Button
                  variant="outline"
                  onClick={() => setUploadedFiles([])}
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar Lista
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle>Estado del Sistema</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-slate-400">--</div>
                <p className="text-slate-600">Tiempo Promedio</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">100%</div>
                <p className="text-slate-600">Sistema Operativo</p>
              </div>
              <div className="text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-slate-400">--</div>
                <p className="text-slate-600">Precisión IA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UploadScreen;
