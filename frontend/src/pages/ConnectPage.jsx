import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getConnector } from '../config/connectors'
import CredentialForm from '../components/setup/CredentialForm'
import SourceSelector from '../components/setup/SourceSelector'
import SetupGuide from '../components/setup/SetupGuide'
import ConnectorIcon from '../components/ui/ConnectorIcon'
import { LoadingSpinner } from '../components/ui/index'
import useIngestionStore from '../store/ingestionStore'
import { validateConnector, fetchData } from '../api/client'

// Step indicator at the top
function StepBar({ step }) {
  const steps = ['Credentials', 'Select Source', 'Import']
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const idx = i + 1
        const done = step > idx
        const active = step === idx
        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                ${done ? 'bg-emerald-500 text-white' :
                  active ? 'bg-blue-600 text-white' :
                  'bg-gray-100 text-gray-400'}`}>
                {done
                  ? <ConnectorIcon name="Check" size={11} />
                  : idx}
              </div>
              <span className={`text-xs font-medium transition-colors
                ${active ? 'text-gray-900' : done ? 'text-emerald-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-10 h-px mx-3 transition-colors ${done ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Connection success animation shown briefly after validate
function ConnectionSuccess({ message, onContinue }) {
  useEffect(() => {
    const t = setTimeout(onContinue, 1400)
    return () => clearTimeout(t)
  }, [onContinue])

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-pulse-once">
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4
        ring-4 ring-emerald-100">
        <ConnectorIcon name="Check" size={28} className="text-emerald-500" />
      </div>
      <p className="text-base font-semibold text-gray-900 mb-1">Connected successfully</p>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}

export default function ConnectPage() {
  const { connectorId } = useParams()
  const navigate = useNavigate()
  const connector = getConnector(connectorId)

  const {
    credentials, files,
    availableSources, selectedSource,
    loading, error,
    validateMessage,
    setAvailableSources,
    setLoading, setError,
    setFetchResult, clearCredentials,
    selectConnector,
  } = useIngestionStore()

  // Local UI steps: 1=credentials, 2=source-select, 3=importing
  const [uiStep, setUiStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!connector) navigate('/')
    else selectConnector(connectorId)
  }, [connectorId, connector, navigate, selectConnector])

  if (!connector) return null

  // ── Validate (test connection) ──────────────────────────────────────────────
  const handleValidate = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await validateConnector(connectorId, credentials, files)
      if (result.status === 'error') {
        setError(result.message || 'Connection failed')
      } else {
        setAvailableSources(result.sources, result.message)
        setShowSuccess(true)
      }
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Connection failed')
    } finally {
      setLoading(false)
    }
  }

  // After success animation finishes
  const handleSuccessDone = () => {
    setShowSuccess(false)
    setUiStep(2)
  }

  // ── Fetch (import data) ─────────────────────────────────────────────────────
  const handleFetch = async () => {
    if (!selectedSource) return
    setLoading(true)
    setError(null)
    setUiStep(3)
    try {
      const result = await fetchData(connectorId, credentials, files, selectedSource)
      setFetchResult(result.dataset_id, result.meta, result.truncation_warning)
      clearCredentials()
      navigate(`/preview/${result.dataset_id}`)
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Import failed')
      setUiStep(2)
    } finally {
      setLoading(false)
    }
  }

  // ── Derived state ───────────────────────────────────────────────────────────
  const canValidate = connector.fields
    .filter(f => f.required)
    .every(f => {
      if (f.type === 'file' || f.type === 'service_account_file') return !!files[f.key]
      return !!credentials[f.key]
    })

  const stepBarStep = uiStep === 3 ? 3 : uiStep

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ConnectorIcon name="ArrowLeft" size={15} />
            All connectors
          </button>
          <StepBar step={stepBarStep} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-4xl">
          
          {/* Connector identity header */}
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0"
              style={{ backgroundColor: connector.color }}
            >
              <ConnectorIcon name={connector.icon} size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{connector.label}</h1>
              <p className="text-sm text-gray-500">{connector.description}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column: Documentation Guide */}
            <div className="w-full lg:w-[380px] shrink-0">
              <SetupGuide connector={connector} />
            </div>

            {/* Right Column: Card */}
            <div className="flex-1 w-full">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            {/* ── Step 1: Credentials ─────────────────────────────────────── */}
            {uiStep === 1 && (
              <>
                <div className="px-6 pt-6 pb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                    Connection settings
                  </p>

                  {showSuccess ? (
                    <ConnectionSuccess
                      message={validateMessage}
                      onContinue={handleSuccessDone}
                    />
                  ) : (
                    <>
                      <CredentialForm connector={connector} />

                      {error && (
                        <div className="mt-4 flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                          <ConnectorIcon name="X" size={14} className="mt-0.5 shrink-0 text-red-400" />
                          <span>{error}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {!showSuccess && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <ConnectorIcon name="Lock" size={12} />
                      Credentials used in-session only
                    </div>
                    <button
                      onClick={handleValidate}
                      disabled={!canValidate || loading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium
                        rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all shadow-sm"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Testing…
                        </>
                      ) : (
                        <>
                          <ConnectorIcon name="Zap" size={14} />
                          Test connection
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── Step 2: Source selection ────────────────────────────────── */}
            {uiStep === 2 && (
              <>
                <div className="px-6 pt-6 pb-5">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Select source
                    </p>
                    <button
                      onClick={() => { setUiStep(1); setError(null) }}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                    >
                      <ConnectorIcon name="ArrowLeft" size={11} />
                      Back
                    </button>
                  </div>

                  <SourceSelector sources={availableSources} />

                  {error && (
                    <div className="mt-4 flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      <ConnectorIcon name="X" size={14} className="mt-0.5 shrink-0 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {selectedSource
                      ? `Selected: ${availableSources.find(s => s.id === selectedSource)?.label}`
                      : 'Pick a source above'}
                  </p>
                  <button
                    onClick={handleFetch}
                    disabled={!selectedSource || loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium
                      rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all shadow-sm"
                  >
                    <ConnectorIcon name="Download" size={14} />
                    Import data
                  </button>
                </div>
              </>
            )}

            {/* ── Step 3: Importing (loading) ─────────────────────────────── */}
            {uiStep === 3 && (
              <div className="px-6 py-14 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center"
                  style={{ backgroundColor: `${connector.color}15` }}>
                  <LoadingSpinner size="lg" className="text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Importing data…</p>
                <p className="text-xs text-gray-400">
                  Fetching from {connector.label}, normalizing structure
                </p>
              </div>
            )}
              </div>
            </div>
          </div>

          {/* Trust footer */}
          <div className="mt-4 flex items-center justify-center gap-5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <ConnectorIcon name="Lock" size={11} />
              Credentials never stored
            </span>
            <span className="flex items-center gap-1.5">
              <ConnectorIcon name="Eye" size={11} />
              Read-only access
            </span>
            <span className="flex items-center gap-1.5">
              <ConnectorIcon name="Zap" size={11} />
              10k row cap
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
