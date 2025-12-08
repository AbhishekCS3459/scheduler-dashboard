import type { Template } from "@/lib/report-builder-types"

export const sampleTemplate: Template = {
  id: "1",
  name: "Monthly Progress – Standard",
  description: "Includes weight progress, attendance, Cryo360 upsell block",
  tags: ["Standard", "Monthly"],
  layoutType: "predefined",
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  lastEditedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  blocks: [
    {
      id: "block-1",
      type: "basic-info",
      order: 0,
      config: {
        showWelcome: true,
      },
    },
    {
      id: "block-2",
      type: "inspiration-zone",
      order: 1,
      config: {
        playlistDescription: "Energize your workout with our curated playlist",
        motivationalLine: "Keep going! You're doing amazing!",
      },
    },
    {
      id: "block-3",
      type: "next-session",
      order: 2,
      config: {
        rescheduleUrl: "https://example.com/reschedule",
      },
    },
    {
      id: "block-4",
      type: "monthly-summary",
      order: 3,
      config: {
        commentary: "Great improvement compared to last month!",
      },
    },
    {
      id: "block-5",
      type: "progress-consistency",
      order: 4,
      config: {
        motivationalText: "You've been very consistent—keep it up!",
      },
    },
    {
      id: "block-6",
      type: "package-promotion",
      order: 5,
      config: {
        title: "Cryo360: Freeze Away Fat",
        description: "Shape your body and elevate your life journey",
        bullets: [
          "Non-invasive fat reduction",
          "No surgery or downtime",
          "Precise temperature control",
          "Safe & FDA-approved technology",
        ],
        buttonText: "Talk to an advisor for Cryo360",
        advisorUrl: "https://example.com/advisor",
      },
    },
    {
      id: "block-7",
      type: "before-after",
      order: 6,
      config: {
        beforeCaption: "Your starting point",
        afterCaption: "Your progress",
      },
    },
    {
      id: "block-8",
      type: "referral-offer",
      order: 7,
      config: {
        discountPercentage: 20,
        referralUrl: "https://example.com/refer",
      },
    },
  ],
}

