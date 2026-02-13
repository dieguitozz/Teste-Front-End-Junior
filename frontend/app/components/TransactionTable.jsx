import { useMemo } from "react";
import { formatarBRL } from "../utils/formatters";

export default function TransactionTable({ 
  data = [], 
  categorias = [], 
  meses = [], 
  catAtual, 
  mesAtual, 
  setCat, 
  setMes, 
  onClear 
}) {
  
  const produtosAgrupados = useMemo(() => {
    if (!data || data.length === 0) return [];

    const mapaProdutos = {};

    data.forEach((item) => {
      const nome = item.Produto;
      
      if (!mapaProdutos[nome]) {
        mapaProdutos[nome] = {
          id: nome,
          produto: nome,
          categoria: item.Categoria,
          mes: item.Mes || item.Mes_Ano || "-", 
          quantidade: 0,
          receita: 0,
        };
      }
      
      mapaProdutos[nome].quantidade += Number(item.Quantidade || 0);
      mapaProdutos[nome].receita += Number(item.Receita_Real || 0);
    });

    const lista = Object.values(mapaProdutos).sort((a, b) => b.receita - a.receita);
    
    return lista; 

  }, [data]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden col-span-1 lg:col-span-3">
      
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex flex-col gap-3 md:w-auto">
        <h3 className="text-2xl font-bold text-gray-700 flex-start gap-2">
          Filtros
        </h3>
            <div className="flex flex-wrap items-center gap-3 md:w-auto">
            <select 
                className="px-4 py-3 border w-4xl border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-gray-600  cursor-pointer"
                value={catAtual} 
                onChange={(e) => setCat(e.target.value)}
            >
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
                className="px-4 py-3 w-4xl border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 cursor-pointer"
                value={mesAtual} 
                onChange={(e) => setMes(e.target.value)}
            >
                {meses.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

                <button 
                    onClick={onClear} 
                    className="px-4 py-3 text-sm text-white w-32  bg-blue-600 rounded-lg cursor-pointer font-medium transition-colors ml-auto md:ml-0"
                >
                    Limpar Filtros
                </button>
                </div>
            
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <h3 className="text-2xl font-bold text-gray-700 flex-start p-6">Produtos Mais Vendidos</h3>
        <table className="w-5/6 text-left text-sm text-gray-600">
          <thead className="bg-blue-200 w-full text-md uppercase text-black font-semibold ">
            <tr>
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4 text-center">Categoria</th>
              <th className="px-6 py-4 text-center">Mês</th>
              <th className="px-6 py-4 text-right">QTD</th>
              <th className="px-6 py-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {produtosAgrupados.length > 0 ? (
              produtosAgrupados.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800 w-sm">{item.produto}</td>
                  <td className="px-6 py-4 text-center">
                    <span >
                      {item.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{item.mes}</td>
                  <td className="px-6 py-4 text-right">{item.quantidade}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-700">
                    {formatarBRL(item.receita)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Nenhum dado encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto">
        <table className="w-5/6 text-left text-sm text-gray-600">
          <thead className="bg-blue-200 w-full text-md uppercase text-black font-semibold ">
            <tr>
              <th className="px-6 py-4 w-4xl">Produto</th>
              <th className="px-6 py-4 text-left">QTD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {produtosAgrupados.length > 0 ? (
              produtosAgrupados.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800 w-sm">{item.produto}</td>
                  <td className="px-6 py-4 text-left">{item.quantidade}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Nenhum dado encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}