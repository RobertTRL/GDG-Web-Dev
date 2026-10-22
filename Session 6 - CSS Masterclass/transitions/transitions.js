const propBoxes = Array.from(
  allTransitionFieldset.querySelectorAll("input[data-prop]"),
);
const MAX_LOG_LINES = 10;
let logLines = [];

// Update when any control changes
allTransitionFieldset
  .querySelectorAll("input[type='range']")
  .forEach((rangeInput) => {
    rangeInput.addEventListener("input", () => updateTransition());

    // Reset the relevant setting when the range input is double clicked
    rangeInput.addEventListener("dblclick", (el) => {
      resetInput(el.target);
      updateTransition();
    });
  });

allTransitionFieldset
  .querySelectorAll("input[type='checkbox'], select")
  .forEach((control) => {
    control.addEventListener("input", () => updateTransition());
  });

// "Reset All" button
resetAllButton.addEventListener("click", () => {
  allTransitionFieldset
    .querySelectorAll("input, select")
    .forEach((input) => resetInput(input));
  updateTransition();
});

// Section reset buttons
allTransitionFieldset
  .querySelectorAll(".resetSectionButton")
  .forEach((resetSectionButton) => {
    resetSectionButton.addEventListener("click", (el) => {
      const section = el.target.parentElement.parentElement;
      section
        .querySelectorAll("input, select")
        .forEach((input) => resetInput(input));
      updateTransition();
    });
  });

// Manual toggle (handy on touch screens, or to replay without moving the mouse)
toggleButton.addEventListener("click", () => {
  track.classList.toggle("active");
});

clearLogButton.addEventListener("click", () => {
  logLines = [];
  eventLog.textContent = "";
});

// Transition events bubble up from both #bar and #badge
["transitionstart", "transitionend", "transitioncancel"].forEach((type) => {
  track.addEventListener(type, (e) => {
    const who = e.target.id;
    const elapsed =
      type === "transitionend" ? ` (${e.elapsedTime.toFixed(2)}s)` : "";
    logLines.unshift(
      `${type.replace("transition", "").padEnd(7)} ${who}: ${e.propertyName}${elapsed}`,
    );
    logLines = logLines.slice(0, MAX_LOG_LINES);
    eventLog.textContent = logLines.join("\n");
  });
});

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

function getTransitionProperty() {
  if (!enableCheckbox.checked) return "none";
  if (propAll.checked) return "all";

  const chosen = propBoxes
    .filter((box) => box.checked)
    .map((box) => box.dataset.prop);
  return chosen.length ? chosen.join(", ") : "none";
}

function updateOutputs() {
  durationOutput.value = `${durationRange.value}s`;
  delayOutput.value = `${delayRange.value}s`;
}

function updateTransition() {
  updateOutputs();

  // When "all" is ticked the individual properties are redundant
  propBoxes.forEach((box) => {
    if (box !== propAll) box.disabled = propAll.checked;
  });

  const property = getTransitionProperty();
  const duration = `${durationRange.value}s`;
  const timing = timingSelect.value;
  const delay = `${delayRange.value}s`;
  const behavior = behaviorSelect.value;

  track.style.setProperty("--tp", property);
  track.style.setProperty("--td", duration);
  track.style.setProperty("--tf", timing);
  track.style.setProperty("--tdelay", delay);
  track.style.setProperty("--tb", behavior);

  cssOutput.textContent =
    `transition-property: ${property};\n` +
    `transition-duration: ${duration};\n` +
    `transition-timing-function: ${timing};\n` +
    `transition-delay: ${delay};\n` +
    `transition-behavior: ${behavior};`;
}
updateTransition();
