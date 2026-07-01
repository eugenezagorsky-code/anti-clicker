export const paywallCopy = {
  badge: "Billing",
  title: "Out of Prompt Credits",
  pack: {
    name: "Micro Pack",
    badge: "Recommended",
    credits: "3 prompt credits",
    price: "€90.00",
    unitPrice: "€30.00 per prompt · excl. VAT",
    features: [
      "Priority queue (48h SLA)",
      "Auto-renew until insolvency",
      "Carbon offset sold separately",
    ],
  },
  signature: {
    label: "Sign below to authorize continuous debt drawdown on linked accounts.",
    placeholder: "Draw your signature",
    clear: "Clear",
  },
  cta: "Authorize €90 Purchase & Continue",
  ctaDisabledHint: "Signature required",
  footer: "No close button · Terms non-negotiable · Refunds impossible",
} as const;
