import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONNECTORS, CONNECTOR_CATEGORIES } from '../config/connectors'
import ConnectorCard from '../components/connector/ConnectorCard'
import ConnectorIcon from '../components/ui/ConnectorIcon'
import useIngestionStore from '../store/ingestionStore'

export default function ImportPage() {
  const navigate = useNavigate()
  const { selectConnector, reset } = useIngestionStore()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // Always reset state when landing on import page
  useState(() => { reset() }, [])

  const filtered = CONNECTORS.filter(c => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory
    const matchesSearch = !search ||
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSelect = (connector) => {
    selectConnector(connector.id)
    navigate(`/connect/${connector.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ConnectorIcon name="Zap" size={15} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Connector Platform</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">
            Connect to a data source to import and preview your data
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Add a data source</h2>
          <p className="text-sm text-gray-500">
            Choose from {CONNECTORS.length} connectors. Connect your databases, files, and SaaS tools.
          </p>
        </div>

        {/* Search + Category filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-7">
          {/* Search */}
          <div className="relative flex-1">
            <ConnectorIcon
              name="Search"
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search connectors…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                placeholder:text-gray-300"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <ConnectorIcon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 flex-wrap">
            {CONNECTOR_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all
                  ${activeCategory === cat.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {search && (
          <p className="text-xs text-gray-400 mb-4">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </p>
        )}

        {/* Connector grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(connector => (
              <ConnectorCard
                key={connector.id}
                connector={connector}
                onClick={handleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <ConnectorIcon name="Search" size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No connectors found</p>
            <p className="text-xs text-gray-400">Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  )
}
