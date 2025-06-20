// frontend/src/components/InputView.jsx

// React
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

// Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// Componentes
import FileUploadComponent from './FileUpload';

// Estilos
import './InputView.css';

const InputView = () => {
    const navigate = useNavigate();

    const [textInput, setTextInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleTextChange = (e) => {
        setTextInput(e.target.value);
        if (selectedFile) {
            setSelectedFile(null);
        }
    };

    const handleFileSelected = (file) => {
        setSelectedFile(file);
        if (file) {
            setTextInput('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);

        const formData = new FormData();

        if (selectedFile) {
            formData.append('file', selectedFile);
        } else if (textInput.trim() !== '') {
            // --- AJUSTE IMPORTANTE AQUÍ ---
            // Ya no enviamos JSON, enviamos todo como form-data
            // para ser consistentes con la subida de archivos.
            formData.append('text', textInput);
        } else {
            setSubmitError("Por favor, ingrese texto o seleccione un archivo para comprimir.");
            setLoading(false);
            return;
        }

        try {
            // --- ¡LA LÍNEA MÁS IMPORTANTE! ---
            // 1. Obtenemos la URL de la API desde la variable de entorno.
            // 2. Si la variable no existe (porque estamos en desarrollo local),
            //    usamos 'http://localhost:8000' como respaldo.
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            
            // 3. Construimos la URL completa y hacemos la petición.
            const response = await fetch(`${apiUrl}/app/api/compress/`, {
                method: 'POST',
                body: formData,
            });
            // Ya no necesitamos 'Content-Type': 'application/json' porque estamos
            // enviando todo como FormData, y el navegador lo ajusta automáticamente.

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error del servidor: ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos del backend:', data);
            navigate('/resultado', { state: { compressionData: data } });

        } catch (err) {
            console.error('Error al enviar los datos:', err);
            setSubmitError(`Error de conexión o del servidor: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const isSubmitDisabled = loading || (textInput.trim() === '' && !selectedFile);

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="TextInput">
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ingrese el texto que desee comprimir"
                    value={textInput}
                    onChange={handleTextChange}
                    disabled={selectedFile !== null}
                />
            </Form.Group>

            <Form.Group controlId="FileInput" className="mb-3">
                <FileUploadComponent onFileSelected={handleFileSelected} onClearText={() => setTextInput('')} />
            </Form.Group>

            {submitError && <p className="text-danger mt-2">{submitError}</p>}
            <Button variant="primary" type="submit" className="SubmitBttn" disabled={isSubmitDisabled}>
                {loading ? 'Comprimiendo...' : 'Comprimir ahora'}
            </Button>
        </Form>
    );
}

export default InputView;
