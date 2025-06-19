import React, { useState } from 'react';
import './Switch.css';

import BinaryTree from './BinaryTree'; 
import AlgorithmDataTable from './AlgorithmTable';


const HuffmanComponent = ({ huffmanDetails }) => (
  <div className="algorithm-content">
    <AlgorithmDataTable data={huffmanDetails.tabla_codigos} title="Tabla con Algoritmo de Huffman" />
    <BinaryTree treeData={huffmanDetails.datos_visualizacion_arbol} /> 
  </div>
);

const ShannonFanoComponent = ({ shannonFanoDetails }) => (
  <div className="algorithm-content">
    <AlgorithmDataTable data={shannonFanoDetails.tabla_codigos} title="Tabla con Algoritmo de Shannon-Fano" />
  </div>
);

const AlgorithmSwitcher = ({ compressionData }) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState('huffman');

  const handleToggle = (algorithm) => {
    setActiveAlgorithm(algorithm);
  };

  const huffmanDetails = compressionData?.algoritmos?.huffman;
  const shannonFanoDetails = compressionData?.algoritmos?.shannon_fano;

  if (!huffmanDetails || !shannonFanoDetails) {
    return <div className="p-3 text-center">Cargando datos de algoritmos...</div>;
  }

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
          className={`toggle-button ${activeAlgorithm === 'shannon-fano' ? 'active' : ''}`}
          onClick={() => handleToggle('shannon-fano')}
        >
          Shannon-Fano
        </button>
      </div>

      <div className="content-display">
        {activeAlgorithm === 'huffman' ? (
          <HuffmanComponent huffmanDetails={huffmanDetails} />
        ) : (
          <ShannonFanoComponent shannonFanoDetails={shannonFanoDetails} />
        )}
      </div>
    </div>
  );
};

export default AlgorithmSwitcher;