import React, { useState } from 'react';
import './Switch.css'; 

import BinaryTree from './BinaryTree'; 


const HuffmanComponent = () => (
  <div className="algorithm-content">
    <h3>Contenido del Algoritmo Huffman</h3>
    <BinaryTree />
  </div>
);

const FanoShannonComponent = () => (
  <div className="algorithm-content">
    <h3>Contenido del Algoritmo Fano-Shannon</h3>

  </div>
);

const AlgorithmSwitcher = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState('huffman');

  const handleToggle = (algorithm) => {
    setActiveAlgorithm(algorithm);
  };

  return (
    <div className="algorithm-switcher-container">
      <div className="toggle-switch">
        <button
          className={`toggle-button ${activeAlgorithm === 'huffman' ? 'active' : ''}`}
          onClick={() => handleToggle('huffman')}
        >
          Huffman
        </button>
        <button
          className={`toggle-button ${activeAlgorithm === 'fano-shannon' ? 'active' : ''}`}
          onClick={() => handleToggle('fano-shannon')}
        >
          Fano-Shannon
        </button>
      </div>

      <div className="content-display">
        {activeAlgorithm === 'huffman' ? (
          <HuffmanComponent />
        ) : (
          <FanoShannonComponent />
        )}
      </div>
    </div>
  );
};

export default AlgorithmSwitcher;