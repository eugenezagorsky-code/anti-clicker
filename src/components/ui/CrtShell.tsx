export function CrtShell() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{
        background: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, var(--crt-scanline-opacity)) 2px,
            rgba(0, 0, 0, var(--crt-scanline-opacity)) 4px
          ),
          radial-gradient(
            ellipse at center,
            transparent 60%,
            rgba(0, 0, 0, 0.45) 100%
          )
        `,
      }}
    />
  );
}
