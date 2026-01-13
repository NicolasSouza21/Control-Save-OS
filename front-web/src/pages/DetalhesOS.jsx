import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft, User, Phone, Mail, Laptop, AlertCircle, Wrench, FileText, Calendar, DollarSign } from 'lucide-react';
import { formatDateTime } from '../utils/format';

export default function DetalhesOS() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const [os, setOs] = useState({
        nomeCliente: '',
        equipamento: '',
        defeitoRelatado: '',
        laudoTecnico: '',
        status: '',
        valorTotal: 0
    });

    useEffect(() => {
        api.get(`/api/os/${id}`)
            .then(response => {
                setOs(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar OS:", error);
                alert("Erro ao carregar dados!");
                navigate('/');
            });
    }, [id, navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/os/${id}`, os);
            alert("✅ Ordem de Serviço atualizada com sucesso!");
            navigate('/'); 
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("❌ Erro ao atualizar. Verifique o console.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f392b]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* ✅ CABEÇALHO COM NAVEGAÇÃO */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')} 
                        className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#0f392b] hover:border-[#0f392b] transition-all"
                        title="Voltar"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Ordem de Serviço <span className="text-[#22c55e]">#{os.id}</span>
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar size={14} />
                            <span>Aberta em: {formatDateTime(os.dataAbertura)}</span>
                        </div>
                    </div>
                </div>

                <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                    os.status === 'CONCLUIDO' ? 'bg-green-100 text-green-800 border-green-200' : 
                    os.status === 'ABERTO' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                    {os.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 🔒 COLUNA DA ESQUERDA: DADOS (Leitura) */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Card Cliente */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#0f392b]">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-4 text-lg">
                            <User size={20} className="text-[#0f392b]" />
                            Dados do Cliente
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Nome</label>
                                <p className="font-medium text-gray-900 text-lg">{os.nomeCliente}</p>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                {os.telefoneCliente && (
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-2 rounded-lg">
                                        <Phone size={16} className="text-[#22c55e]" /> 
                                        <span className="text-sm font-medium">{os.telefoneCliente}</span>
                                    </div>
                                )}
                                {os.emailCliente && (
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-2 rounded-lg">
                                        <Mail size={16} className="text-[#22c55e]" /> 
                                        <span className="text-sm font-medium">{os.emailCliente}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card Equipamento */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <Laptop size={20} className="text-[#0f392b]" />
                            Equipamento
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold">Modelo</label>
                                <p className="text-gray-900 font-medium">{os.equipamento}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {os.numeroSerie && (
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase font-bold">Nº Série</label>
                                        <p className="text-gray-600 text-sm font-mono">{os.numeroSerie}</p>
                                    </div>
                                )}
                            </div>
                            {os.acessorios && (
                                <div>
                                    <label className="text-xs text-gray-400 uppercase font-bold">Acessórios</label>
                                    <p className="text-gray-600 text-sm bg-yellow-50 p-2 rounded border border-yellow-100 mt-1">
                                        {os.acessorios}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card Defeito */}
                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                        <h2 className="font-bold text-red-800 flex items-center gap-2 mb-2">
                            <AlertCircle size={20} />
                            Defeito Relatado
                        </h2>
                        <p className="text-red-700 text-sm italic leading-relaxed">"{os.defeitoRelatado}"</p>
                    </div>
                </div>

                {/* 📝 COLUNA DA DIREITA: ÁREA TÉCNICA (Edição) */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full overflow-hidden">
                        
                        {/* Header do Form */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                            <Wrench size={20} className="text-[#0f392b]" />
                            <h2 className="font-bold text-gray-800">Diagnóstico e Execução</h2>
                        </div>

                        <div className="p-6 flex-1 space-y-6">
                            {/* Linha 1: Status e Valor */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Status do Serviço</label>
                                    <div className="relative">
                                        <select 
                                            value={os.status}
                                            onChange={(e) => setOs({...os, status: e.target.value})}
                                            className="w-full p-3 pl-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] outline-none font-medium text-gray-700 bg-white transition-shadow appearance-none cursor-pointer"
                                        >
                                            <option value="ABERTO">🔓 Aberto</option>
                                            <option value="EM_ANALISE">🔍 Em Análise</option>
                                            <option value="AGUARDANDO_APROVACAO">⏳ Aguardando Aprovação</option>
                                            <option value="APROVADO">✅ Aprovado</option>
                                            <option value="EM_ANDAMENTO">🛠️ Em Andamento</option>
                                            <option value="CONCLUIDO">🏆 Concluído</option>
                                            <option value="ENTREGUE">📦 Entregue</option>
                                            <option value="CANCELADO">🚫 Cancelado</option>
                                        </select>
                                        {/* Seta customizada CSS puro ou ícone absoluto se quiser, mas select nativo é mais robusto */}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Valor Total</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-bold">R$</span>
                                        </div>
                                        <input 
                                            type="number"
                                            step="0.01"
                                            value={os.valorTotal}
                                            onChange={(e) => setOs({...os, valorTotal: parseFloat(e.target.value)})}
                                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] outline-none font-mono font-bold text-xl text-gray-800"
                                            placeholder="0,00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Linha 2: Laudo Técnico */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <FileText size={16} />
                                    Laudo Técnico / Observações
                                </label>
                                <textarea 
                                    value={os.laudoTecnico || ''}
                                    onChange={(e) => setOs({...os, laudoTecnico: e.target.value})}
                                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] outline-none resize-none text-gray-700 leading-relaxed"
                                    placeholder="Descreva detalhadamente o serviço realizado, peças substituídas e testes efetuados..."
                                ></textarea>
                                <p className="text-xs text-gray-400 mt-2 text-right">Este laudo ficará visível no histórico do equipamento.</p>
                            </div>
                        </div>

                        {/* Footer do Form */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button 
                                type="submit" 
                                className="bg-[#0f392b] hover:bg-[#0a271d] text-white px-8 py-3 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <Save size={20} />
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}