import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header'; // Import the Header component
import Footer from './components/Footer'; // Import the Footer component
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
