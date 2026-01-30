import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Content from './components/Content';
import Work from './components/Work';
import Day from './components/Day';

function App() {
  return (
   <div>
    <Navbar />
    <Content />   
    <Work />
    <Day />   
    <Footer />
  </div>

  );
}

export default App
