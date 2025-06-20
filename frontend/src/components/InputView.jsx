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
        let requestBody;
        let headers = {};

        if (selectedFile) {
            formData.append('file', selectedFile);
            requestBody = formData;
            // No establezcas Content-Type, el navegador lo hará por ti para multipart/form-data
        } else if (textInput.trim() !== '') {
            requestBody = JSON.stringify({ text: textInput });
            headers['Content-Type'] = 'application/json';
        } else {
            setSubmitError("Por favor, ingrese texto o seleccione un archivo para comprimir.");
            setLoading(false);
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            
            const response = await fetch(`${apiUrl}/app/api/compress/`, {
                method: 'POST',
                headers: headers,
                body: requestBody,
            });

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
                <FileUploadComponent 
                    onFileSelect={handleFileSelected} 
                    onClearText={() => setTextInput('')}
                    // Props para configurar el tipo de archivo permitido
                    acceptedExtension=".txt"
                    errorMessageText="Solo se permiten archivos .txt"
                />
            </Form.Group>

            {submitError && <p className="text-danger mt-2">{submitError}</p>}
            <Button variant="primary" type="submit" className="SubmitBttn" disabled={isSubmitDisabled}>
                {loading ? 'Comprimiendo...' : 'Comprimir ahora'}
            </Button>
        </Form>
    );
}

export default InputView;