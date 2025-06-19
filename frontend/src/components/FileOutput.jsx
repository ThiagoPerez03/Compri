import React from 'react';
import './FileOutput.css'; 
import Image from 'react-bootstrap/esm/Image';
import Button from 'react-bootstrap/Button';

import FileDownload from '../assets/fileDownload.png';

const CompressionSuccessCard = ({ compressionData }) => {

    const handleDownloadClick = () => {
        console.log('Botón Descargar clickeado!');

        // Verifica si los datos de compresión están disponibles
        if (!compressionData || !compressionData.mensaje_original) {
            console.error('No hay datos de compresión disponibles para descargar.');
            alert('No se pudo generar el archivo para descargar. Intente de nuevo.');
            return;
        }

        // --- Lógica para generar el contenido del archivo de texto descargable ---
        let fileContent = `Resultados de Compresión:\n\n`;
        fileContent += `Mensaje Original:\n${compressionData.mensaje_original}\n\n`;
        fileContent += `Longitud Original (bits): ${compressionData.longitud_original_bits} bits\n\n`;

        // Genera el contenido para el algoritmo de Huffman
        if (compressionData.algoritmos && compressionData.algoritmos.huffman) {
            const huffman = compressionData.algoritmos.huffman;
            fileContent += `--- Algoritmo Huffman ---\n`;
            fileContent += `Cadena de Bits Codificada: ${huffman.cadena_bits_codificada}\n`;
            fileContent += `Longitud Comprimida (bits): ${huffman.longitud_comprimida_bits} bits\n`;
            fileContent += `Tasa de Compresión: ${huffman.tasa_compresion_porcentaje}%\n`;
            fileContent += `Longitud Promedio del Código: ${huffman.longitud_promedio_codigo}\n`;
            fileContent += `Mensaje Decodificado (verificación): ${huffman.mensaje_decodificado}\n`; 
            fileContent += `Tabla de Códigos de Huffman:\n`;
  
            if (huffman.tabla_codigos && Array.isArray(huffman.tabla_codigos)) {
                huffman.tabla_codigos.forEach(item => {
                
                    const charDisplay = item.caracter === ' ' ? "' '" : `'${item.caracter}'`;
                    fileContent += `  ${charDisplay}: Código=${item.codigo}, Frecuencia=${item.frecuencia}, Probabilidad=${item.probabilidad}\n`;
                });
            }
            fileContent += `\n\n`;
        }

        // Genera el contenido para el algoritmo de Shannon-Fano
        if (compressionData.algoritmos && compressionData.algoritmos.shannon_fano) {
            const shannonFano = compressionData.algoritmos.shannon_fano;
            fileContent += `--- Algoritmo Shannon-Fano ---\n`;
            fileContent += `Cadena de Bits Codificada: ${shannonFano.cadena_bits_codificada}\n`;
            fileContent += `Longitud Comprimida (bits): ${shannonFano.longitud_comprimida_bits} bits\n`;
            fileContent += `Tasa de Compresión: ${shannonFano.tasa_compresion_porcentaje}%\n`;
            fileContent += `Longitud Promedio del Código: ${shannonFano.longitud_promedio_codigo}\n`;
            fileContent += `Mensaje Decodificado (verificación): ${shannonFano.mensaje_decodificado}\n`;
            fileContent += `Tabla de Códigos de Shannon-Fano:\n`;
  
            if (shannonFano.tabla_codigos && Array.isArray(shannonFano.tabla_codigos)) {
                shannonFano.tabla_codigos.forEach(item => {
                    const charDisplay = item.caracter === ' ' ? "' '" : `'${item.caracter}'`;
                    fileContent += `  ${charDisplay}: Código=${item.codigo}, Frecuencia=${item.frecuencia}, Probabilidad=${item.probabilidad}\n`;
                });
            }
            fileContent += `\n`;
        }

        // --- Lógica de descarga del archivo ---
        // Crea un Blob (Binary Large Object) a partir del contenido de texto
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });

        // Crea una URL temporal en memoria para el Blob
        const url = URL.createObjectURL(blob);

        // Crea un elemento 'a' (enlace) de forma programática en el DOM
        const link = document.createElement('a');
        link.href = url;
        // Asigna el nombre del archivo que se descargará
        link.download = 'resultados_compresion.txt'; 

        // Añade el enlace al cuerpo del documento
        document.body.appendChild(link); 
        // Simula un clic en el enlace para iniciar la descarga
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('Archivo de resultados generado y descarga iniciada.');
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
                <Button variant="primary" className="download-button" onClick={handleDownloadClick}>
                    Descargar 
                </Button>
            </div>
        </div>
    );
};

export default CompressionSuccessCard;
