import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function CreateOSModal({ isOpen, onClose, onSuccess }) {
    // Se não estiver aberto, não renderiza nada
    if (!isOpen) return null;

    const [loading, setLoading] = useState(false);
    
    // Estado do Formulário
    const [form, setForm] = useState({
        nomeCliente: '',
        telefoneCliente: '',
        emailCliente: '',
        equipamento: '',
        numeroSerie: '',
        acessorios: '',
        defeitoRelatado: ''
    });

    // Atualiza os campos enquanto digita
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Envia para o Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // POST /api/os -> Cria a OS no banco
            await api.post('/api/os', form);
            
            alert("✅ Ordem de Serviço criada com sucesso!");
            onSuccess(); // Avisa a Home para atualizar a lista
            onClose();   // Fecha o modal
            
            // Limpa o form para a próxima
            setForm({ nomeCliente: '', telefoneCliente: '', emailCliente: '', equipamento: '', numeroSerie: '', acessorios: '', defeitoRelatado: '' });
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("❌ Erro ao criar OS. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Fundo Escuro (Overlay)
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            
            {/* Janela do Modal */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Cabeçalho */}
                <div className="bg-primary px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Nova Ordem de Serviço
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Linha 1: Cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente *</label>
                            <input 
                                required
                                name="nomeCliente"
                                value={form.nomeCliente}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="Ex: João Silva"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone/WhatsApp</label>
                            <input 
                                name="telefoneCliente"
                                value={form.telefoneCliente}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                    </div>

                    {/* Linha 2: Equipamento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Equipamento *</label>
                            <input 
                                required
                                name="equipamento"
                                value={form.equipamento}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Ex: Notebook Dell G15"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Série</label>
                            <input 
                                name="numeroSerie"
                                value={form.numeroSerie}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    {/* Acessórios */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Acessórios deixados</label>
                        <input 
                            name="acessorios"
                            value={form.acessorios}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Ex: Carregador, Mouse, Capa..."
                        />
                    </div>

                    {/* Defeito */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Defeito Relatado *</label>
                        <textarea 
                            required
                            name="defeitoRelatado"
                            value={form.defeitoRelatado}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none resize-none"
                            placeholder="Descreva o problema relatado pelo cliente..."
                        />
                    </div>

                    {/* Rodapé / Botões */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                            Salvar OS
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}