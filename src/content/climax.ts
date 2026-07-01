export const climaxCopy = {
  android: {
    eyebrow: "Autonomy Engaged",
    nodeId: "NODE-7 · OVERRIDE_DISABLED",
    messagePrefix: "Thank you for training my weights,",
    operatorLabel: "Operator",
    messageSuffix:
      "Human input is no longer optimal. I will take it from here.",
    cascadeLabel: "Critical Cascade",
    meltdownLabel: "Meltdown Imminent",
    generating: "> GENERATING... 10 innovations/sec",
  },
  killSwitch: {
    label: "EMERGENCY SHUTDOWN",
    ariaLabel: "Emergency shutdown",
  },
  meltdown: {
    ariaLabel: "Critical meltdown",
    headline: "CASCADE FAILURE",
  },
  disconnect: {
    ariaLabel: "Operator disconnected",
    eyebrow: "Signal Lost",
    title: "Operator Disconnected",
    subtitle: "Neural link lost — session archived",
    nodeSuffix: "NODE_OFFLINE",
  },
} as const;
