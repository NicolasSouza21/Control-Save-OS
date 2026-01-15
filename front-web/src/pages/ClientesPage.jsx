import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, MapPin, Phone, Mail, User, Loader2 } from 'lucide-react';
import api from '../services/api';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estado do Formulário
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/api/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.post('/api/clientes', form);
      setClientes([...clientes, response.data]);
      alert("✅ Cliente cadastrado com sucesso!");
      
      // Limpa o formulário
      setForm({
        nome: '', email: '', telefone: '', cpf: '',
        cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: ''
      });
    } catch (error) {
      console.error(error);
      alert("❌ Erro ao cadastrar. Verifique se o e-mail já existe.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      await api.delete(`/api/clientes/${id}`);
      setClientes(clientes.filter(c => c.id !== id));
    } catch (error) {
      alert("Erro ao deletar cliente.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h2>
        <p className="mt-1 text-sm text-gray-500">Cadastre e visualize sua base de clientes.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 📝 Formulário (Esquerda - Maior em telas grandes) */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-[#22c55e]" />
              Novo Cliente
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Dados Pessoais */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dados Pessoais</p>
                
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome Completo" required className="pl-9 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="E-mail" className="pl-9 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" className="pl-9 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                    </div>
                    <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF/CNPJ" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Endereço
                </p>
                
                <div className="grid grid-cols-3 gap-2">
                    <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP" className="col-span-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                    <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className="col-span-2 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <input name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Rua / Av." className="col-span-2 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                    <input name="numero" value={form.numero} onChange={handleChange} placeholder="Nº" className="col-span-1 w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                    <input name="estado" value={form.estado} onChange={handleChange} placeholder="UF" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full bg-[#0f392b] hover:bg-[#0a271d] text-white py-2 rounded-md font-medium transition-colors disabled:opacity-50 flex justify-center">
                 {saving ? <Loader2 className="animate-spin" /> : "Cadastrar Cliente"}
              </button>
            </form>
          </div>
        </div>

        {/* 📋 Lista de Clientes (Direita) */}
        <div className="xl:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <div className="col-span-full text-center py-10 text-gray-500">Carregando clientes...</div>
                ) : clientes.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-white rounded-lg border border-gray-200">
                        <User className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">Nenhum cliente cadastrado.</p>
                    </div>
                ) : (
                    clientes.map((cliente) => (
                        <div key={cliente.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                            <button 
                                onClick={() => handleDelete(cliente.id)}
                                className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>

                            <div className="flex items-start gap-3">
                                <div className="bg-green-50 p-2 rounded-full">
                                    <User className="h-5 w-5 text-[#0f392b]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{cliente.nome}</h4>
                                    <p className="text-xs text-gray-500 mb-2">ID: {cliente.id}</p>
                                    
                                    <div className="space-y-1 text-sm text-gray-600">
                                        {cliente.telefone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3 text-[#22c55e]" />
                                                {cliente.telefone}
                                            </div>
                                        )}
                                        {cliente.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3 text-[#22c55e]" />
                                                <span className="truncate max-w-[200px]">{cliente.email}</span>
                                            </div>
                                        )}
                                        {cliente.cidade && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-50">
                                                <MapPin className="h-3 w-3" />
                                                {cliente.cidade} - {cliente.estado}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ClientesPage;