import { UploadCloud } from "lucide-react";

export default function HeaderUpload({ onUpload, loading }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4  bg-gradient-to-r from-blue-950 to-blue-800 h-40 p-6 rounded-2xl shadow-sm">
      <div>
        <h1 className="font-bold text-gray-400 uppercase pb-2">Avaliacão Técnica</h1>
        <p className="text-white text-3xl ">Mini Dashboard de Vendas</p>
      </div>
      
      <label className={`flex items-center gap-2 bg-white text-blue-500 px-6 py-3 rounded-xl shadow-lg transition-all ${loading ? 'opacity-70 cursor-wait' : 'hover:bg-white cursor-pointer hover:scale-105'}`}>
        {loading ? <span className="animate-pulse">Processando...</span> : <UploadCloud size={24} />}
        <span className="font-semibold"> Carregar Planilha </span>
        <input type="file" accept=".xlsx, .xls" onChange={onUpload} className="hidden" disabled={loading} />
      </label>
    </div>
  );
}