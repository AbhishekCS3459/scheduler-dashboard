"use client"
import { BLOCK_DEFINITIONS } from "@/lib/block-definitions"
import type { Template } from "@/lib/report-builder-types"
import { EditableTextField } from "./editable-text-field"

interface PropertiesPanelProps {
  template: Template
  selectedBlockId: string | null
  onBlockConfigChange: (blockId: string, config: Record<string, any>) => void
}

export function PropertiesPanel({ template, selectedBlockId, onBlockConfigChange }: PropertiesPanelProps) {
  const selectedBlock = template.blocks.find((b) => b.id === selectedBlockId)

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-white border-l border-[#E5E7EB] p-6 flex flex-col justify-center items-center text-center">
        <p className="text-muted-foreground mb-2">No block selected</p>
        <p className="text-xs text-muted-foreground">Select a block from the canvas to edit its properties</p>
      </div>
    )
  }

  const blockDef = BLOCK_DEFINITIONS[selectedBlock.type]

  return (
    <div className="w-80 bg-white border-l border-[#E5E7EB] overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#E5E7EB] sticky top-0 bg-white">
        <h3 className="font-bold text-foreground mb-1">{blockDef?.name || "Unknown Block"}</h3>
        <p className="text-xs text-muted-foreground">{blockDef?.description}</p>
        <p className="text-xs text-muted-foreground mt-2 px-2 py-1 bg-[#F7F9FC] rounded inline-block">
          Type: {selectedBlock.type}
        </p>
      </div>

      {/* Configuration Fields */}
      <div className="flex-1 p-6 space-y-6">
        {selectedBlock.type === "basic-info" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Show Welcome Message</label>
                <input
                  type="checkbox"
                  checked={selectedBlock.config.showWelcome || false}
                  onChange={(e) =>
                    onBlockConfigChange(selectedBlock.id, {
                      ...selectedBlock.config,
                      showWelcome: e.target.checked,
                    })
                  }
                  className="rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Header Title</label>
                <EditableTextField
                  value={selectedBlock.config.header_title || ""}
                  onChange={(value) =>
                    onBlockConfigChange(selectedBlock.id, {
                      ...selectedBlock.config,
                      header_title: value,
                    })
                  }
                  placeholder="Your Wellness Profile"
                  multiline={false}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Gradient From</label>
                <EditableTextField
                  value={selectedBlock.config.header_gradient_from || ""}
                  onChange={(value) =>
                    onBlockConfigChange(selectedBlock.id, {
                      ...selectedBlock.config,
                      header_gradient_from: value,
                    })
                  }
                  placeholder="#00B8B0"
                  multiline={false}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Gradient To</label>
                <EditableTextField
                  value={selectedBlock.config.header_gradient_to || ""}
                  onChange={(value) =>
                    onBlockConfigChange(selectedBlock.id, {
                      ...selectedBlock.config,
                      header_gradient_to: value,
                    })
                  }
                  placeholder="#009B93"
                  multiline={false}
                  className="text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                <EditableTextField
                  value={selectedBlock.config.name || ""}
                  onChange={(value) =>
                    onBlockConfigChange(selectedBlock.id, {
                      ...selectedBlock.config,
                      name: value,
                    })
                  }
                  placeholder="John"
                  multiline={false}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Kg From Goal</label>
                <EditableTextField
                  value={selectedBlock.config.kg_from_goal ?? ""}
                  onChange={(value) =>
                    onBlockConfigChange(selectedBlock.id, {
                      ...selectedBlock.config,
                      kg_from_goal: value,
                    })
                  }
                  placeholder="5"
                  multiline={false}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Current Weight (kg)</label>
                <EditableTextField
                  value={selectedBlock.config.current_weight_kg ?? ""}
                  onChange={(value) =>
                    onBlockConfigChange(selectedBlock.id, {
                      ...selectedBlock.config,
                      current_weight_kg: value,
                    })
                  }
                  placeholder="85"
                  multiline={false}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Populated from CSV/patient data.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Height (cm)</label>
                <EditableTextField
                  value={selectedBlock.config.height_cm ?? ""}
                  onChange={(value) =>
                    onBlockConfigChange(selectedBlock.id, {
                      ...selectedBlock.config,
                      height_cm: value,
                    })
                  }
                  placeholder="175"
                  multiline={false}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">BMI</label>
                <EditableTextField
                  value={selectedBlock.config.bmi ?? ""}
                  onChange={(value) =>
                    onBlockConfigChange(selectedBlock.id, {
                      ...selectedBlock.config,
                      bmi: value,
                    })
                  }
                  placeholder="24"
                  multiline={false}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Goal Weight (kg)</label>
                <EditableTextField
                  value={selectedBlock.config.goal_weight_kg ?? ""}
                  onChange={(value) =>
                    onBlockConfigChange(selectedBlock.id, {
                      ...selectedBlock.config,
                      goal_weight_kg: value,
                    })
                  }
                  placeholder="80"
                  multiline={false}
                  className="text-sm"
                />
              </div>
            </div>
          </>
        )}

        {selectedBlock.type === "inspiration-zone" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Playlist Description</label>
              <EditableTextField
                value={selectedBlock.config.playlistDescription || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    playlistDescription: value,
                  })
                }
                placeholder="Focus Playlist"
                multiline={true}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Motivational Line</label>
              <EditableTextField
                value={selectedBlock.config.motivationalLine || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    motivationalLine: value,
                  })
                }
                placeholder="Keep going! You're doing amazing!"
                multiline={false}
                className="text-sm"
              />
            </div>
          </>
        )}

        {selectedBlock.type === "next-session" && (
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Reschedule URL</label>
            <EditableTextField
              value={selectedBlock.config.rescheduleUrl || ""}
              onChange={(value) =>
                onBlockConfigChange(selectedBlock.id, {
                  ...selectedBlock.config,
                  rescheduleUrl: value,
                })
              }
              placeholder="https://example.com/reschedule"
              multiline={false}
              className="text-sm"
            />
          </div>
        )}

        {selectedBlock.type === "monthly-summary" && (
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Commentary</label>
            <EditableTextField
              value={selectedBlock.config.commentary || ""}
              onChange={(value) =>
                onBlockConfigChange(selectedBlock.id, {
                  ...selectedBlock.config,
                  commentary: value,
                })
              }
              placeholder="Great work this month!"
              multiline={true}
              className="text-sm"
            />
          </div>
        )}

        {selectedBlock.type === "progress-consistency" && (
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Motivational Text</label>
            <EditableTextField
              value={selectedBlock.config.motivationalText || ""}
              onChange={(value) =>
                onBlockConfigChange(selectedBlock.id, {
                  ...selectedBlock.config,
                  motivationalText: value,
                })
              }
              placeholder="You've been very consistent—keep it up!"
              multiline={true}
              className="text-sm"
            />
          </div>
        )}

        {selectedBlock.type === "package-promotion" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
              <EditableTextField
                value={selectedBlock.config.title || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    title: value,
                  })
                }
                placeholder="Cryo360: Freeze Away Fat"
                multiline={false}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
              <EditableTextField
                value={selectedBlock.config.description || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    description: value,
                  })
                }
                placeholder="Shape your body and elevate your life journey"
                multiline={true}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Button Text</label>
              <EditableTextField
                value={selectedBlock.config.buttonText || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    buttonText: value,
                  })
                }
                placeholder="Talk to an advisor"
                multiline={false}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Advisor URL</label>
              <EditableTextField
                value={selectedBlock.config.advisorUrl || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    advisorUrl: value,
                  })
                }
                placeholder="https://example.com/advisor"
                multiline={false}
                className="text-sm"
              />
            </div>
          </>
        )}

        {selectedBlock.type === "before-after" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Before Caption</label>
              <EditableTextField
                value={selectedBlock.config.beforeCaption || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    beforeCaption: value,
                  })
                }
                placeholder="Before"
                multiline={false}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">After Caption</label>
              <EditableTextField
                value={selectedBlock.config.afterCaption || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    afterCaption: value,
                  })
                }
                placeholder="After"
                multiline={false}
                className="text-sm"
              />
            </div>
          </>
        )}

        {selectedBlock.type === "referral-offer" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Discount Percentage</label>
              <EditableTextField
                value={String(selectedBlock.config.discountPercentage ?? "")}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    discountPercentage: value,
                  })
                }
                placeholder="20"
                multiline={false}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Referral URL</label>
              <EditableTextField
                value={selectedBlock.config.referralUrl || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    referralUrl: value,
                  })
                }
                placeholder="https://example.com/refer"
                multiline={false}
                className="text-sm"
              />
            </div>
          </>
        )}

        {selectedBlock.type === "custom-text" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Heading</label>
              <EditableTextField
                value={selectedBlock.config.heading || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    heading: value,
                  })
                }
                placeholder="Your Heading"
                multiline={false}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Subheading</label>
              <EditableTextField
                value={selectedBlock.config.subheading || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    subheading: value,
                  })
                }
                placeholder="Your Subheading"
                multiline={false}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Body Text</label>
              <EditableTextField
                value={selectedBlock.config.bodyText || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    bodyText: value,
                  })
                }
                placeholder="Your content here"
                multiline={true}
                className="text-sm"
              />
            </div>
          </>
        )}

        {selectedBlock.type === "text-image" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Heading</label>
              <EditableTextField
                value={selectedBlock.config.heading || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    heading: value,
                  })
                }
                placeholder="Your Heading"
                multiline={false}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Subheading</label>
              <EditableTextField
                value={selectedBlock.config.subheading || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    subheading: value,
                  })
                }
                placeholder="Your Subheading"
                multiline={false}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Body Text</label>
              <EditableTextField
                value={selectedBlock.config.bodyText || ""}
                onChange={(value) =>
                  onBlockConfigChange(selectedBlock.id, {
                    ...selectedBlock.config,
                    bodyText: value,
                  })
                }
                placeholder="Your content here"
                multiline={true}
                className="text-sm"
              />
            </div>
          </>
        )}

        {/* Variables Info */}
        <div className="bg-[#F7F9FC] rounded-lg p-4 mt-6">
          <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Variables Used</p>
          <p className="text-xs text-muted-foreground">
            These values come from your CSV when publishing. Example: {`{{name}}, {{current_weight_kg}}`}
          </p>
        </div>
      </div>
    </div>
  )
}

