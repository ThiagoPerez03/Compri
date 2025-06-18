import React from 'react';
import './FileOutput.css';
import Image from 'react-bootstrap/esm/Image';
import Button from 'react-bootstrap/Button';

import FileDownload from '../assets/fileDownload.png';

const CompressionSuccessCard = () => {
  const handleDownloadClick = () => {
    console.log('Botón Descargar clickeado!');
  };

  return (
    <div className="compression-card-wrapper">
      <h1 className="main-title">¡Tu texto ha sido comprimido correctamente!</h1> 

      <div className="compression-card-container">
        <div className="icon-wrapper">
          <Image src={FileDownload} alt="FileDownload" fluid /> 
        </div>
        <h2 className="title">Tu compresión</h2>
        <p className="description">Tu texto fue comprimido correctamente</p>
        <Button variant="primary" className="download-button" onClick={handleDownloadClick}>
          Descargar
        </Button>
      </div>
    </div>
  );
};

export default CompressionSuccessCard;