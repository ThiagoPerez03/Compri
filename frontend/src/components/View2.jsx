import { useLocation } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './View2.css';
import FileOutput from './FileOutput'; 
import Switch from './Switch';
import DiffTable from './DiffTable';

function View2() {
  const location = useLocation();
  
  const { compressionData } = location.state || {};

 
  if (!compressionData) {
    return (
      <div className="container mt-5">
        <h2>No hay datos de compresión disponibles</h2>
        <p>Por favor, regrese a la página principal e intente una nueva compresión.</p>
      </div>
    );
  }

  console.log('Datos de compresión recibidos en View2:', compressionData);

  return (
    <div className="View2">
      <FileOutput compressionData={compressionData} />
      <Switch compressionData={compressionData} /> 
      <DiffTable data={compressionData} />
    </div>
  );
}

export default View2;
