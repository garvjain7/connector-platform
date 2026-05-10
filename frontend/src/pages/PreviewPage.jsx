import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DataTable from '../components/preview/DataTable'
import ConnectorIcon from '../components/ui/ConnectorIcon'
import { TruncationWarning, LoadingSpinner } from '../components/ui/index'
import useIngestionStore from '../store/ingestionStore'
import { getDataset } from '../api/client'
import { getConnector } from '../config/connectors'

function MetaPill({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl">
      <ConnectorIcon name={icon} size={13} className="text-gray-400 shrink-0" />
      <div>
        <p className="text-[10px] text-gray-400 leading-none mb-0.5">{label}</p>
        <p className="text-xs font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  const { datasetId } = useParams()
  const navigate = useNavigate()
  const { truncationWarning, reset } = useIngestionStore()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const result = await getDataset(datasetId)
        setData(result)
      } catch {
        setError('Dataset not found or could not be loaded.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [datasetId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size="lg" className="text-blue-600" />
          <p className="text-sm text-gray-400">Loading dataset…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">{error}</p>
          <button onClick={() => navigate('/')}
            className="text-sm text-blue-600 hover:underline">Back to connectors</button>
        </div>
      </div>
    )
  }

  const { meta, columns, rows } = data
  const connector = getConnector(meta.connector)
  const importedAt = new Date(meta.imported_at).toLocaleString()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ConnectorIcon name="ArrowLeft" size={15} />
            All connectors
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700
              bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Import complete
            </span>
            <button
              onClick={() => { reset(); navigate('/') }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-medium
                rounded-xl hover:bg-blue-700 transition-all"
            >
              <ConnectorIcon name="Zap" size={12} />
              Import another
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Dataset header */}
        <div className="flex items-start gap-4 mb-6">
          {connector && (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              style={{ backgroundColor: connector.color }}
            >
              <ConnectorIcon name={connector.icon} size={20} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate mb-0.5">
              {meta.source}
            </h1>
            <p className="text-sm text-gray-400 font-mono">{meta.dataset_id}</p>
          </div>
        </div>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <MetaPill icon="Database"  label="Connector"   value={connector?.label || meta.connector} />
          <MetaPill icon="Table"     label="Rows shown"  value={`${rows.length} of ${meta.row_count_total?.toLocaleString()}`} />
          <MetaPill icon="LayoutGrid" label="Columns"    value={meta.column_count} />
          <MetaPill icon="Zap"       label="Imported at" value={importedAt} />
        </div>

        {/* Truncation warning */}
        {(truncationWarning || meta.truncated) && (
          <div className="mb-5">
            <TruncationWarning
              message={truncationWarning || `Showing first ${meta.row_count_stored?.toLocaleString()} of ${meta.row_count_total?.toLocaleString()} rows. Full dataset saved to normalized JSON.`}
            />
          </div>
        )}

        {/* Column schema strip */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {columns.map(col => (
            <span key={col.name}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs">
              <span className="font-medium text-gray-700">{col.name}</span>
              <span className="text-gray-400">{col.dtype}</span>
              {col.nullable && <span className="text-gray-300">nullable</span>}
            </span>
          ))}
        </div>

        {/* Data table */}
        <DataTable columns={columns} rows={rows} />

        {/* Footer note */}
        <p className="mt-4 text-xs text-gray-400 text-center">
          Full dataset (up to 10k rows) saved in{' '}
          <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
            uploads/normalized/{meta.dataset_id}.json
          </code>
        </p>
      </div>
    </div>
  )
}
