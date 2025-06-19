import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import InputView from './components/InputView';
import View2 from './components/View2'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

function App() {
  const [count, setCount] = useState(0); 

  return (
    <div className="App">
      <Router> 
        <Header />
        <Routes> 
          <Route path="/" element={<InputView />} /> 
          <Route path="/resultado" element={<View2 />} /> 
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;