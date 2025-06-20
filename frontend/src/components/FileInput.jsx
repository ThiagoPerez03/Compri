import React, { useState, useRef } from 'react';
import './FileInput.css';
import Image from 'react-bootstrap/Image';
import fileUploadArrow from '../assets/fileUploadArrow.png';

const FileUploadComponent = ({ onFileSelect, onClearText }) => {
    const [fileName, setFileName] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);
    const fileInputRef = useRef(null);

    const allowedMimeTypes = [
        'application/zip',
        'application/x-zip-compressed',
        'multipart/x-zip'
    ];
    const errorMessageText = 'Solo se permiten archivos .zip';
    const acceptedFileExtension = '.zip';

    const isValidFile = (file) => {
        const isMimeTypeValid = allowedMimeTypes.includes(file.type);
        const isExtensionValid = file.name.toLowerCase().endsWith(acceptedFileExtension);

        return isMimeTypeValid || isExtensionValid;
    };

    const showAndClearError = (message) => {
        setErrorMessage(message);
        setHasError(true);

        setTimeout(() => {
            setErrorMessage('');
            setHasError(false);
        }, 3000);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setErrorMessage('');
        setHasError(false);

        if (file) {
            if (isValidFile(file)) {
                setFileName(file.name);
                console.log('Archivo seleccionado:', file.name, 'Tipo MIME:', file.type);
                if (onFileSelect) {
                    onFileSelect(file);
                }
                if (onClearText) { 
                    onClearText();
                }
            } else {
                setFileName('');
                showAndClearError(errorMessageText);
                if (onFileSelect) {
                    onFileSelect(null);
                }
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } else {
            setFileName('');
            if (onFileSelect) {
                onFileSelect(null);
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
        setErrorMessage('');
        setHasError(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            if (isValidFile(file)) {
                setFileName(file.name);
                console.log('Archivo soltado:', file.name, 'Tipo MIME:', file.type);
                if (fileInputRef.current) {
                    fileInputRef.current.files = event.dataTransfer.files;
                }
                if (onFileSelect) {
                    onFileSelect(file);
                }
                if (onClearText) { 
                    onClearText();
                }
            } else {
                setFileName('');
                showAndClearError(errorMessageText);
                if (onFileSelect) {
                    onFileSelect(null);
                }
            }
        } else {
            setFileName('');
            if (onFileSelect) {
                onFileSelect(null);
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
                accept={acceptedFileExtension} 
                style={{ display: 'none' }}
            />
            <div className="upload-icon">
                <Image src={fileUploadArrow} alt="FileUploadArrow"/>
            </div>
            <p className="upload-text">Subir Archivo</p>
            <p className="file-type-restriction">{errorMessageText}</p> 
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
