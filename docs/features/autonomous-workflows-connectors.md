# Data Source Connectors - Specification

## Overview

Data source connectors enable workflows to pull data from external platforms, process it, and feed it to AI models. This document specifies the connector architecture and implementation for major platforms.

---

## Connector Architecture

### Base Connector Interface

```typescript
interface DataConnector {
  // Metadata
  name: string
  type: string
  version: string

  // Authentication
  authType: 'oauth2' | 'api_key' | 'basic' | 'none'
  configureAuth(credentials: any): Promise<void>
  testConnection(): Promise<boolean>

  // Data operations
  fetch(config: ConnectorConfig): Promise<any>
  push(config: ConnectorConfig, data: any): Promise<void>

  // Schema discovery
  getSchema(): Promise<DataSchema>
  listResources(): Promise<Resource[]>

  // Sync management
  sync(config: SyncConfig): Promise<SyncResult>
}

interface ConnectorConfig {
  sourceId: string
  query?: QueryConfig
  transform?: TransformConfig
  pagination?: PaginationConfig
}

interface SyncConfig {
  mode: 'full' | 'incremental'
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly'
  lastSyncedAt?: Date
}
```

---

## Connector Implementations

### 1. Google Sheets Connector

#### Configuration

```typescript
interface GoogleSheetsConfig {
  spreadsheetId: string
  sheet: string
  range?: string // e.g., "A1:D100"
  query?: {
    columns?: string[]
    where?: QueryCondition[]
    orderBy?: string
    limit?: number
  }
}
```

#### Implementation

```typescript
// lib/connectors/google-sheets.ts

import { google } from 'googleapis'

export class GoogleSheetsConnector implements DataConnector {
  name = 'Google Sheets'
  type = 'google_sheets'
  version = '1.0'
  authType = 'oauth2' as const

  private sheets: any
  private auth: any

  async configureAuth(credentials: OAuth2Credentials) {
    this.auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    )

    this.auth.setCredentials({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
    })

    this.sheets = google.sheets({ version: 'v4', auth: this.auth })
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.sheets.spreadsheets.get({
        spreadsheetId: 'test',
      })
      return true
    } catch (error) {
      return false
    }
  }

  async fetch(config: GoogleSheetsConfig): Promise<any> {
    const { spreadsheetId, sheet, range, query } = config

    // Build range
    const fullRange = range || `${sheet}!A:Z`

    // Fetch data
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: fullRange,
      valueRenderOption: 'FORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING',
    })

    const rows = response.data.values || []

    if (rows.length === 0) {
      return []
    }

    // Convert to objects
    const headers = rows[0]
    const data = rows.slice(1).map((row) => {
      const obj: any = {}
      headers.forEach((header, index) => {
        obj[header] = row[index] || null
      })
      return obj
    })

    // Apply query filters
    if (query) {
      return this.applyQuery(data, query)
    }

    return data
  }

  async push(config: GoogleSheetsConfig, data: any[]): Promise<void> {
    const { spreadsheetId, sheet } = config

    // Convert objects to rows
    const headers = Object.keys(data[0])
    const rows = data.map((obj) => headers.map((h) => obj[h]))

    // Append to sheet
    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheet}!A:Z`,
      valueInputOption: 'RAW',
      resource: {
        values: [headers, ...rows],
      },
    })
  }

  async getSchema(): Promise<DataSchema> {
    // Get column headers from first row
    // Return schema definition
  }

  async listResources(): Promise<Resource[]> {
    // List all sheets in the spreadsheet
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId: config.spreadsheetId,
    })

    return response.data.sheets.map((sheet) => ({
      id: sheet.properties.sheetId,
      name: sheet.properties.title,
      type: 'sheet',
    }))
  }

  private applyQuery(data: any[], query: QueryConfig): any[] {
    let result = [...data]

    // Filter
    if (query.where) {
      result = result.filter((row) => this.evaluateConditions(row, query.where))
    }

    // Select columns
    if (query.columns) {
      result = result.map((row) => {
        const filtered: any = {}
        query.columns!.forEach((col) => {
          filtered[col] = row[col]
        })
        return filtered
      })
    }

    // Order
    if (query.orderBy) {
      const [column, direction] = query.orderBy.split(' ')
      result.sort((a, b) => {
        if (direction === 'DESC') {
          return b[column] > a[column] ? 1 : -1
        }
        return a[column] > b[column] ? 1 : -1
      })
    }

    // Limit
    if (query.limit) {
      result = result.slice(0, query.limit)
    }

    return result
  }
}
```

### 2. Airtable Connector

#### Configuration

```typescript
interface AirtableConfig {
  baseId: string
  tableId: string
  view?: string
  filterByFormula?: string
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>
  maxRecords?: number
}
```

#### Implementation

```typescript
// lib/connectors/airtable.ts

import Airtable from 'airtable'

export class AirtableConnector implements DataConnector {
  name = 'Airtable'
  type = 'airtable'
  version = '1.0'
  authType = 'api_key' as const

  private base: any

  async configureAuth(credentials: { apiKey: string }) {
    Airtable.configure({ apiKey: credentials.apiKey })
    this.base = Airtable.base(credentials.baseId)
  }

  async fetch(config: AirtableConfig): Promise<any> {
    const records: any[] = []

    const query: any = {}

    if (config.view) {
      query.view = config.view
    }

    if (config.filterByFormula) {
      query.filterByFormula = config.filterByFormula
    }

    if (config.sort) {
      query.sort = config.sort
    }

    if (config.maxRecords) {
      query.maxRecords = config.maxRecords
    }

    await this.base(config.tableId)
      .select(query)
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach((record) => {
          records.push({
            id: record.id,
            ...record.fields,
          })
        })
        fetchNextPage()
      })

    return records
  }

  async push(config: AirtableConfig, data: any[]): Promise<void> {
    const chunks = this.chunkArray(data, 10) // Airtable limit

    for (const chunk of chunks) {
      await this.base(config.tableId).create(chunk.map((item) => ({ fields: item })))
    }
  }

  async listResources(): Promise<Resource[]> {
    // Use Airtable Meta API to list tables
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    const data = await response.json()

    return data.tables.map((table) => ({
      id: table.id,
      name: table.name,
      type: 'table',
    }))
  }
}
```

### 3. Notion Connector

#### Configuration

```typescript
interface NotionConfig {
  databaseId: string
  filter?: NotionFilter
  sorts?: NotionSort[]
  pageSize?: number
}

interface NotionFilter {
  and?: NotionFilter[]
  or?: NotionFilter[]
  property?: string
  [key: string]: any
}
```

#### Implementation

```typescript
// lib/connectors/notion.ts

import { Client } from '@notionhq/client'

export class NotionConnector implements DataConnector {
  name = 'Notion'
  type = 'notion'
  version = '1.0'
  authType = 'oauth2' as const

  private notion: Client

  async configureAuth(credentials: { accessToken: string }) {
    this.notion = new Client({
      auth: credentials.accessToken,
    })
  }

  async fetch(config: NotionConfig): Promise<any> {
    const query: any = {
      database_id: config.databaseId,
    }

    if (config.filter) {
      query.filter = config.filter
    }

    if (config.sorts) {
      query.sorts = config.sorts
    }

    if (config.pageSize) {
      query.page_size = config.pageSize
    }

    const response = await this.notion.databases.query(query)

    return response.results.map((page) => this.parseNotionPage(page))
  }

  async push(config: NotionConfig, data: any[]): Promise<void> {
    for (const item of data) {
      await this.notion.pages.create({
        parent: { database_id: config.databaseId },
        properties: this.convertToNotionProperties(item),
      })
    }
  }

  private parseNotionPage(page: any): any {
    const properties: any = {}

    Object.entries(page.properties).forEach(([key, prop]: [string, any]) => {
      switch (prop.type) {
        case 'title':
          properties[key] = prop.title[0]?.plain_text || ''
          break
        case 'rich_text':
          properties[key] = prop.rich_text[0]?.plain_text || ''
          break
        case 'number':
          properties[key] = prop.number
          break
        case 'select':
          properties[key] = prop.select?.name || null
          break
        case 'multi_select':
          properties[key] = prop.multi_select.map((s) => s.name)
          break
        case 'date':
          properties[key] = prop.date?.start || null
          break
        case 'checkbox':
          properties[key] = prop.checkbox
          break
        case 'url':
          properties[key] = prop.url
          break
        case 'email':
          properties[key] = prop.email
          break
        case 'phone_number':
          properties[key] = prop.phone_number
          break
        // Add more types as needed
      }
    })

    return {
      id: page.id,
      ...properties,
    }
  }
}
```

### 4. Generic API Connector

#### Configuration

```typescript
interface APIConnectorConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  auth?: {
    type: 'bearer' | 'basic' | 'api_key'
    credentials: any
  }
  responsePath?: string // JSONPath to extract data
  pagination?: {
    type: 'offset' | 'cursor' | 'page'
    config: PaginationConfig
  }
}
```

#### Implementation

```typescript
// lib/connectors/api.ts

import axios, { AxiosInstance } from 'axios'
import JSONPath from 'jsonpath'

export class APIConnector implements DataConnector {
  name = 'Generic API'
  type = 'api'
  version = '1.0'
  authType = 'api_key' as const

  private client: AxiosInstance

  async configureAuth(credentials: any) {
    this.client = axios.create({
      timeout: 30000,
      headers: this.buildAuthHeaders(credentials),
    })
  }

  async fetch(config: APIConnectorConfig): Promise<any> {
    let allData: any[] = []
    let hasMore = true
    let page = 1

    while (hasMore) {
      const response = await this.client.request({
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.body,
        params: this.buildPaginationParams(config.pagination, page),
      })

      // Extract data using JSONPath if specified
      let data = response.data
      if (config.responsePath) {
        data = JSONPath.query(data, config.responsePath)
      }

      if (Array.isArray(data)) {
        allData = [...allData, ...data]
      } else {
        allData.push(data)
      }

      // Check pagination
      if (config.pagination) {
        hasMore = this.hasMorePages(response, config.pagination, page)
        page++
      } else {
        hasMore = false
      }
    }

    return allData
  }

  private buildAuthHeaders(credentials: any): Record<string, string> {
    const headers: Record<string, string> = {}

    if (credentials.type === 'bearer') {
      headers['Authorization'] = `Bearer ${credentials.token}`
    } else if (credentials.type === 'api_key') {
      headers[credentials.headerName || 'X-API-Key'] = credentials.apiKey
    } else if (credentials.type === 'basic') {
      const encoded = Buffer.from(`${credentials.username}:${credentials.password}`).toString(
        'base64',
      )
      headers['Authorization'] = `Basic ${encoded}`
    }

    return headers
  }

  private buildPaginationParams(pagination: any, page: number): Record<string, any> {
    if (!pagination) return {}

    switch (pagination.type) {
      case 'page':
        return {
          [pagination.pageParam || 'page']: page,
          [pagination.sizeParam || 'per_page']: pagination.pageSize || 100,
        }

      case 'offset':
        const offset = (page - 1) * (pagination.pageSize || 100)
        return {
          [pagination.offsetParam || 'offset']: offset,
          [pagination.limitParam || 'limit']: pagination.pageSize || 100,
        }

      case 'cursor':
        // Cursor-based pagination needs to track the cursor from response
        return {
          [pagination.cursorParam || 'cursor']: pagination.nextCursor,
          [pagination.limitParam || 'limit']: pagination.pageSize || 100,
        }

      default:
        return {}
    }
  }

  private hasMorePages(response: any, pagination: any, currentPage: number): boolean {
    if (pagination.type === 'page') {
      const totalPages = response.data[pagination.totalPagesField || 'total_pages']
      return currentPage < totalPages
    }

    if (pagination.type === 'cursor') {
      const nextCursor = response.data[pagination.nextCursorField || 'next_cursor']
      pagination.nextCursor = nextCursor
      return !!nextCursor
    }

    if (pagination.type === 'offset') {
      const hasMore = response.data[pagination.hasMoreField || 'has_more']
      return hasMore === true
    }

    return false
  }
}
```

### 5. CSV/JSON File Connector

#### Implementation

```typescript
// lib/connectors/file.ts

import Papa from 'papaparse'

export class FileConnector implements DataConnector {
  name = 'File Upload'
  type = 'file'
  version = '1.0'
  authType = 'none' as const

  async fetch(config: FileConnectorConfig): Promise<any> {
    const file = config.file // File object or URL

    if (config.format === 'csv') {
      return this.parseCSV(file)
    }

    if (config.format === 'json') {
      return this.parseJSON(file)
    }

    throw new Error(`Unsupported file format: ${config.format}`)
  }

  private async parseCSV(file: File | string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data)
        },
        error: (error) => {
          reject(error)
        },
      })
    })
  }

  private async parseJSON(file: File | string): Promise<any> {
    if (typeof file === 'string') {
      const response = await fetch(file)
      return response.json()
    }

    const text = await file.text()
    return JSON.parse(text)
  }
}
```

---

## Connector Registry

### Centralized Connector Management

```typescript
// lib/connectors/registry.ts

export class ConnectorRegistry {
  private connectors = new Map<string, DataConnector>()

  register(connector: DataConnector) {
    this.connectors.set(connector.type, connector)
  }

  get(type: string): DataConnector | undefined {
    return this.connectors.get(type)
  }

  list(): DataConnector[] {
    return Array.from(this.connectors.values())
  }
}

// Initialize registry
export const registry = new ConnectorRegistry()

registry.register(new GoogleSheetsConnector())
registry.register(new AirtableConnector())
registry.register(new NotionConnector())
registry.register(new APIConnector())
registry.register(new FileConnector())
```

---

## Authentication Management

### OAuth2 Flow

```typescript
// app/api/connectors/oauth/[provider]/route.ts

export async function GET(req: Request) {
  const { provider } = params
  const { code, state } = Object.fromEntries(new URL(req.url).searchParams)

  // Exchange code for tokens
  const tokens = await exchangeOAuthCode(provider, code)

  // Encrypt and store credentials
  await storeConnectorCredentials({
    userId: state, // state contains user ID
    type: provider,
    credentials: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  })

  return redirect('/dashboard/connectors?success=true')
}
```

### Credential Encryption

```typescript
// lib/connectors/encryption.ts

import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.CONNECTOR_ENCRYPTION_KEY!
const ALGORITHM = 'aes-256-gcm'

export function encryptCredentials(credentials: any): {
  encrypted: Buffer
  iv: Buffer
  authTag: Buffer
} {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)

  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(credentials), 'utf8'),
    cipher.final(),
  ])

  const authTag = cipher.getAuthTag()

  return { encrypted, iv, authTag }
}

export function decryptCredentials(encrypted: Buffer, iv: Buffer, authTag: Buffer): any {
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

  return JSON.parse(decrypted.toString('utf8'))
}
```

---

## Data Sync Engine

### Sync Strategies

```typescript
// lib/connectors/sync-engine.ts

export class SyncEngine {
  async sync(dataSourceId: string, config: SyncConfig): Promise<SyncResult> {
    const dataSource = await this.getDataSource(dataSourceId)
    const connector = registry.get(dataSource.type)

    if (!connector) {
      throw new Error(`Connector not found: ${dataSource.type}`)
    }

    // Configure authentication
    const credentials = await this.getDecryptedCredentials(dataSourceId)
    await connector.configureAuth(credentials)

    // Start sync
    const syncRecord = await this.createSyncRecord(dataSourceId)

    try {
      let data: any[]

      if (config.mode === 'full') {
        // Full sync: fetch all data
        data = await connector.fetch(dataSource.config)
      } else {
        // Incremental sync: fetch only changes since last sync
        data = await this.incrementalSync(connector, dataSource, config.lastSyncedAt)
      }

      // Store synced data
      await this.storeData(dataSourceId, data)

      // Update sync record
      await this.updateSyncRecord(syncRecord.id, {
        status: 'completed',
        recordsFetched: data.length,
        recordsProcessed: data.length,
        completedAt: new Date(),
      })

      return {
        success: true,
        recordsSynced: data.length,
      }
    } catch (error) {
      await this.updateSyncRecord(syncRecord.id, {
        status: 'failed',
        errorMessage: error.message,
      })

      throw error
    }
  }

  private async incrementalSync(
    connector: DataConnector,
    dataSource: DataSource,
    lastSyncedAt?: Date,
  ): Promise<any[]> {
    // Add timestamp filter to query
    const config = {
      ...dataSource.config,
      query: {
        ...dataSource.config.query,
        where: [
          ...(dataSource.config.query?.where || []),
          {
            field: dataSource.timestampField || 'updated_at',
            operator: '>',
            value: lastSyncedAt?.toISOString(),
          },
        ],
      },
    }

    return connector.fetch(config)
  }
}
```

---

## Error Handling

### Connection Errors

```typescript
export class ConnectorError extends Error {
  constructor(
    public code: string,
    message: string,
    public isRetryable: boolean = false,
  ) {
    super(message)
  }
}

// Example usage
if (response.status === 429) {
  throw new ConnectorError(
    'RATE_LIMIT',
    'API rate limit exceeded',
    true, // retryable
  )
}

if (response.status === 401) {
  throw new ConnectorError(
    'AUTH_FAILED',
    'Authentication failed. Please reconnect.',
    false, // not retryable
  )
}
```

### Retry Logic

```typescript
async function fetchWithRetry(
  connector: DataConnector,
  config: any,
  maxAttempts: number = 3,
): Promise<any> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await connector.fetch(config)
    } catch (error) {
      if (error instanceof ConnectorError && error.isRetryable) {
        if (attempt < maxAttempts) {
          const delay = Math.pow(2, attempt) * 1000 // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
      }

      throw error
    }
  }
}
```
