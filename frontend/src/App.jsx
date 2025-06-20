import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MainSwitcher from './components/MainSwitch'; 
import View2 from './components/View2'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

function App() {
  return (
    <div className="App">
      <Router> 
        <Header />
        <Routes> 
          <Route path="/" element={<MainSwitcher />} /> 
          <Route path="/resultado" element={<View2 />} /> 
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;