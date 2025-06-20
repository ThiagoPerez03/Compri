import React, { useState } from 'react';
import './Switch.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';

import BinaryTree from './BinaryTree';
import AlgorithmDataTable from './AlgorithmTable';
import LengthTable from './LengthTable';
import FreqTable from './FreqTable';
import DiffTable from './DiffTable';

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

  const activeDetails = activeAlgorithm === 'huffman' ? huffmanDetails : shannonFanoDetails;

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
        <Container fluid>
          <Row>
            <Col md={8}>
              <AlgorithmDataTable className='tabla' data={activeDetails.tabla_codigos} title={`Tabla con algoritmo de ${activeAlgorithm === 'huffman' ? 'Huffman' : 'Shannon-Fano'}`}/>
            </Col>
            
            <Col md={4}>
              <Stack gap={4}>
                <FreqTable className='freq' data={activeDetails} />
                <LengthTable className='length' data={activeDetails} />
              </Stack>
            </Col>
          </Row>
        </Container>

        <Stack direction='vertical' gap={3} className='diff-bin align-items-center justify-content-center'>
          <DiffTable huffmanDetails={huffmanDetails} shannonFanoDetails={shannonFanoDetails} /> 
          {activeAlgorithm === 'huffman' && (
            <BinaryTree className='arbol-binario' treeData={huffmanDetails.datos_visualizacion_arbol}/>
          )}
        </Stack>
      </div>
    </div>
  );
};

export default AlgorithmSwitcher;
