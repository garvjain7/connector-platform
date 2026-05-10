import ConnectorIcon from '../ui/ConnectorIcon'
import useIngestionStore from '../../store/ingestionStore'

export default function SourceSelector({ sources }) {
  const { selectedSource, setSelectedSource } = useIngestionStore()

  if (!sources.length) return null

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">
        Select a source — {sources.length} available
      </p>
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        {sources.map(source => {
          const isSelected = selectedSource === source.id
          return (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all
                ${isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                ${isSelected ? 'bg-white/20' : 'bg-white border border-gray-200'}`}>
                <ConnectorIcon
                  name="Table"
                  size={13}
                  className={isSelected ? 'text-white' : 'text-gray-500'}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {source.label}
                </p>
                {source.meta?.schema && (
                  <p className={`text-xs truncate ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                    schema: {source.meta.schema}
                  </p>
                )}
                {source.meta?.preview_columns && (
                  <p className={`text-xs truncate ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                    {source.meta.preview_columns.slice(0, 4).join(', ')}
                    {source.meta.preview_columns.length > 4 ? ` +${source.meta.preview_columns.length - 4} more` : ''}
                  </p>
                )}
              </div>
              {isSelected && (
                <ConnectorIcon name="Check" size={14} className="text-white shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
