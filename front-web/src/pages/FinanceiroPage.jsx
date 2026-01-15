import React, { useState, useEffect } from 'react';
import { 
    TrendingUp, TrendingDown, DollarSign, Plus, Minus, Trash2, Calendar, 
    Tag, Wallet, Pencil, XCircle, Calculator, PieChart, Target, AlertTriangle 
} from 'lucide-react';
import api from '../services/api';

const FinanceiroPage = () => {
  // =========================================
  // 1. ESTADOS DO SISTEMA
  // =========================================
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');
  const [abaAtiva, setAbaAtiva] = useState('EXTRATO'); // 'EXTRATO' ou 'PLANEJAMENTO'

  // Estados Financeiros
  const [resumo, setResumo] = useState({ 
    entradas: 0, 
    saidas: 0, 
    saldo: 0,
    dividaComSocio: 0, 
    saldoOperacional: 0 // Lucro líquido da assistência
  });

  // Estado Edição CRUD
  const [editId, setEditId] = useState(null);

  // Form States (Lançamentos)
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('RECEITA');

  // Estado Simulação Pessoal (CLT)
  const [salarioPessoal, setSalarioPessoal] = useState(1250); // Valor padrão do seu exemplo

  useEffect(() => {
    fetchTransacoes();
  }, []);

  // =========================================
  // 2. LÓGICA DE NEGÓCIO
  // =========================================
  const fetchTransacoes = async () => {
    try {
      const response = await api.get('/api/financeiro');
      const lista = response.data;
      setTransacoes(lista);
      calcularResumo(lista);
    } catch (error) {
      console.error("Erro ao buscar financeiro", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularResumo = (lista) => {
    let entradas = 0;
    let saidas = 0;
    let aportes = 0;
    let retiradas = 0;

    lista.forEach(t => {
      const val = t.valor;
      const cat = t.categoria ? t.categoria.toLowerCase() : '';
      
      // Identifica dinheiro do sócio
      const ehSocio = cat.includes('aporte') || cat.includes('injeção') || cat.includes('retirada') || cat.includes('lucro') || cat.includes('pessoal');

      if (t.tipo === 'RECEITA') {
        entradas += val;
        if (ehSocio) aportes += val;
      } else {
        saidas += val;
        if (ehSocio) retiradas += val;
      }
    });

    const saldoTotal = entradas - saidas;
    const dividaComSocio = aportes - retiradas;
    
    // Saldo Operacional = Lucro real do trabalho (sem contar aportes externos)
    // Se aportes > retiradas, o caixa está "inflado" pelo sócio.
    const saldoOperacional = saldoTotal - dividaComSocio;

    setResumo({ entradas, saidas, saldo: saldoTotal, dividaComSocio, saldoOperacional });
  };

  const transacoesFiltradas = transacoes.filter((t) => {
    if (filtro === 'TODOS') return true;
    return t.tipo === filtro;
  });

  // =========================================
  // 3. AÇÕES CRUD
  // =========================================
  const handleEdit = (t) => {
    setEditId(t.id);
    setDescricao(t.descricao);
    setValor(t.valor);
    setCategoria(t.categoria || '');
    setTipo(t.tipo);
    setAbaAtiva('EXTRATO'); // Força volta pra aba de extrato
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setDescricao('');
    setValor('');
    setCategoria('');
    setTipo('RECEITA');
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!descricao || !valor) return;

    try {
      const payload = {
        descricao,
        valor: parseFloat(valor.toString().replace(',', '.')),
        tipo,
        categoria: categoria || (tipo === 'RECEITA' ? 'Outros' : 'Despesa Operacional') 
      };

      if (editId) {
        const response = await api.put(`/api/financeiro/${editId}`, payload);
        const novaLista = transacoes.map(t => t.id === editId ? response.data : t);
        setTransacoes(novaLista);
        calcularResumo(novaLista);
        alert("Atualizado com sucesso!");
      } else {
        const response = await api.post('/api/financeiro', payload);
        const novaLista = [response.data, ...transacoes];
        setTransacoes(novaLista);
        calcularResumo(novaLista);
        alert("Lançamento salvo!");
      }
      handleCancelEdit();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Apagar este registro?")) return;
    try {
      await api.delete(`/api/financeiro/${id}`);
      const novaLista = transacoes.filter(t => t.id !== id);
      setTransacoes(novaLista);
      calcularResumo(novaLista);
      if (editId === id) handleCancelEdit();
    } catch (error) {
      alert("Erro ao deletar.");
    }
  };

  // =========================================
  // 4. COMPONENTES VISUAIS
  // =========================================

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 🟢 CABEÇALHO E ABAS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Financeiro Inteligente</h2>
            <p className="text-sm text-gray-500">Controle de caixa e regras de distribuição.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => setAbaAtiva('EXTRATO')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${abaAtiva === 'EXTRATO' ? 'bg-white text-[#0f392b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Calculator size={16} /> Extrato & Caixa
            </button>
            <button 
                onClick={() => setAbaAtiva('PLANEJAMENTO')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${abaAtiva === 'PLANEJAMENTO' ? 'bg-white text-[#0f392b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <PieChart size={16} /> Regras & Metas
            </button>
        </div>
      </div>

      {/* ==================================================================================== */}
      {/* ABA 1: EXTRATO (O que já tínhamos) */}
      {/* ==================================================================================== */}
      {abaAtiva === 'EXTRATO' && (
        <>
            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Entradas</p>
                            <h3 className="text-xl font-bold text-green-600 mt-1">R$ {resumo.entradas.toFixed(2)}</h3>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg"><TrendingUp className="h-5 w-5 text-green-600" /></div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Saídas</p>
                            <h3 className="text-xl font-bold text-red-600 mt-1">R$ {resumo.saidas.toFixed(2)}</h3>
                        </div>
                        <div className="bg-red-50 p-2 rounded-lg"><TrendingDown className="h-5 w-5 text-red-600" /></div>
                    </div>
                </div>
                <div className="bg-[#0f392b] p-4 rounded-xl shadow-md text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-green-200 uppercase">Caixa Atual</p>
                            <h3 className="text-2xl font-bold mt-1">R$ {resumo.saldo.toFixed(2)}</h3>
                            <p className="text-[10px] text-green-300 mt-1">Disponível no Banco</p>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg"><DollarSign className="h-5 w-5 text-white" /></div>
                    </div>
                </div>
                <div className="bg-blue-600 p-4 rounded-xl shadow-md text-white relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-blue-100 uppercase">Aporte do Dono</p>
                            <h3 className="text-2xl font-bold mt-1">R$ {resumo.dividaComSocio.toFixed(2)}</h3>
                            <p className="text-[10px] text-blue-200 mt-1">{resumo.dividaComSocio > 0 ? "Empresa te deve" : "Quitado"}</p>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg"><Wallet className="h-5 w-5 text-white" /></div>
                    </div>
                </div>
            </div>

            {/* FORMULÁRIO E LISTA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className={`p-6 rounded-lg shadow-sm border sticky top-24 transition-colors duration-300 ${editId ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-bold ${editId ? 'text-amber-800' : 'text-gray-800'}`}>
                                {editId ? 'Editar Lançamento' : 'Novo Lançamento'}
                            </h3>
                            {editId && (
                                <button onClick={handleCancelEdit} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                                    <XCircle size={16} /> Cancelar
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSalvar} className="space-y-4">
                            <div className="flex gap-2 p-1 bg-white/50 rounded-lg">
                                <button 
                                    type="button" 
                                    onClick={() => setTipo('RECEITA')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${tipo === 'RECEITA' ? 'bg-green-600 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                                >
                                    <Plus size={16} /> Entrada
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setTipo('DESPESA')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${tipo === 'DESPESA' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                                >
                                    <Minus size={16} /> Saída
                                </button>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Descrição</label>
                                <input required value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-[#0f392b] outline-none" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Categoria</label>
                                <input value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ex: Aporte, Aluguel..." className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-[#0f392b] outline-none" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Valor (R$)</label>
                                <input required type="number" step="0.01" value={valor} onChange={e => setValor(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-[#0f392b] outline-none font-bold text-lg" />
                            </div>

                            <button className={`w-full text-white py-3 rounded-lg font-bold transition-colors ${editId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0f392b] hover:bg-[#0a271d]'}`}>
                                {editId ? 'Atualizar' : 'Lançar'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lista */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="font-bold text-gray-700">Movimentações</h3>
                            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                                <button onClick={() => setFiltro('TODOS')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filtro === 'TODOS' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Todos</button>
                                <button onClick={() => setFiltro('RECEITA')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filtro === 'RECEITA' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}>Entradas</button>
                                <button onClick={() => setFiltro('DESPESA')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filtro === 'DESPESA' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'}`}>Saídas</button>
                            </div>
                        </div>
                        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {transacoesFiltradas.length === 0 ? (
                                <p className="p-8 text-center text-gray-400">Nenhum registro encontrado.</p>
                            ) : (
                                transacoesFiltradas.map((t) => (
                                    <li key={t.id} className={`p-4 hover:bg-gray-50 flex items-center justify-between group border-l-4 ${t.id === editId ? 'bg-amber-50 border-amber-400' : 'border-transparent'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${t.tipo === 'RECEITA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {t.tipo === 'RECEITA' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{t.descricao}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><Calendar size={12}/> {t.data}</span>
                                                    {t.categoria && (
                                                        <span className={`px-2 py-0.5 rounded border font-medium ${
                                                            (t.categoria.toLowerCase().includes('aporte') || t.categoria.toLowerCase().includes('retirada')) 
                                                            ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                        }`}>
                                                            {t.categoria}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`font-bold ${t.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                                                {t.tipo === 'RECEITA' ? '+ ' : '- '} 
                                                R$ {t.valor.toFixed(2)}
                                            </span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(t)} className="text-gray-400 hover:text-amber-600 p-1.5 rounded-full hover:bg-amber-50">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50">
                                                    <Trash2 size={18} />
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
        </>
      )}

      {/* ==================================================================================== */}
      {/* ABA 2: PLANEJAMENTO (Nova Funcionalidade) */}
      {/* ==================================================================================== */}
      {abaAtiva === 'PLANEJAMENTO' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LADO ESQUERDO: VIDA PESSOAL (Simulador) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-50 p-6 border-b border-blue-100">
                    <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                        <Wallet className="h-5 w-5" /> 
                        Parte 1: Finanças Pessoais (CLT/Extra)
                    </h3>
                    <p className="text-sm text-blue-600 mt-1">Regra 60 - 30 - 10</p>
                </div>
                
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Informe sua Renda Mensal (Fora da Assistência)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                            <input 
                                type="number" 
                                value={salarioPessoal}
                                onChange={(e) => setSalarioPessoal(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* 60% */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-bold text-gray-600">60% Custo de Vida</span>
                                <span className="text-sm font-bold text-gray-800">R$ {(salarioPessoal * 0.6).toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Comida, Transporte, Contas, Lazer mínimo. <br/> ⚠️ Se passar disso, você está em perigo.</p>
                        </div>

                        {/* 30% */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-bold text-gray-600">30% Reserva / Segurança</span>
                                <span className="text-sm font-bold text-gray-800">R$ {(salarioPessoal * 0.3).toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Emergência, Imprevistos. Não gaste!</p>
                        </div>

                        {/* 10% */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-bold text-gray-600">10% Investir na Assistência</span>
                                <span className="text-sm font-bold text-gray-800">R$ {(salarioPessoal * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Comprar ferramentas, peças pra revenda.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LADO DIREITO: VIDA PROFISSIONAL (Dados Reais) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-green-50 p-6 border-b border-green-100">
                    <h3 className="text-lg font-bold text-[#0f392b] flex items-center gap-2">
                        <Target className="h-5 w-5" /> 
                        Parte 2: Lucro da Assistência (Real)
                    </h3>
                    <p className="text-sm text-green-700 mt-1">Regra 50 - 30 - 20 (Aplicado ao Lucro Líquido)</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-[#0f392b] text-white p-4 rounded-lg text-center">
                        <p className="text-sm text-green-200 uppercase mb-1">Lucro Operacional Atual</p>
                        <h2 className="text-3xl font-bold">R$ {resumo.saldoOperacional.toFixed(2)}</h2>
                        <p className="text-xs text-green-300 mt-2">
                            (Receitas de Serviço) - (Despesas da Loja)
                        </p>
                    </div>

                    {resumo.saldoOperacional <= 0 ? (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <p className="text-sm">
                                <b>Atenção:</b> Seu lucro operacional é zero ou negativo. 
                                Foque em vender mais serviços antes de pensar em distribuição de lucros.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* 50% */}
                            <div className="p-4 border border-green-100 rounded-lg bg-white shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-green-100 p-2 rounded-full text-[#0f392b] font-bold text-xs">50%</div>
                                    <h4 className="font-bold text-gray-800">Caixa da Assistência</h4>
                                </div>
                                <p className="text-2xl font-bold text-[#0f392b]">R$ {(resumo.saldoOperacional * 0.5).toFixed(2)}</p>
                                <p className="text-xs text-gray-500 mt-1">Dinheiro intocável da empresa para crescer.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* 30% */}
                                <div className="p-4 border border-blue-100 rounded-lg bg-white shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-blue-100 p-1.5 rounded-full text-blue-800 font-bold text-[10px]">30%</div>
                                        <h4 className="font-bold text-sm text-gray-800">Reinvestir</h4>
                                    </div>
                                    <p className="text-xl font-bold text-blue-600">R$ {(resumo.saldoOperacional * 0.3).toFixed(2)}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Peças, Marketing, Ferramentas.</p>
                                </div>

                                {/* 20% */}
                                <div className="p-4 border border-amber-100 rounded-lg bg-white shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-amber-100 p-1.5 rounded-full text-amber-800 font-bold text-[10px]">20%</div>
                                        <h4 className="font-bold text-sm text-gray-800">Seu Bolso</h4>
                                    </div>
                                    <p className="text-xl font-bold text-amber-600">R$ {(resumo.saldoOperacional * 0.2).toFixed(2)}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Sua retirada livre (Sem culpa).</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600 space-y-2">
                        <p className="font-bold">💡 Regra de Ouro Anti-Caos:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Nunca compre peça sem serviço fechado.</li>
                            <li>Nunca misture o PIX da assistência com o pessoal.</li>
                            <li>Retire seu lucro (os 20%) apenas 1x por semana.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default FinanceiroPage;