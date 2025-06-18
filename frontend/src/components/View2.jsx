import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './View2.css';
import FileOutput from './FileOutput'; 

function View2() {
  const [count, setCount] = useState(0);

  return (
    <div className="View2">
        <FileOutput />
    </div>
  );
}

export default View2;