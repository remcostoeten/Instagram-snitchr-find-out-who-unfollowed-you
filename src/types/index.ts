// Core data types
export type UserData = {
  userId: string
  username: string
  fullname?: string
  followedByYou?: string
  isVerified?: string
  profileUrl?: string
  avatarUrl?: string
  [key: string]: string | undefined
}

export type FileData = {
  id: string
  name: string
  data: UserData[]
  columns: string[]
  folderId: string | null
  labels: string[]
  createdAt: Date
  updatedAt: Date
}

// Comparison types
export type ComparisonResult = {
  onlyInFirst: UserData[]
  onlyInSecond: UserData[]
  inBoth: UserData[]
  differences: { item: UserData; diffFields: string[] }[]
} | null

// Filtering and sorting types
export type SortConfig = {
  key: string
  direction: "asc" | "desc"
}

export type FilterType = "contains" | "equals" | "startsWith" | "endsWith"

export type FilterConfig = {
  column: string
  value: string
  type: FilterType
}

// Statistics types
export type FileStatistics = {
  totalRows: number
  columns: { [key: string]: { [value: string]: number } }
  followedByYou: { [key: string]: number }
  isVerified: { [key: string]: number }
} | null

