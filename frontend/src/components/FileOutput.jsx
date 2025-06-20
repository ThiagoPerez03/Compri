import React from 'react';
import './FileOutput.css';
import { Image, Button, Alert } from 'react-bootstrap';
import FileDownload from '../assets/fileDownload.png';

const CompressionSuccessCard = ({ compressionData }) => {
    const [downloadError, setDownloadError] = React.useState(null);
    const [downloading, setDownloading] = React.useState(false);

    const handleDownloadClick = async (algorithm) => {
        console.log(`Botón Descargar para ${algorithm} clickeado!`);
        setDownloadError(null); 
        setDownloading(true); 

        if (!compressionData || !compressionData.mensaje_original) {
            setDownloadError('No se encontró el texto original para generar la descarga. Por favor, vuelva a comprimir.');
            setDownloading(false);
            return;
        }

        try {
            const encodedOriginalText = encodeURIComponent(compressionData.mensaje_original);
            const downloadUrl = `http://localhost:8000/app/compress/?download=true&algorithm=${algorithm}&original_text=${encodedOriginalText}`;
            
            const response = await fetch(downloadUrl);

            if (!response.ok) {
                let errorMsg = `Error al descargar el archivo de ${algorithm}.`;
                try {
                    const errorJson = await response.json();
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) {
                    errorMsg = `Error de servidor (${response.status}) al descargar el archivo de ${algorithm}.`;
                }
                throw new Error(errorMsg);
            }

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

                <div className="d-flex justify-content-around mt-3">
                    <Button 
                        variant="primary" 
                        className="download-button" 
                        onClick={() => handleDownloadClick('huffman')}
                        disabled={downloading || !compressionData?.mensaje_original}
                    >
                        {downloading ? 'Descargando...' : 'Descargar Huffman'}
                    </Button>
                    <Button 
                        variant="info" 
                        className="download-button ms-2" 
                        onClick={() => handleDownloadClick('shannon_fano')}
                        disabled={downloading || !compressionData?.mensaje_original}
                    >
                        {downloading ? 'Descargando...' : 'Descargar Shannon-Fano'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompressionSuccessCard;
