"use client"

import { extractVariableName, isVariable } from "@/lib/variables"
import { EditableTextField } from "../editable-text-field"
import { VariableHint } from "../variable-hint"

interface BasicInfoBlockProps {
  config?: Record<string, any>
  isPreview?: boolean
  isSelected?: boolean
  onConfigChange?: (config: Record<string, any>) => void
  name?: string
  kg_from_goal?: number
  current_weight_kg?: number
  height_cm?: number
  bmi?: number
  goal_weight_kg?: number
  header_title?: string
  header_gradient_from?: string
  header_gradient_to?: string
}

export function BasicInfoBlock({
  config,
  isPreview,
  isSelected = false,
  onConfigChange,
  name,
  kg_from_goal,
  current_weight_kg,
  height_cm,
  bmi,
  goal_weight_kg,
  header_title,
  header_gradient_from,
  header_gradient_to,
}: BasicInfoBlockProps) {
  const nameValue = config?.name ?? name ?? "John"
  const kgFromGoalValue = config?.kg_from_goal ?? kg_from_goal ?? 0
  const currentWeightValue = config?.current_weight_kg ?? current_weight_kg ?? 0
  const heightValue = config?.height_cm ?? height_cm ?? 0
  const bmiValue = config?.bmi ?? bmi ?? 0
  const goalWeightValue = config?.goal_weight_kg ?? goal_weight_kg ?? 0
  const headerTitleValue = config?.header_title ?? header_title ?? "Your Wellness Profile"
  const headerGradientFrom = config?.header_gradient_from ?? header_gradient_from ?? "#00B8B0"
  const headerGradientTo = config?.header_gradient_to ?? header_gradient_to ?? "#009B93"
  
  // Editable static text labels
  const welcomeText = config?.welcome_text ?? "Welcome back, "
  const greetingEnd = config?.greeting_end ?? "!"
  const youreText = config?.youre_text ?? "You're "
  const kgAwayText = config?.kg_away_text ?? " kg away from your goal!"
  const currentWeightLabel = config?.current_weight_label ?? "Current Weight"
  const heightLabel = config?.height_label ?? "Height"
  const bmiLabel = config?.bmi_label ?? "BMI"
  const goalWeightLabel = config?.goal_weight_label ?? "Goal Weight"
  const autoFromDataText = config?.auto_from_data_text ?? "(auto from data)"
  const weightUnit = config?.weight_unit ?? "kg"
  const heightUnit = config?.height_unit ?? "cm"
  const scaleEmoji = config?.scale_emoji ?? "⚖️"

  const renderText = (text: string | number) => {
    if (text === undefined || text === null) return null
    const safeText = String(text)
    return safeText
      .split(/(\{\{[^}]+\}\})/g)
      .map((part, idx) => (
        <span key={idx}>{isVariable(part) ? <VariableHint variableId={extractVariableName(part) || ""} /> : part}</span>
      ))
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    if (!onConfigChange) return

    onConfigChange({
      ...(config ?? {}),
      [fieldName]: value,
    })
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm">
      <div
        className="px-6 py-4"
        style={{ background: `linear-gradient(90deg, ${headerGradientFrom}, ${headerGradientTo})` }}
      >
        {isSelected && !isPreview ? (
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <EditableTextField
              value={String(headerTitleValue ?? "")}
              onChange={(value) => handleFieldChange("header_title", value)}
              placeholder="Your Wellness Profile"
              inline={true}
              variablePrefix="basic_info"
              className="text-white font-bold text-lg block w-full"
            />
          </div>
        ) : (
          <h3 className="text-white font-bold text-lg">{renderText(headerTitleValue) ?? "Your Wellness Profile"}</h3>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {isSelected && !isPreview ? (
            <span className="inline-flex">
              <EditableTextField
                value={welcomeText}
                onChange={(value) => handleFieldChange("welcome_text", value)}
                placeholder="Welcome back, "
                inline={true}
                variablePrefix="basic_info"
                className="font-semibold text-foreground"
              />
            </span>
          ) : (
            <span className="text-foreground font-semibold">{renderText(welcomeText) ?? "Welcome back, "}</span>
          )}
          {isSelected && !isPreview ? (
            <span className="inline-flex">
              <EditableTextField
                value={String(nameValue ?? "")}
                onChange={(value) => handleFieldChange("name", value)}
                placeholder="Name"
                inline={true}
                variablePrefix="basic_info"
                className="font-semibold text-foreground"
              />
            </span>
          ) : (
            <span className="text-foreground font-semibold">{renderText(nameValue) ?? "John"}</span>
          )}
          {isSelected && !isPreview ? (
            <span className="inline-flex">
              <EditableTextField
                value={greetingEnd}
                onChange={(value) => handleFieldChange("greeting_end", value)}
                placeholder="!"
                inline={true}
                variablePrefix="basic_info"
                className="font-semibold text-foreground"
              />
            </span>
          ) : (
            <span className="text-foreground font-semibold">{renderText(greetingEnd) ?? "!"}</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {isSelected && !isPreview ? (
            <span className="inline-flex">
              <EditableTextField
                value={youreText}
                onChange={(value) => handleFieldChange("youre_text", value)}
                placeholder="You're "
                inline={true}
                variablePrefix="basic_info"
                className="text-foreground"
              />
            </span>
          ) : (
            <span className="text-foreground">{renderText(youreText) ?? "You're "}</span>
          )}
          {isSelected && !isPreview ? (
            <span className="inline-flex">
              <EditableTextField
                value={String(kgFromGoalValue ?? "")}
                onChange={(value) => handleFieldChange("kg_from_goal", value)}
                placeholder="0"
                inline={true}
                variablePrefix="basic_info"
                className="text-center text-foreground"
              />
            </span>
          ) : (
            <span className="text-foreground">{renderText(kgFromGoalValue) ?? "0"}</span>
          )}
          {isSelected && !isPreview ? (
            <span className="inline-flex">
              <EditableTextField
                value={kgAwayText}
                onChange={(value) => handleFieldChange("kg_away_text", value)}
                placeholder=" kg away from your goal!"
                inline={true}
                variablePrefix="basic_info"
                className="text-foreground"
              />
            </span>
          ) : (
            <span className="text-foreground">{renderText(kgAwayText) ?? " kg away from your goal!"}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB]">
          <div>
            {isSelected && !isPreview ? (
              <EditableTextField
                value={currentWeightLabel}
                onChange={(value) => handleFieldChange("current_weight_label", value)}
                placeholder="Current Weight"
                inline={true}
                variablePrefix="basic_info"
                className="text-sm text-muted-foreground mb-1 block"
              />
            ) : (
              <p className="text-sm text-muted-foreground mb-1">{renderText(currentWeightLabel) ?? "Current Weight"}</p>
            )}
            {isSelected && !isPreview ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex">
                  <EditableTextField
                    value={scaleEmoji}
                    onChange={(value) => handleFieldChange("scale_emoji", value)}
                    placeholder="⚖️"
                    inline={true}
                    variablePrefix="basic_info"
                    className="text-lg"
                  />
                </span>
                <span className="inline-flex">
                  <EditableTextField
                    value={String(currentWeightValue ?? "")}
                    onChange={(value) => handleFieldChange("current_weight_kg", value)}
                    placeholder="0"
                    inline={true}
                    variablePrefix="basic_info"
                    className="text-lg font-bold text-foreground"
                  />
                </span>
                <span className="inline-flex">
                  <EditableTextField
                    value={weightUnit}
                    onChange={(value) => handleFieldChange("weight_unit", value)}
                    placeholder="kg"
                    inline={true}
                    variablePrefix="basic_info"
                    className="text-lg font-bold text-foreground"
                  />
                </span>
                <span className="inline-flex">
                  <EditableTextField
                    value={autoFromDataText}
                    onChange={(value) => handleFieldChange("auto_from_data_text", value)}
                    placeholder="(auto from data)"
                    inline={true}
                    variablePrefix="basic_info"
                    className="text-xs text-muted-foreground"
                  />
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg">{renderText(scaleEmoji) ?? "⚖️"}</span>
                <p className="text-lg font-bold text-foreground">{renderText(currentWeightValue) ?? "0"} {renderText(weightUnit) ?? "kg"}</p>
                <span className="text-xs text-muted-foreground">{renderText(autoFromDataText) ?? "(auto from data)"}</span>
              </div>
            )}
          </div>
          <div>
            {isSelected && !isPreview ? (
              <EditableTextField
                value={heightLabel}
                onChange={(value) => handleFieldChange("height_label", value)}
                placeholder="Height"
                inline={true}
                variablePrefix="basic_info"
                className="text-sm text-muted-foreground mb-1 block"
              />
            ) : (
              <p className="text-sm text-muted-foreground mb-1">{renderText(heightLabel) ?? "Height"}</p>
            )}
            {isSelected && !isPreview ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex">
                  <EditableTextField
                    value={String(heightValue ?? "")}
                    onChange={(value) => handleFieldChange("height_cm", value)}
                    placeholder="0"
                    inline={true}
                    variablePrefix="basic_info"
                    className="text-lg font-bold text-foreground"
                  />
                </span>
                <span className="inline-flex">
                  <EditableTextField
                    value={heightUnit}
                    onChange={(value) => handleFieldChange("height_unit", value)}
                    placeholder="cm"
                    inline={true}
                    variablePrefix="basic_info"
                    className="text-lg font-bold text-foreground"
                  />
                </span>
              </div>
            ) : (
              <p className="text-lg font-bold text-foreground">
                {renderText(heightValue) ?? "0"} {renderText(heightUnit) ?? "cm"}
              </p>
            )}
          </div>
          <div>
            {isSelected && !isPreview ? (
              <EditableTextField
                value={bmiLabel}
                onChange={(value) => handleFieldChange("bmi_label", value)}
                placeholder="BMI"
                inline={true}
                variablePrefix="basic_info"
                className="text-sm text-muted-foreground mb-1 block"
              />
            ) : (
              <p className="text-sm text-muted-foreground mb-1">{renderText(bmiLabel) ?? "BMI"}</p>
            )}
            {isSelected && !isPreview ? (
            <EditableTextField
              value={String(bmiValue ?? "")}
              onChange={(value) => handleFieldChange("bmi", value)}
              placeholder="0"
              inline={true}
              variablePrefix="basic_info"
              className="text-lg font-bold text-foreground"
            />
            ) : (
            <p className="text-lg font-bold text-foreground">{renderText(bmiValue) ?? "0"}</p>
            )}
          </div>
          <div>
            {isSelected && !isPreview ? (
              <EditableTextField
                value={goalWeightLabel}
                onChange={(value) => handleFieldChange("goal_weight_label", value)}
                placeholder="Goal Weight"
                inline={true}
                variablePrefix="basic_info"
                className="text-sm text-muted-foreground mb-1 block"
              />
            ) : (
              <p className="text-sm text-muted-foreground mb-1">{renderText(goalWeightLabel) ?? "Goal Weight"}</p>
            )}
            {isSelected && !isPreview ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex">
                  <EditableTextField
                    value={String(goalWeightValue ?? "")}
                    onChange={(value) => handleFieldChange("goal_weight_kg", value)}
                    placeholder="0"
                    inline={true}
                    variablePrefix="basic_info"
                    className="text-lg font-bold text-foreground"
                  />
                </span>
                <span className="inline-flex">
                  <EditableTextField
                    value={weightUnit}
                    onChange={(value) => handleFieldChange("weight_unit", value)}
                    placeholder="kg"
                    inline={true}
                    variablePrefix="basic_info"
                    className="text-lg font-bold text-foreground"
                  />
                </span>
              </div>
            ) : (
            <p className="text-lg font-bold text-foreground">
              {renderText(goalWeightValue) ?? "0"} {renderText(weightUnit) ?? "kg"}
            </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


