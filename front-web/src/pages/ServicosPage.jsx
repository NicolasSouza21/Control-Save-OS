import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, DollarSign, Tag, Loader2 } from 'lucide-react';
import api from '../services/api'; 
import { formatCurrency } from '../utils/format'; 

const ServicosPage = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // ✨ Estado de loading ao salvar
  
  // Form States
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');

  // 🔄 Buscar serviços ao carregar
  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      // ✅ CORREÇÃO AQUI: Adicionado '/api'
      const response = await api.get('/api/servicos');
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        nome,
        descricao,
        // Converte "100,50" para 100.50
        preco: parseFloat(preco.toString().replace(',', '.')) 
      };
      
      // ✅ CORREÇÃO AQUI: Adicionado '/api'
      const response = await api.post('/api/servicos', payload);
      
      setServicos([...servicos, response.data]); // Atualiza lista visualmente
      
      // Limpar form
      setNome('');
      setDescricao('');
      setPreco('');
      alert("✅ Serviço cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao criar serviço. Verifique o console.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Tem certeza que deseja excluir este serviço?")) return;
    
    try {
      // ✅ CORREÇÃO AQUI: Adicionado '/api'
      await api.delete(`/api/servicos/${id}`);
      setServicos(servicos.filter(s => s.id !== id));
    } catch (error) {
      alert("Erro ao deletar.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Catálogo de Serviços</h2>
        <p className="mt-1 text-sm text-gray-500">Gerencie os preços e tipos de serviços oferecidos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 📝 Formulário de Cadastro (Esquerda) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#22c55e]" />
              Novo Serviço
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-[#22c55e] focus:border-[#22c55e] sm:text-sm py-2 border outline-none"
                    placeholder="Ex: Formatação"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={preco}
                    onChange={e => setPreco(e.target.value)}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-[#22c55e] focus:border-[#22c55e] sm:text-sm py-2 border outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md focus:ring-[#22c55e] focus:border-[#22c55e] sm:text-sm p-2 border outline-none"
                  placeholder="Detalhes do serviço..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0f392b] hover:bg-[#0a271d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22c55e] transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin h-5 w-5"/> : 'Cadastrar'}
              </button>
            </form>
          </div>
        </div>

        {/* 📋 Lista de Serviços (Direita) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-12 flex justify-center">
                    <Loader2 className="animate-spin h-8 w-8 text-[#22c55e]" />
                </div>
              ) : servicos.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto h-12 w-12 text-gray-300">
                    <Tag className="h-full w-full" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum serviço</h3>
                  <p className="mt-1 text-sm text-gray-500">Comece cadastrando ao lado.</p>
                </div>
              ) : (
                servicos.map((servico) => (
                  <li key={servico.id} className="p-4 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#0f392b] truncate">
                          {servico.nome}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {servico.descricao || "Sem descrição"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          R$ {servico.preco?.toFixed(2)}
                        </span>
                        <button 
                          onClick={() => handleDelete(servico.id)}
                          className="text-gray-300 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicosPage;