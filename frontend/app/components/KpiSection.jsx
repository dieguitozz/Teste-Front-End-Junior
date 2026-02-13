import { useMemo } from "react";
import { formatarBRL } from "../utils/formatters";

export default function KpiSection({ data }) {
  const kpis = useMemo(() => {
    const receitaTotal = data.reduce((acc, item) => acc + (item.Receita_Real || 0), 0);
    const qtdVendas = data.length;
    const ticketMedio = qtdVendas > 0 ? receitaTotal / qtdVendas : 0;
    return { receitaTotal, qtdVendas, ticketMedio };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 h-32">
      <CardKPI 
        titulo="Receita Total" 
        valor={formatarBRL(kpis.receitaTotal)} 
      />
      <CardKPI 
        titulo="Pedidos" 
        valor={kpis.qtdVendas} 
      />
      <CardKPI 
        titulo="Ticket Médio" 
        valor={formatarBRL(kpis.ticketMedio)} 
      />
    </div>
  );
}

function CardKPI({ titulo, valor, borda }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center`}>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{titulo}</p>
        <h3 className="text-2xl font-bold text-gray-800">{valor}</h3>
      </div>
    </div>
  );
}