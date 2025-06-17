import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header'; 
import Footer from './components/Footer';
import InputView from './components/InputView';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Header />
      <InputView />
      <Footer />
    </div>
  );
}

export default App;