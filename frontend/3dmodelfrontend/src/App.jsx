// App.jsx
import './pages design/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet /> {/* This is where the routed page (Home, Catalog, etc.) will render */}
      </main>
      <Footer />
    </>
  );
}

export default App;
