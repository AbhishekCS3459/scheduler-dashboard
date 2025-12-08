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

