import React, { useState, useRef } from 'react';
import './FileInput.css';
import Image from 'react-bootstrap/Image';
import fileUploadArrow from '../assets/fileUploadArrow.png';

const FileUploadComponent = ({ onFileSelect, onClearText, acceptedExtension = '.txt', errorMessageText = 'Solo se permiten archivos .txt' }) => {
    const [fileName, setFileName] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    // Función de validación más robusta
    const isValidFile = (file) => {
        if (!file) return false;
        // La validación más confiable es por la extensión del nombre del archivo.
        return file.name.toLowerCase().endsWith(acceptedExtension);
    };

    const showAndClearError = (message) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(''), 3000);
    };

    const processFile = (file) => {
        if (isValidFile(file)) {
            setFileName(file.name);
            if (onFileSelect) onFileSelect(file);
            if (onClearText) onClearText();
            setErrorMessage('');
        } else {
            setFileName('');
            showAndClearError(errorMessageText);
            if (onFileSelect) onFileSelect(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            if (fileInputRef.current) {
                fileInputRef.current.files = event.dataTransfer.files;
            }
            processFile(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    // Determina si hay error para aplicar el estilo al borde
    const hasError = !!errorMessage;

    return (
        <div
            className={`file-upload-container ${isDragOver ? 'drag-over' : ''} ${hasError ? 'error-state-border' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={acceptedExtension} 
                style={{ display: 'none' }}
            />
            <div className="upload-icon">
                <Image src={fileUploadArrow} alt="FileUploadArrow"/>
            </div>
            <p className="upload-text">Subir Archivo</p>
            {/* Muestra el mensaje de error o la restricción de tipo de archivo */}
            <p className={`file-type-restriction ${hasError ? 'error-message-inline' : ''}`}>
                {errorMessage || errorMessageText}
            </p> 
            {fileName && !hasError && <p className="selected-file-name">Archivo seleccionado: {fileName}</p>}
        </div>
    );
};

export default FileUploadComponent;