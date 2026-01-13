import React, { useState } from 'react';
import { Menu, X, Monitor, User, LogOut } from 'lucide-react'; // Instale: npm install lucide-react

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // ✨ Container principal com sombra suave e fixo no topo
    <nav className="bg-white shadow-md w-full sticky top-0 z-50 font-sans">
      
      {/* ✨ Faixa decorativa no topo usando as cores da marca (Gradiente sutil) */}
      <div className="w-full h-1 bg-gradient-to-r from-[#0f392b] via-[#22c55e] to-[#0f392b]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* ✅ LADO ESQUERDO: Logo e Marca */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
              {/* Ícone de Monitor (referência ao logo) */}
              <div className="bg-[#0f392b] p-1.5 rounded-lg">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              
              {/* Texto da Marca */}
              <h1 className="text-2xl font-bold tracking-tight flex items-center">
                <span className="text-gray-800">Control</span>
                <span className="text-[#22c55e] mx-0.5 font-extrabold">+</span>
                <span className="text-[#0f392b]">Save</span>
              </h1>
            </div>
            
            {/* Links Desktop (Visíveis apenas em telas md ou maiores) */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="#" className="border-[#22c55e] text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Nova O.S
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Clientes
              </a>
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#22c55e]"
            >
              <span className="sr-only">Abrir menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ✨ MENU MOBILE (Responsivo) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            <a href="#" className="bg-[#0f392b]/10 border-l-4 border-[#0f392b] text-[#0f392b] block pl-3 pr-4 py-2 text-base font-medium">
              Dashboard
            </a>
            <a href="#" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium">
              Nova O.S
            </a>
            <a href="#" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium">
              Clientes
            </a>
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200">
             <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                   <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500"/>
                   </div>
                </div>
                <div className="ml-3">
                   <div className="text-base font-medium text-gray-800">Técnico Admin</div>
                   <div className="text-sm font-medium text-gray-500">nicolas@controlsave.com.br</div>
                </div>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;