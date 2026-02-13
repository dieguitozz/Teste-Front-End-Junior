import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList
} from "recharts";
import { formatarBRL } from "../utils/formatters";

export default function RevenueChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const timestamps = data.map((d) => new Date(d.Data).getTime());
    const dataMax = new Date(Math.max(...timestamps));
    
    const dataCorte = new Date(dataMax);
    dataCorte.setMonth(dataCorte.getMonth() - 6);

    const agrupado = {};

    data.forEach((item) => {
      const dataItem = new Date(item.Data);
      
      if (dataItem >= dataCorte) {
        const chave = item.Mes_Ano; 
        
        if (!agrupado[chave]) {
          agrupado[chave] = 0;
        }
        agrupado[chave] += item.Receita_Real;
      }
    });

    return Object.entries(agrupado)
      .map(([chave, valor]) => ({
        chave, 
        valor,
      }))
      .sort((a, b) => a.chave.localeCompare(b.chave)) 
      .map((item) => {
        const [ano, mes] = item.chave.split("-");
        const dataObj = new Date(parseInt(ano), parseInt(mes) - 1, 1);
        
        const nomeMes = dataObj.toLocaleString('pt-BR', { month: 'short' });
        const labelFinal = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

        return {
          name: labelFinal, 
          valor: item.valor
        };
      });
  }, [data]);

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm  border-gray-100 w-6xl">
      <h3 className="text-lg font-bold text-gray-700 mb-6">Vendas por Mês</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis 
                tickFormatter={(val) => formatarBRL(val)} 
                width={80}
                tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(val) => formatarBRL(val)}
              cursor={{ fill: "#f3f4f6" }}
            />
            <Legend verticalAlign="top" align="center" iconType="rect" />
            <Bar
              dataKey="valor"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              name="Vendas"
              barSize={50}
            >
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}