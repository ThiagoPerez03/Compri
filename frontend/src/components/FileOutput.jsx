import React from 'react';
import './FileOutput.css';
import { Image, Button, Alert } from 'react-bootstrap';
import FileDownload from '../assets/FileDownload.png';

const FileOutput = ({ compressionData }) => {
    const [downloadError, setDownloadError] = React.useState(null);
    const [downloading, setDownloading] = React.useState(false);

    const handleDownloadClick = async (algorithm) => {
        console.log(`Iniciando descarga para ${algorithm}...`);
        setDownloadError(null); 
        setDownloading(true); 

        if (!compressionData || !compressionData.mensaje_original) {
            setDownloadError('No se encontró el texto original para generar la descarga. Por favor, vuelva a comprimir.');
            setDownloading(false);
            return;
        }

        try {
            // 1. Obtiene la URL del backend desde las variables de entorno (o usa localhost si no existe)
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const encodedOriginalText = encodeURIComponent(compressionData.mensaje_original);
            
            // 2. Construye la URL de descarga correcta, incluyendo /api/
            const downloadUrl = `${apiUrl}/app/api/compress/?download=true&algorithm=${algorithm}&original_text=${encodedOriginalText}`;
            
            const response = await fetch(downloadUrl);

            if (!response.ok) {
                let errorMsg = `Error de servidor (${response.status}) al descargar el archivo de ${algorithm}.`;
                try {
                    const errorJson = await response.json();
                    errorMsg = errorJson.error || errorMsg;
                } catch {
                    // El cuerpo de la respuesta de error podría no ser JSON
                }
                throw new Error(errorMsg);
            }

            // 3. Procesa la respuesta y ofrece el archivo para descargar
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `comprimido_${algorithm}.zip`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`Archivo ZIP de ${algorithm} generado y descarga iniciada.`);

        } catch (err) {
            console.error('Error durante la descarga:', err);
            setDownloadError(err.message || 'Error desconocido al iniciar la descarga.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="compression-card-wrapper">
            <h1 className="main-title">¡Tu texto ha sido comprimido correctamente!</h1>

            <div className="compression-card-container">
                <div className="icon-wrapper">
                    <Image src={FileDownload} alt="FileDownload" fluid />
                </div>
                <h2 className="title">Tu compresión</h2>
                <p className="description">Tu texto fue comprimido correctamente.</p>
                
                {downloadError && (
                    <Alert variant="danger" className="mt-3">
                        {downloadError}
                    </Alert>
                )}

                <div className="button-group-container mt-3">
                    <Button 
                        variant="primary" 
                        className="download-button" 
                        onClick={() => handleDownloadClick('huffman')}
                        disabled={downloading}
                    >
                        {downloading ? 'Descargando...' : 'Descargar Huffman'}
                    </Button>
                    <Button 
                        variant="primary" 
                        className="download-button" 
                        onClick={() => handleDownloadClick('shannon_fano')}
                        disabled={downloading}
                    >
                        {downloading ? 'Descargando...' : 'Descargar Shannon-Fano'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FileOutput;