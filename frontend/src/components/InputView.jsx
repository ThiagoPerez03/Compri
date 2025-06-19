import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// Estilos
import './InputView.css';
import FileInput from './FileInput'; 

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

    const handleClearTextInput = () => {
        setTextInput('');
    };


    const handleSubmit = async (e) => {
        e.preventDefault(); 

        setLoading(true); 
        setSubmitError(null);

        const formData = new FormData(); 

        if (selectedFile) {
            formData.append('file', selectedFile);
        } else if (textInput.trim() !== '') {
            formData.append('text', textInput);
        } else {
            setSubmitError("Por favor, ingrese texto o seleccione un archivo para comprimir.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/app/api/compress/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Algo salió mal en el servidor.');
            }

            // Parsea la respuesta JSON exitosa
            const data = await response.json();
            console.log('Datos recibidos del backend:', data); 

            navigate('/resultado', { state: { compressionData: data } });

        } catch (err) {
            // Captura errores de red o errores lanzados desde la respuesta del servidor
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
            <Form.Group controlId="FileInput.jsx" className="mb-3">
                <Form.Label className="o"> ó </Form.Label>
                <FileInput
                    onFileSelect={handleFileSelected}
                    onClearText={handleClearTextInput}
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
