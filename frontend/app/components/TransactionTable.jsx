import { useMemo } from "react";
import { formatarBRL } from "../utils/formatters";
import FilterBar from "./FilterBar";

export default function TransactionTable({
  data = [],
  categorias = [],
  meses = [],
  catAtual,
  mesAtual,
  setCat,
  setMes,
  onClear,
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

    const lista = Object.values(mapaProdutos).sort(
      (a, b) => b.receita - a.receita
    );

    return lista;
  }, [data]);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden col-span-1 lg:col-span-3">
      {/* Container de Filtros */}
      <div className="p-6 bg-gray-50/50 border-b border-gray-100">
        <FilterBar
          categorias={categorias}
          meses={meses}
          catAtual={catAtual}
          mesAtual={mesAtual}
          setCat={setCat}
          setMes={setMes}
          onClear={onClear}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
          Produtos Mais Vendidos
        </h3>

        {/* Tabela Principal dos Produtos*/}
        <div className="overflow-hidden border border-gray-200 rounded-xl mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 border-collapse">
              <thead className="bg-blue-600 text-white font-bold">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4 text-center">Categoria</th>
                  <th className="px-6 py-4 text-center">Mês</th>
                  <th className="px-6 py-4 text-center">QTD</th>
                  <th className="px-8 py-4 text-right">Faturamento Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {produtosAgrupados.length > 0 ? (
                  produtosAgrupados.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-all duration-200 group">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {item.produto}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500 font-medium italic">
                        {item.mes}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-gray-700">
                        {item.quantidade}
                      </td>
                      <td className="px-8 py-4 text-right font-bold text-blue-900">
                        {formatarBRL(item.receita)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-gray-400 bg-gray-50/50">
                      Nenhum dado encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    {/* Tabela Secundária*/}
        <div className="overflow-hidden border border-gray-200 rounded-xl shadow-inner bg-gray-50/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 font-bold">Produtos</th>
                  <th className="px-6 py-4 text-right font-bold w-32">Total QTD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {produtosAgrupados.map((item) => (
                  <tr key={`resumo-${item.id}`} className="hover:bg-white transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-700">
                      {item.produto}
                    </td>
                    <td className="px-6 py-3 text-right font-black text-gray-900">
                      {item.quantidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}