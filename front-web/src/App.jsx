import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DetalhesOS from './pages/DetalhesOS';
import CreateOSModal from './components/CreateOSModal';
import ServicosPage from './pages/ServicosPage'; 
import ClientesPage from './pages/ClientesPage'; // ✨ IMPORT NOVO
import FinanceiroPage from './pages/FinanceiroPage'; // ✨ Import Novo

function App() {
  // Estado para controlar se o Modal de Nova OS está visível ou não
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      {/* Wrapper principal */}
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
        
        {/* Passamos a função de abrir o modal para a Navbar */}
        <Navbar onOpenCreateOS={() => setIsModalOpen(true)} />

        {/* Container centralizado */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/os/:id" element={<DetalhesOS />} />
            <Route path="/servicos" element={<ServicosPage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />
            {/* ✨ NOVA ROTA: Página de Clientes */}
            <Route path="/clientes" element={<ClientesPage />} />
          </Routes>
        </main>

        {/* Renderização Condicional do Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
             {/* Backdrop escuro */}
             <div 
               className="fixed inset-0 bg-black/50 transition-opacity" 
               onClick={() => setIsModalOpen(false)}
             ></div>

             {/* O Modal em si */}
             <div className="relative z-10 w-full max-w-2xl">
                <CreateOSModal 
                    isOpen={isModalOpen} // Garante que o modal saiba que está aberto
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={() => {
                        // ✨ Quando criar a OS com sucesso, atualiza a página para mostrar na lista
                        window.location.reload(); 
                    }}
                />
             </div>
          </div>
        )}

      </div>
    </Router>
  );
}

export default App;