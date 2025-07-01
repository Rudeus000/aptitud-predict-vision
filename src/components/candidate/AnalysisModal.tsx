import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateData: any;
}

const AnalysisModal = ({ open, onOpenChange, candidateData }: AnalysisModalProps) => {
  const prediction = candidateData?.prediction;
  const processedData = candidateData?.processedData;

  if (!prediction || !processedData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>📊 Análisis Completo de Perfil</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Puntuación general */}
          <Card>
            <CardHeader>
              <CardTitle>Puntuación de Aptitud</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {prediction.probabilidad_exito}%
                </div>
                <Progress value={prediction.probabilidad_exito} className="mb-4" />
                <p className="text-slate-600">Probabilidad de éxito en el puesto</p>
              </div>
            </CardContent>
          </Card>

          {/* Factores clave */}
          <Card>
            <CardHeader>
              <CardTitle>Factores Clave Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {prediction.factores_clave?.map((factor: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Habilidades técnicas */}
          <Card>
            <CardHeader>
              <CardTitle>Habilidades Técnicas Detectadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {processedData.habilidades_indexadas?.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Habilidades técnicas y profesionales por categoría */}
          <Card>
            <CardHeader>
              <CardTitle>Habilidades Detectadas por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              {processedData.data_extraida?.habilidades_detalladas && (
                <div className="space-y-4">
                  {Object.entries(processedData.data_extraida.habilidades_detalladas).map(
                    ([categoria, skills]: [string, any[]]) =>
                      skills && skills.length > 0 ? (
                        <div key={categoria}>
                          <div className="font-semibold text-blue-700 mb-1 capitalize">{categoria.replace(/_/g, ' ')}</div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {skills.map((skill, idx) => (
                              <Badge key={idx} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      ) : null
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Otras habilidades detectadas (si existen) */}
          {processedData.data_extraida?.otras_habilidades && processedData.data_extraida.otras_habilidades.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Otras habilidades detectadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {processedData.data_extraida.otras_habilidades.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Datos del perfil */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Nombre:</strong> {processedData.data_extraida.nombre}
                </div>
                <div>
                  <strong>Puesto:</strong> {processedData.data_extraida.puesto_actual}
                </div>
                <div>
                  <strong>Empresa:</strong> {processedData.data_extraida.empresa_actual}
                </div>
                <div>
                  <strong>Experiencia:</strong> {processedData.data_extraida.experiencia_anos} años
                </div>
                <div>
                  <strong>Ubicación:</strong> {processedData.data_extraida.ubicacion}
                </div>
                <div>
                  <strong>Educación:</strong> {processedData.data_extraida.educacion}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisModal;
