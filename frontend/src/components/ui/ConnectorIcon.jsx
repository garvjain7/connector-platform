// Lightweight icon set — avoids bundling all of lucide-react
// Each icon is a minimal inline SVG path

const paths = {
  FileText: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  Table: "M3 10h18M3 6h18M3 14h18M3 18h18M9 6v12M15 6v12M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z",
  Globe: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0c-1.657 3.134-2.5 6.5-2.5 10s.843 6.866 2.5 10M12 2c1.657 3.134 2.5 6.5 2.5 10s-.843 6.866-2.5 10M2 12h20",
  Database: "M12 2C7.589 2 4 3.343 4 5v14c0 1.657 3.589 3 8 3s8-1.343 8-3V5c0-1.657-3.589-3-8-3zm0 0c4.411 0 8 1.343 8 3M4 8c0 1.657 3.589 3 8 3s8-1.343 8-3M4 13c0 1.657 3.589 3 8 3s8-1.343 8-3",
  Sheet: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM8 13h8M8 17h5M14 2v6h6",
  LayoutGrid: "M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z",
  BookOpen: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3zm20 0h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z",
  Users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8 4v-2a4 4 0 00-3-3.87M23 21v-2a4 4 0 00-3-3.87",
  BarChart2: "M18 20V10M12 20V4M6 20v-6",
  Check: "M20 6L9 17l-5-5",
  ChevronRight: "M9 18l6-6-6-6",
  ChevronLeft: "M15 18l-6-6 6-6",
  Search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  X: "M18 6L6 18M6 6l12 12",
  ArrowLeft: "M19 12H5m0 0l7 7m-7-7l7-7",
  Upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  Download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  Trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  Eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 0a2 2 0 100 4 2 2 0 000-4z",
  Zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  Lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  Info: "M12 22a10 10 0 100-20 10 10 0 000 20zm0-9v-4m0 8h.01",
}

export default function ConnectorIcon({ name, size = 20, className = '', style = {} }) {
  const d = paths[name] || paths.Database
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {d.split('M').filter(Boolean).map((segment, i) => (
        <path key={i} d={`M${segment}`} />
      ))}
    </svg>
  )
}
