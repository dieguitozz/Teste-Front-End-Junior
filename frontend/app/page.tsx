"use client";
import { useState, useMemo } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";

import HeaderUpload from "./components/HeaderUpload";
import KpiSection from "./components/KpiSection";
import RevenueChart from "./components/RevenueChart";
import CategoryChart from "./components/CategoryChart";
import TransactionTable from "./components/TransactionTable";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroMes, setFiltroMes] = useState("Todos");

  // --- Lógica de Upload ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/upload", formData);
      setData(response.data.dados);

      // Reseta filtros ao carregar um novo arquivo
      setFiltroCategoria("Todas");
      setFiltroMes("Todos");
    } catch (error) {
      alert("Erro ao enviar arquivo. Verifique o backend.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Filtros e Listas ---
  const categorias = useMemo(() => ["Todas", ...new Set(data.map(i => i.Categoria))], [data]);
  const meses = useMemo(() => ["Todos", ...new Set(data.map(i => i.Mes_Ano))].sort(), [data]);

  const dadosFiltrados = useMemo(() => {
    return data.filter(item => {
      const matchCat = filtroCategoria === "Todas" || item.Categoria === filtroCategoria;
      const matchMes = filtroMes === "Todos" || item.Mes_Ano === filtroMes;
      return matchCat && matchMes;
    });
  }, [data, filtroCategoria, filtroMes]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      
      {/* Header e Botão Upload */}
      <HeaderUpload onUpload={handleFileUpload} loading={loading} />

      {data.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
          <UploadCloud className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500">Faça upload da planilha para começar.</p>
        </div>
      ) : (
        <div className="space-y-8">

          {/* KPIs */}
          <KpiSection data={dadosFiltrados} />

          {/* Gráficos */}
          <div className="flex flex-row lg:flex-row gap-8">
            <CategoryChart data={dadosFiltrados} />
            <RevenueChart data={dadosFiltrados} />
          </div>

          {/* Tabela (AGORA COM OS FILTROS PASSADOS COMO PROPS) */}
          <TransactionTable 
            data={dadosFiltrados}           
            categorias={categorias}          
            meses={meses}                   
            catAtual={filtroCategoria}       
            mesAtual={filtroMes}             
            setCat={setFiltroCategoria}     
            setMes={setFiltroMes}            
            onClear={() => {                 
                setFiltroCategoria("Todas"); 
                setFiltroMes("Todos"); 
            }}
          />
        </div>
      )}
    </div>
  );
}