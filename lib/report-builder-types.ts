export type View = "templates" | "builder" | "history"

export interface Template {
  id: string
  name: string
  description: string
  tags: string[]
  blocks: Block[]
  createdAt: Date
  lastEditedAt: Date
  layoutType?: "predefined" | "custom"
}

export interface Block {
  id: string
  type: BlockType
  config: Record<string, any>
  order: number
}

export type BlockType =
  | "basic-info"
  | "inspiration-zone"
  | "next-session"
  | "monthly-summary"
  | "progress-consistency"
  | "package-promotion"
  | "before-after"
  | "referral-offer"
  | "custom-text"
  | "text-image"
  | "divider"

export interface BlockDefinition {
  id: BlockType
  name: string
  description: string
  category: "predefined" | "custom"
  defaultConfig: Record<string, any>
}

