import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ImportPage from './pages/ImportPage'
import ConnectPage from './pages/ConnectPage'
import PreviewPage from './pages/PreviewPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                      element={<ImportPage />} />
        <Route path="/connect/:connectorId"  element={<ConnectPage />} />
        <Route path="/preview/:datasetId"    element={<PreviewPage />} />
        <Route path="*"                      element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
