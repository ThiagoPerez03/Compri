import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header'; // Import the Header component
import Footer from './components/Footer'; // Import the Footer component
import InputView from './components/InputView';
import FreqTable from './components/FreqTable';

function App() {
  return (
    <div className="App">
      <Header />
      <InputView />
      <FreqTable />
      <Footer />
    </div>
  );
}

export default App;
