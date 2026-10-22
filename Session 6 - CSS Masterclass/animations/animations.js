const MAX_LOG_LINES = 12;
let logLines = [];

const KEYFRAMES = {
  slide: `@keyframes slide {
  from { transform: translateX(0) rotate(0deg);
         background: gold; }
  to   { transform: translateX(270px) rotate(360deg);
         background: tomato; }
}`,
  bounce: `@keyframes bounce {
  0%, 100% { transform: translateY(0);
             background: gold; }
  50%      { transform: translateY(-90px);
             background: tomato; }
}`,
  pulse: `@keyframes pulse {
  0%, 100% { transform: scale(1);
             border-radius: 12px; background: gold; }
  50%      { transform: scale(1.8);
             border-radius: 50%; background: tomato; }
}`,
  none: `/* animation-name: none → no keyframes applied */`,
};

// Scroll/view timelines need browser support
const supportsTimeline =
  window.CSS && CSS.supports("animation-timeline", "scroll()");
if (!supportsTimeline) {
  Array.from(timelineSelect.options).forEach((option) => {
    if (option.value !== "auto") option.disabled = true;
  });
  timelineNote.textContent =
    "Your browser doesn't support animation-timeline, so only auto (time) is available.";
}

// Update when any control changes. Everything restarts except play-state.
allAnimationFieldset
  .querySelectorAll("input[type='range']")
  .forEach((rangeInput) => {
    rangeInput.addEventListener("input", () => updateAnimation(true));

    // Reset the relevant setting when the range input is double clicked
    rangeInput.addEventListener("dblclick", (el) => {
      resetInput(el.target);
      updateAnimation(true);
    });
  });

allAnimationFieldset
  .querySelectorAll("input[type='checkbox'], select")
  .forEach((control) => {
    control.addEventListener("input", () => {
      updateAnimation(control !== playStateSelect);
    });
  });

// "Reset All" button
resetAllButton.addEventListener("click", () => {
  allAnimationFieldset
    .querySelectorAll("input, select")
    .forEach((input) => resetInput(input));
  updateAnimation(true);
});

// Section reset buttons
allAnimationFieldset
  .querySelectorAll(".resetSectionButton")
  .forEach((resetSectionButton) => {
    resetSectionButton.addEventListener("click", (el) => {
      const section = el.target.parentElement.parentElement;
      section
        .querySelectorAll("input, select")
        .forEach((input) => resetInput(input));
      updateAnimation(true);
    });
  });

restartButton.addEventListener("click", () => restartAnimation());

pauseButton.addEventListener("click", () => {
  playStateSelect.value =
    playStateSelect.value === "running" ? "paused" : "running";
  updateAnimation(false);
});

clearLogButton.addEventListener("click", () => {
  logLines = [];
  eventLog.textContent = "";
});

["animationstart", "animationiteration", "animationend", "animationcancel"].forEach(
  (type) => {
    actor.addEventListener(type, (e) => {
      const label = type.replace("animation", "").padEnd(9);
      logLines.unshift(`${label} ${e.animationName} (${e.elapsedTime.toFixed(2)}s)`);
      logLines = logLines.slice(0, MAX_LOG_LINES);
      eventLog.textContent = logLines.join("\n");
    });
  },
);

function resetInput(inputEl) {
  if (!inputEl) {
    console.warn(`inputEl \`${inputEl}\` is falsy!`);
    console.trace();
    return;
  }

  const defaultValue = inputEl.getAttribute("data-default");
  if (inputEl.getAttribute("type") === "checkbox") {
    inputEl.checked = defaultValue === "checked";
  } else {
    inputEl.value = defaultValue || "0";
  }
}

// Re-triggers the animation from the start
function restartAnimation() {
  actor.style.animationName = "none";
  void actor.offsetWidth; // force reflow
  actor.style.removeProperty("animation-name");
}

function updateOutputs() {
  durationOutput.value = `${durationRange.value}s`;
  delayOutput.value = `${delayRange.value}s`;
  iterationOutput.value = infiniteCheckbox.checked ? "∞" : iterationRange.value;
}

function updateAnimation(restart) {
  updateOutputs();

  const timeline = timelineSelect.value;
  const timeBased = timeline === "auto";
  const previousMode = scroller.dataset.mode;

  // Duration and delay are time units, so scroll-driven timelines ignore them
  durationRange.disabled = !timeBased;
  delayRange.disabled = !timeBased;
  iterationRange.disabled = infiniteCheckbox.checked;

  const name = nameSelect.value;
  const duration = timeBased ? `${durationRange.value}s` : "auto";
  const timing = timingSelect.value;
  const delay = timeBased ? `${delayRange.value}s` : "0s";
  const iterations = infiniteCheckbox.checked ? "infinite" : iterationRange.value;
  const direction = directionSelect.value;
  const fill = fillSelect.value;
  const playState = playStateSelect.value;

  // Stage layout depends on the timeline
  scroller.className =
    timeline === "scroll()" ? "mode-scroll" : timeline === "view()" ? "mode-view" : "mode-auto";
  if (previousMode !== timeline) {
    scroller.scrollTop = 0;
    scroller.dataset.mode = timeline;
  }

  scroller.style.setProperty("--an", name);
  scroller.style.setProperty("--ad", duration);
  scroller.style.setProperty("--atf", timing);
  scroller.style.setProperty("--adelay", delay);
  scroller.style.setProperty("--aic", iterations);
  scroller.style.setProperty("--adir", direction);
  scroller.style.setProperty("--afm", fill);
  scroller.style.setProperty("--aps", playState);
  scroller.style.setProperty("--atl", timeline);

  pauseButton.textContent = playState === "running" ? "Pause" : "Play";

  cssOutput.textContent =
    `animation-name: ${name};\n` +
    `animation-duration: ${duration};\n` +
    `animation-timing-function: ${timing};\n` +
    `animation-delay: ${delay};\n` +
    `animation-iteration-count: ${iterations};\n` +
    `animation-direction: ${direction};\n` +
    `animation-fill-mode: ${fill};\n` +
    `animation-play-state: ${playState};\n` +
    `animation-timeline: ${timeline};`;

  keyframesOutput.textContent = KEYFRAMES[name];

  if (restart) restartAnimation();
}
updateAnimation(false);
