import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Wrench, DollarSign, User, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function CreateOSModal({ isOpen, onClose, onSuccess }) {
    if (!isOpen) return null;

    const [loading, setLoading] = useState(false);
    
    // Listas vindas do Backend
    const [clientes, setClientes] = useState([]);
    const [servicosDisponiveis, setServicosDisponiveis] = useState([]);

    // Carrinho de Serviços selecionados para esta OS
    const [servicosSelecionados, setServicosSelecionados] = useState([]);
    const [servicoAtual, setServicoAtual] = useState(""); // ID do select

    // Estado do Formulário
    const [form, setForm] = useState({
        nomeCliente: '',
        telefoneCliente: '',
        emailCliente: '',
        equipamento: '',
        numeroSerie: '',
        acessorios: '',
        defeitoRelatado: '',
        valorTotal: 0,
        status: 'ABERTO'
    });

    // 🔄 Busca Clientes e Serviços ao abrir
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resClientes, resServicos] = await Promise.all([
                    api.get('/api/clientes'),
                    api.get('/api/servicos')
                ]);
                setClientes(resClientes.data);
                setServicosDisponiveis(resServicos.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        fetchData();
    }, []);

    // ✨ 1. Ao selecionar um cliente, preenche os campos automaticamente
    const handleSelectCliente = (e) => {
        const clienteId = Number(e.target.value);
        const cliente = clientes.find(c => c.id === clienteId);
        if (cliente) {
            setForm(prev => ({
                ...prev,
                nomeCliente: cliente.nome,
                telefoneCliente: cliente.telefone || '',
                emailCliente: cliente.email || ''
            }));
        }
    };

    // ✨ 2. Adicionar Serviço ao "Carrinho"
    const handleAddServico = () => {
        const servico = servicosDisponiveis.find(s => s.id === Number(servicoAtual));
        if (servico) {
            const novosServicos = [...servicosSelecionados, servico];
            setServicosSelecionados(novosServicos);
            atualizarTotal(novosServicos);
            atualizarDescricao(novosServicos);
            setServicoAtual(""); // Reseta o select
        }
    };

    // ✨ 3. Remover Serviço
    const handleRemoveServico = (index) => {
        const novosServicos = servicosSelecionados.filter((_, i) => i !== index);
        setServicosSelecionados(novosServicos);
        atualizarTotal(novosServicos);
        atualizarDescricao(novosServicos);
    };

    // ✨ 4. Recalcula o Valor Total (Soma)
    const atualizarTotal = (lista) => {
        const total = lista.reduce((acc, curr) => acc + curr.preco, 0);
        setForm(prev => ({ ...prev, valorTotal: total }));
    };

    // ✨ 5. Adiciona os nomes dos serviços na descrição do defeito (Opcional, mas útil)
    const atualizarDescricao = (lista) => {
        const nomes = lista.map(s => s.nome).join(" + ");
        setForm(prev => ({ 
            ...prev, 
            defeitoRelatado: nomes ? `Serviços: ${nomes}` : "" 
        }));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/api/os', {
                ...form,
                valorTotal: parseFloat(form.valorTotal)
            });
            
            alert("✅ OS criada com sucesso!");
            onSuccess(); 
            onClose();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("❌ Erro ao criar OS.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                
                {/* Cabeçalho */}
                <div className="bg-[#0f392b] px-6 py-4 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Nova Ordem de Serviço
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* 👈 LADO ESQUERDO: Dados do Cliente e Equipamento */}
                    <div className="space-y-5">
                        <h3 className="font-bold text-gray-800 border-b pb-2">1. Dados do Cliente</h3>
                        
                        {/* Seleção de Cliente */}
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Buscar Cliente Cadastrado</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <select 
                                        onChange={handleSelectCliente}
                                        className="pl-9 w-full border-gray-300 rounded-md text-sm p-2 outline-none focus:ring-2 focus:ring-[#22c55e]"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Selecione um cliente...</option>
                                        {clientes.map(c => (
                                            <option key={c.id} value={c.id}>{c.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Campos Manuais (Caso queira editar ou cadastrar na hora) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Nome</label>
                                <input required name="nomeCliente" value={form.nomeCliente} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Telefone</label>
                                <input name="telefoneCliente" value={form.telefoneCliente} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">E-mail</label>
                                <input name="emailCliente" value={form.emailCliente} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-800 border-b pb-2 pt-4">2. Equipamento</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <input required name="equipamento" placeholder="Equipamento (Ex: Notebook)" value={form.equipamento} onChange={handleChange} className="col-span-2 border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                            <input name="numeroSerie" placeholder="Nº Série" value={form.numeroSerie} onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                            <input name="acessorios" placeholder="Acessórios" value={form.acessorios} onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none" />
                        </div>
                    </div>

                    {/* 👉 LADO DIREITO: Serviços e Valores */}
                    <div className="space-y-5 flex flex-col h-full">
                        <h3 className="font-bold text-gray-800 border-b pb-2">3. Serviços e Valores</h3>

                        {/* Adicionar Serviço */}
                        <div className="flex gap-2">
                            <select 
                                value={servicoAtual}
                                onChange={(e) => setServicoAtual(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-[#22c55e]"
                            >
                                <option value="">Selecione um serviço...</option>
                                {servicosDisponiveis.map(s => (
                                    <option key={s.id} value={s.id}>{s.nome} - R$ {s.preco}</option>
                                ))}
                            </select>
                            <button 
                                type="button"
                                onClick={handleAddServico}
                                className="bg-[#0f392b] text-white p-2 rounded-md hover:bg-[#0a271d] transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {/* Lista de Serviços Selecionados (Carrinho) */}
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex-1 min-h-[150px]">
                            {servicosSelecionados.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center mt-10">Nenhum serviço adicionado.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {servicosSelecionados.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-gray-100 text-sm">
                                            <span className="text-gray-700">{item.nome}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-[#0f392b]">R$ {item.preco.toFixed(2)}</span>
                                                <button type="button" onClick={() => handleRemoveServico(index)} className="text-red-400 hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Detalhes do Problema (Preenchido auto, mas editável) */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Descrição do Serviço / Defeito</label>
                            <textarea 
                                required
                                name="defeitoRelatado"
                                value={form.defeitoRelatado}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#22c55e] outline-none mt-1"
                            />
                        </div>

                        {/* TOTAL FINAL */}
                        <div className="bg-[#e8f5e9] p-4 rounded-lg border border-green-200">
                            <label className="block text-xs font-bold text-[#0f392b] uppercase mb-1">Valor Total (Editável)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-[#0f392b]" />
                                <input 
                                    type="number" 
                                    step="0.01"
                                    name="valorTotal"
                                    value={form.valorTotal}
                                    onChange={handleChange}
                                    className="pl-10 w-full bg-transparent text-3xl font-bold text-[#0f392b] outline-none border-b border-green-300 focus:border-[#0f392b]"
                                />
                            </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-[#0f392b] hover:bg-[#0a271d] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                                Gerar OS
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}