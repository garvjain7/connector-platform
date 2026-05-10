import { useRef } from 'react'
import ConnectorIcon from '../ui/ConnectorIcon'
import useIngestionStore from '../../store/ingestionStore'

function FieldHint({ hint }) {
  if (!hint) return null
  return (
    <p className="mt-1.5 text-xs text-gray-400 flex items-start gap-1">
      <ConnectorIcon name="Info" size={12} className="mt-0.5 shrink-0 text-gray-400" />
      {hint}
    </p>
  )
}

function TextField({ field, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={field.type}
        value={value || ''}
        onChange={e => onChange(field.key, e.target.value)}
        placeholder={field.placeholder || ''}
        required={field.required}
        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder:text-gray-300 transition-all"
      />
      <FieldHint hint={field.hint} />
    </div>
  )
}

function FileField({ field, currentFile, onChange }) {
  const inputRef = useRef()

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onChange(field.key, file)
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative w-full border-2 border-dashed rounded-xl p-5 cursor-pointer
          transition-all text-center group
          ${currentFile
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={field.accept}
          onChange={handleChange}
          className="hidden"
        />
        {currentFile ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <ConnectorIcon name="Check" size={14} className="text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-emerald-700">{currentFile.name}</p>
              <p className="text-xs text-emerald-500">{(currentFile.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <ConnectorIcon name="Upload" size={16} className="text-gray-400 group-hover:text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                Click to upload
              </p>
              <p className="text-xs text-gray-400">{field.accept} files only</p>
            </div>
          </div>
        )}
      </div>
      <FieldHint hint={field.hint} />
    </div>
  )
}

export default function CredentialForm({ connector }) {
  const { credentials, files, setCredential, setFile } = useIngestionStore()

  return (
    <div className="space-y-4">
      {connector.fields.map(field => {
        if (field.type === 'file' || field.type === 'service_account_file') {
          return (
            <FileField
              key={field.key}
              field={field}
              currentFile={files[field.key]}
              onChange={setFile}
            />
          )
        }
        return (
          <TextField
            key={field.key}
            field={field}
            value={credentials[field.key]}
            onChange={setCredential}
          />
        )
      })}
    </div>
  )
}
