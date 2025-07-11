import React from "react";
import { Card, Table} from 'react-bootstrap';
import './DifTable.css'

const DiffTable = ({huffmanDetails, shannonFanoDetails}) => {
  const Huffman = huffmanDetails;
  const FanoShannon = shannonFanoDetails;
  return (
    <Card className="diff-table">
      <Card.Header className="table-header">
        <h5 className="mb-0">Diferencia de algoritmos</h5>
      </Card.Header>
      <Card.Body className="table-body">
        <Table responsive hover className="mb-0 table-content">
          <thead>
            <tr>
              <th>ALGORITMO</th>
              <th>TASA DE COMP.</th>
              <th>EFICIENCIA</th>
              <th>LONG. PROM.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{'Huffman'}</td>
              <td>{Huffman.tasa_compresion_porcentaje} %</td>
              <td>{Huffman.eficiencia} %</td>
              <td>{Huffman.longitud_promedio_codigo}</td>
            </tr>
            <tr>
              <td>{'Shannon-Fano'}</td>
              <td>{FanoShannon.tasa_compresion_porcentaje} %</td>
              <td>{FanoShannon.eficiencia} %</td>
              <td>{FanoShannon.longitud_promedio_codigo}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default DiffTable;