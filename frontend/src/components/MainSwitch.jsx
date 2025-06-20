import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import InputView from './InputView';
import DecompressionView from './DecompressView';
import './MainSwitch.css';

const MainSwitcher = () => {
    const [activeMode, setActiveMode] = useState('compress');

    return (
        <div className="main-switcher-wrapper"> 
            <Card className="main-switcher-card mt-4 mb-4">
                <Card.Header className="d-flex justify-content-center">
                    <div className="toggle-switch">
                        <button
                            className={`toggle-button ${activeMode === 'compress' ? 'active' : ''}`}
                            onClick={() => setActiveMode('compress')}
                        >
                            Comprimir
                        </button>
                        <button
                            className={`toggle-button ${activeMode === 'decompress' ? 'active' : ''}`}
                            onClick={() => setActiveMode('decompress')}
                        >
                            Descomprimir
                        </button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="content-display">
                        <div className="mode-content"> 
                            {activeMode === 'compress' ? (
                                <InputView />
                            ) : (
                                <DecompressionView />
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default MainSwitcher;
