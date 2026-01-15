import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Monitor, User, LogOut, Wrench } from 'lucide-react';

const Navbar = ({ onOpenCreateOS }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Função para aplicar estilo de ativo dinamicamente
  const getLinkClass = (path) => {
    const baseClass = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200";
    const activeClass = "border-[#22c55e] text-gray-900";
    const inactiveClass = "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";
    
    return `${baseClass} ${location.pathname === path ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50 font-sans">
      
      {/* Faixa decorativa */}
      <div className="w-full h-1 bg-gradient-to-r from-[#0f392b] via-[#22c55e] to-[#0f392b]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* ✅ LADO ESQUERDO: Logo e Menu Desktop */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
              <div className="bg-[#0f392b] p-1.5 rounded-lg">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              
              <h1 className="text-2xl font-bold tracking-tight flex items-center">
                <span className="text-gray-800">Control</span>
                <span className="text-[#22c55e] mx-0.5 font-extrabold">+</span>
                <span className="text-[#0f392b]">Save</span>
              </h1>
            </Link>
            
            {/* Links Desktop */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className={getLinkClass('/')}>
                Dashboard
              </Link>
              
              <Link to="/servicos" className={getLinkClass('/servicos')}>
                Serviços
              </Link>

              <button 
                onClick={onOpenCreateOS}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer"
              >
                Nova O.S
              </button>

              <Link to="/clientes" className={getLinkClass('/clientes')}>
                Clientes
              </Link>

              {/* ✨ NOVO LINK FINANCEIRO */}
              <Link to="/financeiro" className={getLinkClass('/financeiro')}>
                Financeiro
              </Link>
            </div>
          </div>

          {/* ✅ LADO DIREITO: Perfil / Ações */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-500 hover:text-[#0f392b] transition-colors">
               <span className="sr-only">Ver perfil</span>
               <User className="h-6 w-6" />
            </button>
            <button className="flex items-center gap-2 bg-[#0f392b] hover:bg-[#0a271d] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>

          {/* ✅ MOBILE: Botão do Menu Hambúrguer */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Abrir menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ✨ MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
              Dashboard
            </Link>
            <Link to="/servicos" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
              Serviços
            </Link>
            <button 
                onClick={() => {
                    onOpenCreateOS();
                    setIsOpen(false);
                }}
                className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            >
              Nova O.S
            </button>
            <Link to="/clientes" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
              Clientes
            </Link>
            {/* ✨ NOVO LINK FINANCEIRO MOBILE */}
            <Link to="/financeiro" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
              Financeiro
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;