import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0f766e", "#1d4ed8", "#ea580c"];

export default function CategoryChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const agrupado = {};
    let total = 0;

    data.forEach((item) => {
      const cat = item.Categoria;
      if (!agrupado[cat]) agrupado[cat] = 0;
      agrupado[cat] += 1;
      total += 1;
    });

    return Object.entries(agrupado).map(([name, value]) => ({
      name,
      value,
      percent: ((value / total) * 100).toFixed(1)
    }));
  }, [data]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);



    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central" 
        className="text-lg font-bold"
      >
        {`${percent}%`}
      </text>
    );
  };

  return (
    <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-6xl">
      <h3 className="text-lg font-bold text-gray-700 mb-6">Vendas por Categoria</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="white" 
                  strokeWidth={2} 
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} iconType="rect" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}