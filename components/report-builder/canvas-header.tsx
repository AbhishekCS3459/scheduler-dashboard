"use client"

interface CanvasHeaderProps {
  templateName: string
  templateDescription: string
  templateTags: string[]
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
  onTagsChange: (tags: string[]) => void
}

export function CanvasHeader({
  templateName,
  templateDescription,
  templateTags,
  onNameChange,
  onDescriptionChange,
  onTagsChange,
}: CanvasHeaderProps) {
  return (
    <div className="bg-white border-b border-[#E5E7EB] p-6 space-y-4">
      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Template Name</label>
        <input
          type="text"
          value={templateName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Description</label>
        <input
          type="text"
          value={templateDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Cohort Tags</label>
        <div className="flex flex-wrap gap-2">
          {templateTags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm flex items-center gap-2">
              {tag}
              <button
                onClick={() => onTagsChange(templateTags.filter((_, i) => i !== idx))}
                className="hover:text-white/70"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

