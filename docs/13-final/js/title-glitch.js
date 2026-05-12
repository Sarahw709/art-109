/**
 * Slowly increases glitch / "deconstruction" on the main title over several minutes.
 */
(function () {
  const el = document.querySelector(".title");
  if (!el) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const raw = el.textContent.trimEnd();
  el.textContent = "";
  el.setAttribute("aria-label", raw);
  el.classList.add("title--decay");

  /** @type {HTMLSpanElement[]} */
  const spans = [];

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const span = document.createElement("span");
    span.className = "title-char";
    span.dataset.ch = ch;
    span.textContent = ch === " " ? "\u00a0" : ch;
    span.style.setProperty("--idx", String(i));
    el.appendChild(span);
    spans.push(span);
  }

  const start = performance.now();
  const DURATION_MS = 280000;

  const glitchChars =
    "░▒▓█·…│╱╲▀▄Ø0▖▗▘▙▚▛▜▝▞▟?¿¤†‡";

  function hash(n) {
    const x = Math.sin(n) * 10000;
    return x - Math.floor(x);
  }

  function tick(now) {
    const t = Math.min(1, (now - start) / DURATION_MS);
    el.style.setProperty("--decay", t.toFixed(5));

    const frame = Math.floor(now / 220);

    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      const orig = span.dataset.ch;
      const h = hash(i * 12.9898 + 78.233);

      const op = Math.max(0.12, 1 - t * (0.25 + h * 0.45));

      span.style.opacity = op.toFixed(3);

      const split = t * 5;
      span.style.textShadow = `${split.toFixed(2)}px 0 rgba(255, 45, 120, ${0.15 + t * 0.35}), ${(-split * 0.9).toFixed(2)}px 0 rgba(40, 220, 255, ${0.12 + t * 0.32})`;

      let display = orig === " " ? "\u00a0" : orig;
      if (orig !== " ") {
        const g = hash(i * 31.7 + frame * 0.17);
        if (g < t * t * 0.55) {
          const gi = Math.floor(hash(i + frame * 3.1) * glitchChars.length);
          display = glitchChars[gi];
        }
      }
      span.textContent = display;
    }

    const spacing = Math.min(0.22, t * 0.42);
    el.style.letterSpacing = `${spacing.toFixed(3)}em`;
    el.style.filter = `blur(${t * t * 1.1}px)`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
