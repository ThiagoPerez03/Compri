import React, { useState } from 'react';
import './Switch.css'; 

import huffmanData from '../Data/HuffmanData'; 
import fanoShannonData from '../Data/FanoShannonData';
import BinaryTree from './BinaryTree'; 


import AlgorithmDataTable from './AlgorithmTable'; 


const HuffmanComponent = () => (
  <div className="algorithm-content">
    <AlgorithmDataTable data={huffmanData} title="Tabla con Algoritmo de Huffman" />
    <BinaryTree />
  </div>
);

const FanoShannonComponent = () => (
  <div className="algorithm-content">
    <AlgorithmDataTable data={fanoShannonData} title="Tabla con Algoritmo de Fano-Shannon" />
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