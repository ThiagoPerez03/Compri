import React from 'react';
import { Card, Table, ProgressBar, Image } from 'react-bootstrap';
import './AlgorithmTable.css';


import DropdownArrow from '../assets/DropdownArrow.png';


const AlgorithmDataTable = ({ data, title }) => {
  const tableData = data || [];

  const maxLongitud = Math.max(...tableData.map(item => item.longitud));

  return (
    <Card className="huffman-table-card">
      <Card.Header className="huffman-table-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5> 
      </Card.Header>
      <Card.Body className="huffman-table-body p-0">
        <Table responsive hover className="mb-0 huffman-table">
          <thead>
            <tr>
              <th>Símbolo <Image src={DropdownArrow} alt="DropdownArrow"/></th> 
              <th>Código <Image src={DropdownArrow} alt="DropdownArrow" /></th>
              <th>Frecuencia <Image src={DropdownArrow} alt="DropdownArrow" /></th>
              <th>Probabilidad <Image src={DropdownArrow} alt="DropdownArrow" /></th>
              <th>Longitud <Image src={DropdownArrow} alt="DropdownArrow" /></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={item.simbolo || index}>
                <td>{item.simbolo}</td>
                <td>{item.codigo}</td>
                <td>{item.frecuencia}</td>
                <td>{item.probabilidad.toFixed(3)}</td>
                <td className="longitud-cell">
                  {item.longitud}
                  <ProgressBar
                    now={(item.longitud / maxLongitud) * 100}
                    className="huffman-progress-bar"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default AlgorithmDataTable;