
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CVUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CVUploadModal = ({ open, onOpenChange }: CVUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // Simular carga exitosa
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "CV actualizado exitosamente",
        description: "Tu CV ha sido procesado y analizado por nuestra IA.",
      });
      
      onOpenChange(false);
      setFile(null);
    } catch (error) {
      toast({
        title: "Error al subir CV",
        description: "Hubo un problema al procesar tu CV. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Actualizar CV</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cv-file">Selecciona tu CV actualizado</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <Input
                id="cv-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label htmlFor="cv-file" className="cursor-pointer">
                {file ? (
                  <span className="text-blue-600">{file.name}</span>
                ) : (
                  <span className="text-slate-500">Haz clic para seleccionar un archivo PDF, DOC o DOCX</span>
                )}
              </Label>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="flex-1"
            >
              {uploading ? 'Procesando...' : 'Subir CV'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVUploadModal;
