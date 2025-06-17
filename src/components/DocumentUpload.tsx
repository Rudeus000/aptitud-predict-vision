import React, { useState } from 'react';
import { uploadDocument, processDocument } from '../services/api';

const DocumentUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) {
            setMessage('Por favor, selecciona un archivo');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            // Subir el documento
            const uploadResult = await uploadDocument(file);
            setMessage(`Documento subido exitosamente. ID: ${uploadResult.documento_id}`);
            // Procesar el documento
            const processResult = await processDocument(uploadResult.documento_id);
            setMessage(prev => `${prev}\nDocumento procesado: ${JSON.stringify(processResult)}`);
        } catch (error) {
            setMessage(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Seleccionar Documento
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mt-1 block w-full"
                        accept=".pdf,.docx,.txt"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !file}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${loading || !file 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Procesando...' : 'Subir y Procesar'}
                </button>
            </form>
            {message && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <pre className="whitespace-pre-wrap text-sm">{message}</pre>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload; 