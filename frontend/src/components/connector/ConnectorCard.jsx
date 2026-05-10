import ConnectorIcon from '../ui/ConnectorIcon'
import { TIER_LABELS } from '../../config/connectors'

export default function ConnectorCard({ connector, onClick }) {
  const tier = TIER_LABELS[connector.tier]

  return (
    <button
      onClick={() => onClick(connector)}
      className="group relative w-full text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {/* Top row: icon + tier badge */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: connector.color }}
        >
          <ConnectorIcon name={connector.icon} size={20} />
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tier.color}`}>
          {tier.label}
        </span>
      </div>

      {/* Name + description */}
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {connector.label}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {connector.description}
        </p>
      </div>

      {/* Arrow hint on hover */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ConnectorIcon name="ChevronRight" size={14} className="text-gray-400" />
      </div>
    </button>
  )
}
