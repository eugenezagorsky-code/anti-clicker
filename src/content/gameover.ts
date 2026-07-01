export const gameoverCopy = {
  title: "Registry of Shame",
  titlePristine: "Registry of Restraint",
  titlePartial: "Registry of Regret",
  playAgain: "Play Again",
  damageSummary: {
    eyebrow: "Final Damage Assessment",
    eyebrowPristine: "Ecological Integrity Preserved",
    eyebrowPartial: "Partial Damage Report",
    operatorPrefix: "Operator",
    sessionTerminated: "Session Terminated",
    sessionComplete: "Session Complete — No Harm Done",
    sessionPartial: "Session Ended — Limited Harm",
    scoreLabel: "Ecological Damage Score",
    scoreZeroMessage: "The grid breathes easier because of you.",
    scorePartialMessage:
      "Minor disruptions logged. You stopped before the real damage began.",
  },
  leaderboard: {
    empty: "No prior disruptors recorded. You are the first catastrophe.",
    emptyPristine: "No prior records. You are the first operator to leave no trace.",
    columns: {
      rank: "Rank",
      operator: "Operator",
      damage: "Damage",
      clicks: "Clicks",
      date: "Date",
    },
    youMarker: "(you)",
    pristineMarker: "— pristine",
    partialMarker: "— partial",
  },
} as const;
