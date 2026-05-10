import ConnectorIcon from '../ui/ConnectorIcon'

export default function SetupGuide({ connector }) {
  const guide = connector.setupGuide
  if (!guide) return null

  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-7">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <ConnectorIcon name="Info" size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 leading-tight">Setup Guide</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">How to get your credentials</p>
        </div>
      </div>

      <ul className="space-y-3 mb-5">
        {guide.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-xs leading-relaxed">
            <span className="w-5 h-5 rounded-full bg-white border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0 shadow-sm">
              {i + 1}
            </span>
            <span className="text-gray-600 pt-0.5">{step}</span>
          </li>
        ))}
      </ul>

      {guide.docs && (
        <a 
          href={guide.docs} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-blue-100 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-all shadow-sm"
        >
          View Official Documentation
          <ConnectorIcon name="ChevronRight" size={12} />
        </a>
      )}
    </div>
  )
}
