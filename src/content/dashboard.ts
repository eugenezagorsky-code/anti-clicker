export const dashboardCopy = {
  navDecorations: [
    { prefix: "[", code: "SEQ_0x04", suffix: "]" },
    { prefix: "//", code: "DISP::MIRROR", suffix: "" },
    { prefix: ">", code: "GEO.PARAM", suffix: "[∅]" },
  ] as const,
  header: {
    eyebrow: "AI Command Center",
    operatorPrefix: "Innovator",
    status: {
      active: "Node Active",
      autonomous: "Autonomous Mode",
      disconnected: "Link Lost",
      gameOver: "System Halted",
    },
  },
  metrics: {
    water: "Water Evaporated",
    carbon: "Carbon Emitted",
    grid: "Grid Stress",
    displacement: "Communities Displaced",
  },
  generateButton: {
    label: "DO NOT PRESS",
    sublabel: "Safety interlock active. Idle disconnect recommended.",
  },
  sessionDisconnect: {
    label: "Disconnect",
    title: "End session before the node escalates",
  },
  ticker: {
    title: "Consequence Log",
    empty: "Awaiting first innovation...",
  },
  generation: {
    progressLabel: "Processing override…",
    statuses: [
      "Allocating GPUs…",
      "Running inference…",
      "Flushing cooling loop…",
      "Syncing weights…",
      "Optimizing throughput…",
    ],
  },
  activityLog: {
    title: "Activity Log",
    toggle: "View log",
    collapse: "Hide log",
    lastPrefix: "Last:",
  },
  consequence: {
    deployedLabel: "Override logged",
    paywallPreview:
      "Seller Assist prompt quota exceeded. Billing intervention required before next AI listing draft.",
  },
} as const;
