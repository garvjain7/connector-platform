import { create } from 'zustand'

const useIngestionStore = create((set) => ({
  // ── Step tracking ──────────────────────────────────────────────────────────
  currentStep: 'select',   // 'select' | 'connect' | 'preview'

  // ── Connector selection ────────────────────────────────────────────────────
  selectedConnector: null,   // connector id string

  // ── Credentials (in-memory only, never persisted) ─────────────────────────
  credentials: {},
  files: {},   // key → File object for file-type fields

  // ── Validate result ────────────────────────────────────────────────────────
  availableSources: [],
  selectedSource: null,
  validateMessage: '',

  // ── Fetch result ───────────────────────────────────────────────────────────
  datasetId: null,
  fetchMeta: null,
  truncationWarning: null,

  // ── Preview data ───────────────────────────────────────────────────────────
  previewData: null,   // { meta, columns, rows }

  // ── UI state ───────────────────────────────────────────────────────────────
  loading: false,
  error: null,

  // ── Actions ────────────────────────────────────────────────────────────────
  selectConnector: (connectorId) => set({
    selectedConnector: connectorId,
    credentials: {},
    files: {},
    availableSources: [],
    selectedSource: null,
    validateMessage: '',
    error: null,
  }),

  setCredential: (key, value) => set(state => ({
    credentials: { ...state.credentials, [key]: value },
  })),

  setFile: (key, file) => set(state => ({
    files: { ...state.files, [key]: file },
  })),

  setAvailableSources: (sources, message) => set({
    availableSources: sources,
    validateMessage: message,
  }),

  setSelectedSource: (source) => set({ selectedSource: source }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setFetchResult: (datasetId, meta, truncationWarning) => set({
    datasetId,
    fetchMeta: meta,
    truncationWarning,
  }),

  setPreviewData: (data) => set({ previewData: data }),

  // Clear sensitive credentials after successful fetch
  clearCredentials: () => set({ credentials: {}, files: {} }),

  // Full reset for "Import Another"
  reset: () => set({
    currentStep: 'select',
    selectedConnector: null,
    credentials: {},
    files: {},
    availableSources: [],
    selectedSource: null,
    validateMessage: '',
    datasetId: null,
    fetchMeta: null,
    truncationWarning: null,
    previewData: null,
    loading: false,
    error: null,
  }),
}))

export default useIngestionStore
