export default function FilterBar({
  data = [],
  categorias = [],
  meses = [],
  catAtual,
  mesAtual,
  setCat,
  setMes,
  onClear,
}) 
{
  return (
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
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-3 w-4xl border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 cursor-pointer"
          value={mesAtual}
          onChange={(e) => setMes(e.target.value)}
        >
          {meses.map((m) => (
            <option key={m} value={m}>
              {m.includes("-") ? m.split("-").reverse().join("/") : m}
            </option>
          ))}
        </select>

        <button
          onClick={onClear}
          className="px-4 py-3 text-sm text-white w-32  bg-blue-600 rounded-lg cursor-pointer font-medium transition-colors ml-auto md:ml-0"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
}