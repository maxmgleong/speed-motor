export default function FilterTabs({ filter, onFilterChange }) {
  const brands = ['Semua', 'Honda', 'Toyota', 'Mazda', 'Proton', 'Perodua']
  
  return (
    <div className="px-4 -mt-4 mb-4">
      <div className="bg-white rounded-2xl p-1.5 flex card-shadow overflow-x-auto">
        {brands.map(brand => (
          <button 
            key={brand} 
            onClick={() => onFilterChange(brand === 'Semua' ? 'semua' : brand)} 
            className={`flex-1 py-2.5 px-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${filter === (brand === 'Semua' ? 'semua' : brand) ? 'bg-red-600 text-white shadow' : 'text-muted hover:bg-red-50'}`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  )
}
