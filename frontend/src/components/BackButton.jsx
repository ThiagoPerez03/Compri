import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Image } from 'react-bootstrap'; 
import ArrowLeft from '../assets/Arrowleft.png';
import './BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <Button 
            className="back-button-custom" 
            onClick={handleGoBack}
        >
            <Image src={ArrowLeft} alt="Volver" style={{ width: '18px', height: '18px', marginRight: '8px' }} /> 
            Volver
        </Button>
    );
};

export default BackButton;
