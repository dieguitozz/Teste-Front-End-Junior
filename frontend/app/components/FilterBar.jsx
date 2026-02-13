import { Filter, X } from "lucide-react";

export default function FilterBar({ 
  categorias = [], 
  meses = [], 
  catAtual, 
  mesAtual, 
  setCat, 
  setMes, 
  onClear 
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      
      {/* Título */}
      <div className="flex items-center gap-2 text-gray-700 font-bold w-full md:w-auto">
        <Filter size={20} className="text-blue-500"/>
        <h3 className="text-lg">Filtros</h3>
      </div>

      {/* Área dos Inputs e Botão */}
      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        
        {/* Select Categoria */}
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 w-full md:w-48 cursor-pointer"
          value={catAtual} 
          onChange={(e) => setCat(e.target.value)}
        >
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Select Mês */}
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 w-full md:w-48 cursor-pointer"
          value={mesAtual} 
          onChange={(e) => setMes(e.target.value)}
        >
          {meses.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Botão Limpar */}
        {(catAtual !== "Todas" || mesAtual !== "Todos") && (
          <button 
            onClick={onClear} 
            className="flex items-center justify-center gap-1 px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
          >
            <X size={16} />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}