// Central config for all 10 connectors.
// This drives the gallery cards, credential forms, and API client logic.
// Adding connector 11 = one object here. Zero component changes.

export const CONNECTOR_CATEGORIES = [
  { id: 'all',       label: 'All' },
  { id: 'file',      label: 'Files' },
  { id: 'database',  label: 'Databases' },
  { id: 'saas',      label: 'SaaS' },
  { id: 'analytics', label: 'Analytics' },
]

export const CONNECTORS = [
  {
    id: 'csv',
    label: 'CSV File',
    category: 'file',
    tier: 'easy',
    description: 'Import data from a comma-separated values file',
    authType: 'file_upload',
    color: '#16a34a',
    icon: 'FileText',
    fields: [
      { key: 'file', label: 'CSV File', type: 'file', accept: '.csv', required: true,
        hint: 'Upload a .csv file' },
    ],
    setupGuide: {
      steps: [
        'Ensure your CSV file has a header row with unique column names.',
        'The file should use commas (,) as delimiters.',
        'Large files (up to 10k rows) are supported for the preview.'
      ]
    }
  },
  {
    id: 'excel',
    label: 'Excel',
    category: 'file',
    tier: 'easy',
    description: 'Import data from an Excel spreadsheet (.xlsx or .xls)',
    authType: 'file_upload',
    color: '#15803d',
    icon: 'Table',
    fields: [
      { key: 'file', label: 'Excel File', type: 'file', accept: '.xlsx,.xls', required: true,
        hint: 'Upload an .xlsx or .xls file' },
    ],
    setupGuide: {
      steps: [
        'Your Excel file can contain multiple sheets; you will select one in the next step.',
        'Ensure the first row of your data contains column headers.',
        'Supported formats: .xlsx and .xls.'
      ]
    }
  },
  {
    id: 'json_api',
    label: 'JSON / REST API',
    category: 'file',
    tier: 'easy',
    description: 'Fetch data from any public JSON REST endpoint',
    authType: 'url',
    color: '#d97706',
    icon: 'Globe',
    fields: [
      { key: 'url', label: 'Endpoint URL', type: 'text', required: true,
        placeholder: 'https://api.example.com/data',
        hint: 'Must return a JSON array or object' },
      { key: 'json_path', label: 'JSON Path (optional)', type: 'text', required: false,
        placeholder: 'data.records',
        hint: 'Dot-separated path to the array, e.g. data.results' },
    ],
    setupGuide: {
      steps: [
        'The URL must be a public GET endpoint (no authentication required currently).',
        'If the data is nested (e.g. inside a "results" key), specify the path in the JSON Path field.',
        'The final target must be an array of objects.'
      ]
    }
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    category: 'database',
    tier: 'easy',
    description: 'Connect to a PostgreSQL database and import any table',
    authType: 'credentials',
    color: '#2563eb',
    icon: 'Database',
    fields: [
      { key: 'host',     label: 'Host',     type: 'text',     required: true, placeholder: 'localhost' },
      { key: 'port',     label: 'Port',     type: 'number',   required: false, placeholder: '5432' },
      { key: 'database', label: 'Database', type: 'text',     required: true, placeholder: 'mydb' },
      { key: 'username', label: 'Username', type: 'text',     required: true, placeholder: 'postgres' },
      { key: 'password', label: 'Password', type: 'password', required: true },
    ],
    setupGuide: {
      steps: [
        'Find your database host address (IP or domain).',
        'Ensure your database firewall allows incoming connections from your current IP.',
        'Default PostgreSQL port is 5432.',
        'In the next step, you will be able to pick any table from your schemas.'
      ]
    }
  },
  {
    id: 'mysql',
    label: 'MySQL',
    category: 'database',
    tier: 'easy',
    description: 'Connect to a MySQL or MariaDB database',
    authType: 'credentials',
    color: '#0284c7',
    icon: 'Database',
    fields: [
      { key: 'host',     label: 'Host',     type: 'text',     required: true, placeholder: 'localhost' },
      { key: 'port',     label: 'Port',     type: 'number',   required: false, placeholder: '3306' },
      { key: 'database', label: 'Database', type: 'text',     required: true, placeholder: 'mydb' },
      { key: 'username', label: 'Username', type: 'text',     required: true, placeholder: 'root' },
      { key: 'password', label: 'Password', type: 'password', required: true },
    ],
    setupGuide: {
      steps: [
        'Find your MySQL server host and credentials.',
        'Check that the user has SELECT permissions for the target database.',
        'Default MySQL port is 3306.',
        'The platform will list all base tables in the database for you to choose from.'
      ]
    }
  },
  {
    id: 'google_sheets',
    label: 'Google Sheets',
    category: 'saas',
    tier: 'medium',
    description: 'Import data from a Google Sheets spreadsheet via Service Account',
    authType: 'service_account',
    color: '#16a34a',
    icon: 'Sheet',
    fields: [
      { key: 'spreadsheet_id', label: 'Spreadsheet ID', type: 'text', required: true,
        placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms',
        hint: 'Found in the spreadsheet URL between /d/ and /edit' },
      { key: 'service_account_file', label: 'Service Account JSON', type: 'service_account_file',
        accept: '.json', required: true,
        hint: 'Download from Google Cloud Console → IAM → Service Accounts' },
    ],
    setupGuide: {
      steps: [
        'Go to Google Cloud Console and create a project.',
        'Enable the Google Sheets API.',
        'Create a Service Account and download the JSON key file.',
        'Share your spreadsheet with the service account email (found in the JSON).',
        'Copy the Spreadsheet ID from the browser URL.'
      ],
      docs: 'https://cloud.google.com/iam/docs/service-accounts-create'
    }
  },
  {
    id: 'airtable',
    label: 'Airtable',
    category: 'saas',
    tier: 'medium',
    description: 'Pull records from any table in an Airtable base',
    authType: 'api_key',
    color: '#f59e0b',
    icon: 'LayoutGrid',
    fields: [
      { key: 'api_key', label: 'Personal Access Token', type: 'password', required: true,
        hint: 'Generate at airtable.com/create/tokens' },
      { key: 'base_id', label: 'Base ID', type: 'text', required: true,
        placeholder: 'appXXXXXXXXXXXXXX',
        hint: 'Found in the URL: airtable.com/appXXX/...' },
    ],
    setupGuide: {
      steps: [
        'Visit your Airtable Account settings.',
        'Create a "Personal Access Token" with data.records:read scope.',
        'Copy the Base ID from the Airtable API documentation page for your base.'
      ],
      docs: 'https://support.airtable.com/docs/creating-and-using-personal-access-tokens'
    }
  },
  {
    id: 'notion',
    label: 'Notion',
    category: 'saas',
    tier: 'medium',
    description: 'Import rows from a Notion database via integration token',
    authType: 'api_key',
    color: '#1c1917',
    icon: 'BookOpen',
    fields: [
      { key: 'api_key', label: 'Integration Token', type: 'password', required: true,
        hint: 'Create at notion.so/my-integrations, then share the DB with it' },
      { key: 'database_id', label: 'Database ID', type: 'text', required: true,
        placeholder: '8a5f2d3e-...',
        hint: 'From the database URL: notion.so/username/DATABASE_ID?v=...' },
    ],
    setupGuide: {
      steps: [
        'Go to notion.so/my-integrations and create a New Integration.',
        'Copy the "Internal Integration Token".',
        'Open your Notion database, click "..." -> "Add connections" and select your integration.',
        'Copy the Database ID from the URL.'
      ],
      docs: 'https://developers.notion.com/docs/getting-started'
    }
  },
  {
    id: 'hubspot',
    label: 'HubSpot',
    category: 'analytics',
    tier: 'hard',
    description: 'Import CRM objects (contacts, deals, companies) from HubSpot',
    authType: 'api_key',
    color: '#ea580c',
    icon: 'Users',
    fields: [
      { key: 'api_key', label: 'Private App Token', type: 'password', required: true,
        hint: 'Create a Private App in HubSpot Settings → Integrations → Private Apps' },
    ],
    setupGuide: {
      steps: [
        'In HubSpot, go to Settings -> Integrations -> Private Apps.',
        'Create a new Private App.',
        'Select the "crm.objects.contacts.read" scope.',
        'Copy the Access Token.'
      ],
      docs: 'https://developers.hubspot.com/docs/api/private-apps'
    }
  },
  {
    id: 'google_analytics',
    label: 'Google Analytics 4',
    category: 'analytics',
    tier: 'hard',
    description: 'Pull reports from a GA4 property via Service Account',
    authType: 'service_account',
    color: '#f97316',
    icon: 'BarChart2',
    fields: [
      { key: 'property_id', label: 'GA4 Property ID', type: 'text', required: true,
        placeholder: 'properties/123456789',
        hint: 'Found in GA4 Admin → Property Settings → Property ID' },
      { key: 'service_account_file', label: 'Service Account JSON', type: 'service_account_file',
        accept: '.json', required: true,
        hint: 'Service account must have Viewer access to the GA4 property' },
    ],
    setupGuide: {
      steps: [
        'Create a Google Cloud Service Account (same as Google Sheets).',
        'Go to Google Analytics Admin -> Property Access Management.',
        'Add the Service Account email with "Viewer" role.',
        'Enable the Google Analytics Data API in Cloud Console.',
        'Copy the Property ID from GA4 Property Settings.'
      ],
      docs: 'https://developers.google.com/analytics/devguides/reporting/data/v1'
    }
  },
]

export const TIER_LABELS = {
  easy:   { label: 'Easy setup',   color: 'text-emerald-600 bg-emerald-50' },
  medium: { label: 'Medium setup', color: 'text-amber-600 bg-amber-50' },
  hard:   { label: 'Advanced',     color: 'text-rose-600 bg-rose-50' },
}

export function getConnector(id) {
  return CONNECTORS.find(c => c.id === id) || null
}
