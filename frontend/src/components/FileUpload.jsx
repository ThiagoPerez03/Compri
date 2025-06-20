import React, { useState, useRef } from 'react';
import './FileInput.css';
import Image from 'react-bootstrap/Image';
import fileUploadArrow from '../assets/fileUploadArrow.png';

// Add 'onFileSelected' to the destructuring of props
const FileUploadComponent = ({ onFileSelected }) => {
    const [fileName, setFileName] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);
    const fileInputRef = useRef(null);

    // Función para mostrar el error y programar su limpieza
    const showAndClearError = (message) => {
        setErrorMessage(message);
        setHasError(true);

        // Limpiar el error después de 3 segundos
        setTimeout(() => {
            setErrorMessage('');
            setHasError(false);
        }, 3000); // 3000 milisegundos = 3 segundos
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Limpiar cualquier error activo inmediatamente al interactuar de nuevo
        setErrorMessage('');
        setHasError(false);

        if (file) {
            if (file.type === 'text/plain') {
                setFileName(file.name);
                console.log('Archivo seleccionado:', file.name);
                // Call the prop function to pass the file up to the parent
                if (onFileSelected) {
                    onFileSelected(file);
                }
            } else {
                setFileName('');
                showAndClearError('Solo se permiten archivos .txt');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // If there's an error, clear the selected file in the parent
                if (onFileSelected) {
                    onFileSelected(null);
                }
            }
        } else {
            // If no file is selected (e.g., user cancels dialog)
            setFileName('');
            if (onFileSelected) {
                onFileSelected(null);
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        // Limpiar cualquier error activo inmediatamente al interactuar de nuevo
        setErrorMessage('');
        setHasError(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            if (file.type === 'text/plain') {
                setFileName(file.name);
                console.log('Archivo soltado:', file.name);
                if (fileInputRef.current) {
                    fileInputRef.current.files = event.dataTransfer.files;
                }
                // Call the prop function to pass the file up to the parent
                if (onFileSelected) {
                    onFileSelected(file);
                }
            } else {
                setFileName('');
                showAndClearError('Solo se permiten archivos .txt');
                // If there's an error, clear the selected file in the parent
                if (onFileSelected) {
                    onFileSelected(null);
                }
            }
        } else {
            // If no file is dropped
            setFileName('');
            if (onFileSelected) {
                onFileSelected(null);
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

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
                accept=".txt"
                style={{ display: 'none' }}
            />
            <div className="upload-icon">
                <Image src={fileUploadArrow} alt="FileUploadArrow" />
            </div>
            <p className="upload-text">Subir Archivo</p>
            <p className="file-type-restriction">Solo archivos .txt están permitidos</p>
            {fileName && <p className="selected-file-name">Archivo seleccionado: {fileName}</p>}

            {errorMessage && (
                <p className="error-message-inline">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default FileUploadComponent;
