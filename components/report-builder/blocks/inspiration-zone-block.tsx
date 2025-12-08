"use client"

import { extractVariableName, isVariable } from "@/lib/variables"
import { EditableTextField } from "../editable-text-field"
import { VariableHint } from "../variable-hint"

interface InspirationZoneBlockProps {
  config?: Record<string, any>
  isPreview?: boolean
  isSelected?: boolean
  onConfigChange?: (config: Record<string, any>) => void
  leaderboard_rank?: number
  journey_reason?: string
  weeks_to_important_event?: number
}

export function InspirationZoneBlock({
  config,
  isPreview,
  isSelected = false,
  onConfigChange,
  leaderboard_rank,
  journey_reason,
  weeks_to_important_event,
}: InspirationZoneBlockProps) {
  const playlistDescriptionValue = config?.playlistDescription ?? ""
  const motivationalLineValue = config?.motivationalLine ?? ""
  const leaderboardRankValue = config?.leaderboard_rank ?? leaderboard_rank ?? 0
  const journeyReasonValue = config?.journey_reason ?? journey_reason ?? ""
  const weeksToEventValue = config?.weeks_to_important_event ?? weeks_to_important_event ?? 0
  const playlistUrlValue = config?.playlistUrl ?? ""

  const renderText = (text: string) => {
    if (!text) return null
    return text
      .split(/(\{\{[^}]+\}\})/g)
      .map((part, idx) => (
        <span key={idx}>{isVariable(part) ? <VariableHint variableId={extractVariableName(part) || ""} /> : part}</span>
      ))
  }

  const handleFieldChange = (fieldName: string, value: string | number) => {
    if (!onConfigChange) return

    onConfigChange({
      ...(config ?? {}),
      [fieldName]: value,
    })
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm">
      <div className="bg-linear-to-r from-[#4F81FF] to-[#00B8B0] px-6 py-5">
        <h3 className="text-xl font-bold text-white tracking-tight">Your Inspiration Zone</h3>
      </div>
      <div className="p-6 space-y-5">
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-2 uppercase tracking-wide">🎵 Focus Playlist</h4>
          {isSelected && !isPreview ? (
            <EditableTextField
              value={playlistDescriptionValue}
              onChange={(value) => handleFieldChange("playlistDescription", value)}
              placeholder="Energize your workout"
              multiline={true}
              inline={true}
              variablePrefix="inspiration_zone"
              className="text-sm text-muted-foreground leading-relaxed block"
            />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {renderText(playlistDescriptionValue) || "Energize your workout"}
            </p>
          )}
          {isSelected && !isPreview ? (
            <div className="mt-2">
              <EditableTextField
                value={playlistUrlValue}
                onChange={(value) => handleFieldChange("playlistUrl", value)}
                placeholder="https://example.com/playlist"
                inline={true}
                variablePrefix="inspiration_zone"
                className="text-xs text-muted-foreground block"
              />
            </div>
          ) : playlistUrlValue ? (
            <a
              href={playlistUrlValue}
              className="text-xs text-[#00B8B0] underline mt-1 inline-block"
            >
              {renderText(playlistUrlValue)}
            </a>
          ) : null}
        </div>

        <div className="bg-[#F7F9FC] rounded-lg p-4 border border-[#E5E7EB]">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Your Leaderboard Rank</p>
          {isSelected && !isPreview ? (
            <EditableTextField
              value={leaderboardRankValue ? String(leaderboardRankValue) : ""}
              onChange={(value) => handleFieldChange("leaderboard_rank", Number.parseInt(value) || 0)}
              placeholder="1"
              inline={true}
              variablePrefix="inspiration_zone"
              className="text-3xl font-bold text-[#00B8B0]"
            />
          ) : (
            <p className="text-3xl font-bold text-[#00B8B0]">
              {leaderboardRankValue ? `#${leaderboardRankValue}` : "#N/A"}
            </p>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-foreground text-sm mb-2 uppercase tracking-wide">Your Why</h4>
          <p className="text-sm text-foreground leading-relaxed">
            You started this journey for:{" "}
            {isSelected && !isPreview ? (
              <EditableTextField
                value={journeyReasonValue}
                onChange={(value) => handleFieldChange("journey_reason", value)}
                placeholder="Your reason"
                inline={true}
                variablePrefix="inspiration_zone"
                className="text-sm font-semibold"
              />
            ) : (
              journeyReasonValue || "Unknown reason"
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {isSelected && !isPreview ? (
              <EditableTextField
                value={weeksToEventValue ? String(weeksToEventValue) : ""}
                onChange={(value) => handleFieldChange("weeks_to_important_event", Number.parseInt(value) || 0)}
                placeholder="0"
              inline={true}
                variablePrefix="inspiration_zone"
              className="text-xs font-semibold"
              />
            ) : weeksToEventValue ? (
              `${weeksToEventValue} weeks`
            ) : (
              "N/A"
            )}{" "}
            to go!
          </p>
        </div>

          {isSelected && !isPreview ? (
            <div className="text-center">
            <EditableTextField
              value={motivationalLineValue}
              onChange={(value) => handleFieldChange("motivationalLine", value)}
              placeholder="Keep going!"
              inline={true}
              variablePrefix="inspiration_zone"
              className="text-foreground font-semibold italic text-sm leading-relaxed block"
            />
          </div>
        ) : (
          <p className="text-center text-foreground font-semibold italic text-sm leading-relaxed">
            "{renderText(motivationalLineValue) || "Keep going!"}"
          </p>
        )}
      </div>
    </div>
  )
}


