import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // ✨ Import da nova Navbar
import Home from './pages/Home';
import DetalhesOS from './pages/DetalhesOS';

function App() {
  return (
    <Router>
      {/* ✨ Wrapper principal: Define altura mínima e fundo cinza claro (padrão dashboard) */}
      <div className="min-h-screen bg-gray-50 text-gray-900">
        
        {/* ✅ A Navbar fica aqui para aparecer em TODAS as rotas */}
        <Navbar />

        {/* ✨ Container centralizado para limitar a largura do conteúdo */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/os/:id" element={<DetalhesOS />} /> 
          </Routes>
        </main>

      </div>
    </Router>
  )
}

export default App;