import { useState } from 'react'
import ConnectorIcon from '../ui/ConnectorIcon'

export default function DataTable({ columns, rows }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageInput, setPageInput] = useState('')
  const pageSize = 50

  if (!columns?.length) return null

  const totalRows = rows.length
  const totalPages = Math.ceil(totalRows / pageSize)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = Math.min(startIdx + pageSize, totalRows)
  const currentRows = rows.slice(startIdx, endIdx)

  const handlePageJump = (e) => {
    e.preventDefault()
    const p = parseInt(pageInput)
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p)
      setPageInput('')
    }
  }

  return (
    <div className="space-y-3">
      {/* Pagination Top */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 
                disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all"
            >
              <ConnectorIcon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 
                disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent transition-all"
            >
              <ConnectorIcon name="ChevronRight" size={16} />
            </button>
          </div>
          <span className="text-xs font-medium text-gray-500">
            {totalRows > 0 ? `${startIdx + 1}-${endIdx}` : '0'} <span className="text-gray-300 mx-0.5">of</span> {totalRows.toLocaleString()}
          </span>
        </div>

        <form onSubmit={handlePageJump} className="flex items-center gap-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Jump to page</label>
          <input
            type="number"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            placeholder={currentPage}
            className="w-12 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </form>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              {columns.map(col => (
                <th key={col.name}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {col.name}
                    <span className="font-normal text-gray-400 normal-case tracking-normal">
                      {col.dtype}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentRows.map((row, i) => (
              <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                {columns.map(col => (
                  <td key={col.name} className="px-4 py-2.5 text-gray-700 whitespace-nowrap max-w-xs truncate text-[13px]">
                    {row[col.name] === null || row[col.name] === undefined
                      ? <span className="text-gray-300 italic">null</span>
                      : String(row[col.name])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Page Info Bottom */}
      <div className="flex items-center justify-between px-1 text-[11px] text-gray-400">
        <span>Page {currentPage} of {totalPages}</span>
        <span>Showing {pageSize} rows per page</span>
      </div>
    </div>
  )
}
