import React, { useState } from 'react';
import './Switch.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import BinaryTree from './BinaryTree';
import AlgorithmDataTable from './AlgorithmTable';
import LengthTable from './LengthTable';
import FreqTable from './FreqTable';
import DiffTable from './DiffTable';
import { Stack } from 'react-bootstrap';


const HuffmanComponent = ({ huffmanDetails, shannonFanoDetails }) => (
  <div className="algorithm-content">
    <AlgorithmDataTable data={huffmanDetails.tabla_codigos} title="Tabla con Algoritmo de Huffman" />
    <Stack className='align-items-center justify-content-center' direction='vertical' gap={3} style={{minHeight: "100vh"}}>
      <DiffTable huffmanDetails={huffmanDetails} shannonFanoDetails={shannonFanoDetails} />
      <BinaryTree treeData={huffmanDetails.datos_visualizacion_arbol} />
    </Stack>
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
          <Container fluid>
            <Row>
              <Col md={8}>
                <AlgorithmDataTable className='tabla' data={huffmanDetails.tabla_codigos} title={"tabla con algoritmo de Huffman"}/>
              </Col>
              <Col md={4}>
                <Row className="mb-4">
                  <Col>
                    <FreqTable className='freq' data={huffmanDetails} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <LengthTable className='length' data={huffmanDetails} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        ) : (
          <Container fluid>
            <Row>
              <Col md={8}>
                <AlgorithmDataTable className='tabla' data={shannonFanoDetails.tabla_codigos} title={"tabla con algoritmo de Huffman"}/>
              </Col>
              <Col md={4}>
                <Row className="mb-4">
                  <Col>
                    <FreqTable className='freq' data={shannonFanoDetails} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <LengthTable className='length' data={shannonFanoDetails} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>

        )}
        <Stack direction='vertical' gap={3} className='diff-bin align-items-center justify-content-center'>
          <DiffTable huffmanDetails={huffmanDetails} shannonFanoDetails={shannonFanoDetails} /> 
          {activeAlgorithm === 'huffman' ? (
          <BinaryTree className='arbol-binario' treeData={huffmanDetails.datos_visualizacion_arbol}/>
          ):(
          <>
          </>
          )}
        </Stack>
      </div>
    </div>
  );
};

export default AlgorithmSwitcher;
