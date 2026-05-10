// ── LoadingSpinner ────────────────────────────────────────────────────────────
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div className={`${sizes[size]} ${className} animate-spin rounded-full border-2 border-current border-t-transparent`} />
  )
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
export function StatusBadge({ status, label }) {
  const styles = {
    ok:      'bg-emerald-50 text-emerald-700 border border-emerald-200',
    error:   'bg-red-50 text-red-700 border border-red-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info:    'bg-blue-50 text-blue-700 border border-blue-200',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.info}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'ok' ? 'bg-emerald-500' :
        status === 'error' ? 'bg-red-500' :
        status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
      }`} />
      {label}
    </span>
  )
}

// ── ErrorState ────────────────────────────────────────────────────────────────
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-900 mb-1">Connection failed</p>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2">
          Try again
        </button>
      )}
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
      <p className="text-sm text-gray-500 mb-5">{description}</p>
      {action}
    </div>
  )
}

// ── TruncationWarning ─────────────────────────────────────────────────────────
export function TruncationWarning({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
      <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <span>{message}</span>
    </div>
  )
}
