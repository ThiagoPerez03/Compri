import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import FileInput from './FileInput'; 
import './DecompressView.css';

const DecompressionView = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [decompressedText, setDecompressedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('huffman');

    const handleFileSelected = (file) => {
        setSelectedFile(file);
        setError(null); 
    };

    const handleDecompressSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setDecompressedText('');

        if (!selectedFile) {
            setError("Por favor, seleccione un archivo .zip para descomprimir.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('algorithm', selectedAlgorithm);

        try {
            const response = await fetch('http://localhost:8000/app/decompress/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al descomprimir el archivo.');
            }

            const data = await response.json();
            console.log('Texto descomprimido:', data.mensaje_decodificado);
            setDecompressedText(data.mensaje_decodificado || "No se pudo decodificar el mensaje.");

        } catch (err) {
            console.error('Error durante la descompresión:', err);
            setError(err.message || 'Error desconocido al descomprimir.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadDecompressedText = () => {
        if (!decompressedText) {
            alert("No hay texto descomprimido para descargar.");
            return;
        }

        const fileName = "texto_descomprimido.txt";
        const blob = new Blob([decompressedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`Texto descomprimido guardado como ${fileName}`);
    };

    const isSubmitDisabled = loading || !selectedFile;

    return (
        <Card className="decompression-card">
            <Card.Body>
                <Form onSubmit={handleDecompressSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Seleccionar algoritmo de descompresión:</Form.Label>
                        <div>
                            <Form.Check
                                inline
                                type="radio"
                                label="Huffman"
                                name="decompressionAlgorithm"
                                id="huffmanDecompress"
                                value="huffman"
                                checked={selectedAlgorithm === 'huffman'}
                                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                label="Shannon-Fano"
                                name="decompressionAlgorithm"
                                id="shannonFanoDecompress"
                                value="shannon_fano"
                                checked={selectedAlgorithm === 'shannon_fano'}
                                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <FileInput onFileSelect={handleFileSelected} />
                        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
                    </Form.Group>

                    <Button variant="primary" type="submit" className="decompress-button" disabled={isSubmitDisabled}>
                        {loading ? 'Descomprimiendo...' : 'Descomprimir'}
                    </Button>
                </Form>

                {decompressedText && (
                    <div className="mt-4">
                        <h5>Texto Descomprimido:</h5>
                        <Card className="p-3 bg-light decompressed-text-card">
                            <pre className="mb-0">{decompressedText}</pre>
                        </Card>
                        <Button
                            onClick={handleDownloadDecompressedText}
                            className="decompress-button mt-3"
                        >
                            Descargar Texto Descomprimido (.txt)
                        </Button>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default DecompressionView;
