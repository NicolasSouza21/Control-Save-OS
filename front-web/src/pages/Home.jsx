import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Package, Plus, Calendar, User, Laptop, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import CreateOSModal from '../components/CreateOSModal';
import { formatDate, formatCurrency } from '../utils/format';

export default function Home() {
    const [listaOS, setListaOS] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // ✨ Estados calculados para o Dashboard
    const stats = {
        total: listaOS.length,
        abertas: listaOS.filter(os => os.status === 'ABERTO').length,
        concluidas: listaOS.filter(os => os.status === 'CONCLUIDO').length
    };

    const buscarTodasOS = async () => {
        try {
            const response = await api.get('/api/os');
            // Ordena por ID decrescente (mais recentes primeiro)
            const dadosOrdenados = response.data.sort((a, b) => b.id - a.id);
            setListaOS(dadosOrdenados);
        } catch (error) {
            console.error("❌ Erro ao buscar OS:", error);
        }
    };

    useEffect(() => {
        buscarTodasOS();
    }, []);

    // ✨ Função de cores atualizada para harmonizar com o tema
    const getStatusStyle = (status) => {
        switch(status) {
            case 'ABERTO': 
                return { badge: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-500', icon: 'text-yellow-500' };
            case 'EM_ANDAMENTO': 
                return { badge: 'bg-blue-100 text-blue-800', border: 'border-blue-500', icon: 'text-blue-500' };
            case 'CONCLUIDO': 
                return { badge: 'bg-green-100 text-green-800', border: 'border-[#22c55e]', icon: 'text-[#22c55e]' }; // Verde da marca
            case 'CANCELADO': 
                return { badge: 'bg-red-100 text-red-800', border: 'border-red-500', icon: 'text-red-500' };
            default: 
                return { badge: 'bg-gray-100 text-gray-800', border: 'border-gray-500', icon: 'text-gray-500' };
        }
    }

    return (
        <div className="space-y-8">
            {/* ✅ HEADER DA PÁGINA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Visão geral da assistência técnica</p>
                </div>
                
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0f392b] hover:bg-[#0a271d] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
                >
                    <Plus size={18} />
                    Nova Ordem de Serviço
                </button>
            </div>

            {/* ✅ CARDS DE ESTATÍSTICAS (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Em Aberto</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.abertas}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Concluídas</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.concluidas}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle className="w-6 h-6 text-[#0f392b]" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Geral</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-full">
                        <Package className="w-6 h-6 text-gray-600" />
                    </div>
                </div>
            </div>

            {/* ✅ LISTA DE OS */}
            {listaOS.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-16 text-center">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Nenhuma OS encontrada</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">Sua lista de atendimentos está vazia. Comece criando um novo registro.</p>
                    <button 
                         onClick={() => setIsModalOpen(true)}
                         className="text-[#0f392b] font-semibold hover:underline"
                    >
                        Criar primeira OS
                    </button>
                </div>
            ) : (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Atendimentos Recentes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listaOS.map((os) => {
                            const styles = getStatusStyle(os.status);
                            return (
                                <div 
                                    key={os.id} 
                                    onClick={() => navigate(`/os/${os.id}`)} 
                                    className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${styles.border} group overflow-hidden`}
                                >
                                    <div className="p-5">
                                        {/* Topo do Card */}
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                OS #{os.id}
                                            </span>
                                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${styles.badge}`}>
                                                {os.status}
                                            </span>
                                        </div>

                                        {/* Conteúdo Principal */}
                                        <h3 className="font-bold text-gray-800 mb-1 group-hover:text-[#0f392b] transition-colors truncate">
                                            {os.equipamento}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <User size={14} className="text-gray-400" />
                                            <span className="text-sm text-gray-600 truncate">{os.nomeCliente}</span>
                                        </div>

                                        {/* Separador */}
                                        <div className="h-px bg-gray-100 mb-3" />

                                        {/* Rodapé do Card */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <Calendar size={14} />
                                                <span className="text-xs">{formatDate(os.dataAbertura)}</span>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900">
                                                {formatCurrency(os.valorTotal)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <CreateOSModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={buscarTodasOS}
            />
        </div>
    );
}