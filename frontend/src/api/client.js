import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''
const http = axios.create({ baseURL: API_URL })

// ── Connectors ────────────────────────────────────────────────────────────────

export async function fetchConnectors() {
  const { data } = await http.get('/connectors')
  return data
}

// ── Ingest ────────────────────────────────────────────────────────────────────

/**
 * Build a FormData payload from credentials + files.
 * This is the single place that handles multipart vs JSON logic.
 * Components never deal with FormData directly.
 */
function buildFormData(connector, credentials, files, source = null) {
  const form = new FormData()
  form.append('connector', connector)

  // Separate file fields from plain credential fields
  const plainCreds = {}
  for (const [key, value] of Object.entries(credentials)) {
    plainCreds[key] = value
  }
  form.append('credentials', JSON.stringify(plainCreds))

  // Attach uploaded files
  if (files.file) {
    form.append('file', files.file)
  }
  if (files.service_account_file) {
    form.append('service_account_file', files.service_account_file)
  }

  if (source !== null) {
    form.append('source', source)
  }

  return form
}

export async function validateConnector(connector, credentials, files) {
  const form = buildFormData(connector, credentials, files)
  const { data } = await http.post('/api/ingest/validate', form)
  return data
}

export async function fetchData(connector, credentials, files, source) {
  const form = buildFormData(connector, credentials, files, source)
  const { data } = await http.post('/api/ingest/fetch', form)
  return data
}

// ── Datasets ──────────────────────────────────────────────────────────────────

export async function listDatasets() {
  const { data } = await http.get('/api/datasets')
  return data
}

export async function getDataset(datasetId) {
  const { data } = await http.get(`/api/datasets/${datasetId}`)
  return data
}

export async function deleteDataset(datasetId) {
  const { data } = await http.delete(`/api/datasets/${datasetId}`)
  return data
}
