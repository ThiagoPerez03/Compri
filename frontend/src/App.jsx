import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header'; // Import the Header component
import Footer from './components/Footer'; // Import the Footer component

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Header />
      <Footer />
    </div>
  );
}

export default App;
