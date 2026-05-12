/**
 * Periodically shows the error dialog image over the webcam (face area),
 * dismisses on click, then schedules the next appearance.
 */
(function () {
  const overlay = document.querySelector(".error-overlay");
  if (!overlay) return;

  const img = overlay.querySelector("img");
  let showTimer = null;
  let isFirstShow = true;

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function scheduleShow() {
    if (showTimer) clearTimeout(showTimer);
    const delay = isFirstShow
      ? randomBetween(4500, 12000)
      : randomBetween(22000, 58000);
    showTimer = setTimeout(showOverlay, delay);
  }

  function showOverlay() {
    const padTop = randomBetween(2.5, 13);
    const padSide = randomBetween(3, 16);
    overlay.style.paddingTop = `${padTop}%`;
    overlay.style.paddingLeft = `${padSide}%`;
    overlay.style.paddingRight = `${padSide}%`;
    const alignments = ["flex-start", "center", "flex-end"];
    overlay.style.justifyContent = alignments[Math.floor(Math.random() * alignments.length)];

    if (img) {
      const shiftX = randomBetween(-40, 40);
      const shiftY = randomBetween(-14, 22);
      img.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
    }
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    isFirstShow = false;
  }

  function dismiss() {
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.paddingTop = "";
    overlay.style.paddingLeft = "";
    overlay.style.paddingRight = "";
    overlay.style.justifyContent = "";
    if (img) img.style.transform = "";
    scheduleShow();
  }

  overlay.addEventListener("click", dismiss);
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
      e.preventDefault();
      dismiss();
    }
  });

  scheduleShow();
})();
