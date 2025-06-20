// React
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

// Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// Componentes
import FileUploadComponent from './FileUpload'; // Make sure the path is correct

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
        // If text is entered, clear any selected file
        if (selectedFile) {
            setSelectedFile(null);
        }
    };

    // This function will be passed to FileUploadComponent
    const handleFileSelected = (file) => {
        setSelectedFile(file);
        // If a file is selected, clear the text input
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
            const response = await fetch('http://localhost:8000/app/compress/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error del servidor: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Datos recibidos del backend:', data);

            navigate('/resultado', { state: { compressionData: data } });

        } catch (err) {
            console.error('Error al enviar los datos:', err);
            setSubmitError(`Error de conexiÃ³n o del servidor: ${err.message}`);
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
                    // Disable text input if a file is selected
                    disabled={selectedFile !== null}
                />
            </Form.Group>

            {/* Integrate FileUploadComponent here */}
            <Form.Group controlId="FileInput" className="mb-3">
                <FileUploadComponent onFileSelected={handleFileSelected} />
            </Form.Group>

            {submitError && <p className="text-danger mt-2">{submitError}</p>}
            <Button variant="primary" type="submit" className="SubmitBttn" disabled={isSubmitDisabled}>
                {loading ? 'Comprimiendo...' : 'Comprimir ahora'}
            </Button>
        </Form>
    );
}

export default InputView;
