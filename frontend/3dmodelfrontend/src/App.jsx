import './pages design/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <NavBar />
      <main>{/* Your page component */}</main>
      <Footer />
    </>
  );
}

export default App
