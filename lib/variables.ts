export const DEFAULT_VARIABLES = [
  { id: "name", label: "Name", placeholder: "{{name}}" },
  { id: "age", label: "Age", placeholder: "{{age}}" },
  { id: "current_weight", label: "Current Weight", placeholder: "{{current_weight}}" },
  { id: "current_weight_kg", label: "Current Weight (kg)", placeholder: "{{current_weight_kg}}" },
  { id: "goal_weight", label: "Goal Weight", placeholder: "{{goal_weight}}" },
  { id: "goal_weight_kg", label: "Goal Weight (kg)", placeholder: "{{goal_weight_kg}}" },
  { id: "height_cm", label: "Height (cm)", placeholder: "{{height_cm}}" },
  { id: "kg_from_goal", label: "Kg From Goal", placeholder: "{{kg_from_goal}}" },
  { id: "bmi", label: "BMI", placeholder: "{{bmi}}" },
  { id: "attendance", label: "Attendance", placeholder: "{{attendance}}" },
  { id: "sessions_completed", label: "Sessions Completed", placeholder: "{{sessions_completed}}" },
  { id: "leaderboard_rank", label: "Leaderboard Rank", placeholder: "{{leaderboard_rank}}" },
  { id: "journey_reason", label: "Journey Reason", placeholder: "{{journey_reason}}" },
  { id: "week_number", label: "Week Number", placeholder: "{{week_number}}" },
  { id: "month", label: "Month", placeholder: "{{month}}" },
]

export interface Variable {
  id: string
  label: string
  placeholder: string
}

export function getVariablesList(moduleVariables?: Variable[]): Variable[] {
  // If module-specific variables are provided, return those; otherwise return default variables
  return moduleVariables && moduleVariables.length > 0 ? moduleVariables : DEFAULT_VARIABLES
}

export function isVariable(text: string): boolean {
  return /^\{\{[\w_]+\}\}$/.test(text)
}

export function extractVariableName(text: string): string | null {
  const match = text.match(/\{\{([\w_]+)\}\}/)
  return match ? match[1] : null
}

export function formatVariable(variableId: string): string {
  return `{{${variableId}}}`
}

/**
 * Strips any existing prefix from a variable name to prevent duplicate prefix appending.
 * This ensures prefixes are only added once when constructing variable names.
 * 
 * @param name - The variable name that may contain a prefix
 * @param prefix - The prefix to strip (if present)
 * @returns The variable name without the prefix
 */
export function stripVariablePrefix(name: string, prefix: string | undefined): string {
  if (!prefix || !name) return name
  const normalizedPrefix = prefix.replace(/[^a-z0-9]+/gi, "_").toLowerCase()
  const normalizedName = name.toLowerCase()
  if (normalizedName.startsWith(normalizedPrefix + "_")) {
    return name.substring(normalizedPrefix.length + 1)
  }
  return name
}

/**
 * Sanitizes a variable name by removing special characters and formatting it as a slug.
 * Does NOT add any prefix - this is just for cleaning the base name.
 * Allows underscores to be typed naturally by the user.
 * 
 * @param name - The variable name to sanitize
 * @returns The sanitized slug version of the name
 */
export function sanitizeVariableBaseName(name: string): string {
  if (!name) return ""
  const base = name.replace(/[{}]/g, "").trim().toLowerCase()
  // Replace any non-alphanumeric characters (except underscores) with underscores
  // Then collapse multiple consecutive underscores into a single underscore
  // Only remove leading/trailing underscores, not those in the middle
  const slug = base
    .replace(/[^a-z0-9_]+/g, "_")  // Replace non-alphanumeric (except _) with _
    .replace(/_+/g, "_")            // Collapse multiple underscores into one
    .replace(/^_+|_+$/g, "")        // Remove only leading/trailing underscores
  return slug || "variable"
}

/**
 * Creates a sanitized variable name with an optional prefix.
 * Automatically strips any existing prefix before adding it to prevent duplicates.
 * 
 * @param name - The base variable name
 * @param prefix - Optional prefix to prepend (will be normalized and only added once)
 * @returns The final sanitized variable name with prefix (if provided)
 */
export function sanitizeVariableName(name: string, prefix?: string): string {
  if (!name) return ""
  
  // Strip any existing prefix before sanitizing
  const baseName = stripVariablePrefix(name, prefix)
  const slug = sanitizeVariableBaseName(baseName)
  
  // Add prefix only if provided
  if (prefix) {
    const normalizedPrefix = prefix.replace(/[^a-z0-9]+/gi, "_").toLowerCase()
    return `${normalizedPrefix}_${slug}`
  }
  
  return slug || "variable"
}

