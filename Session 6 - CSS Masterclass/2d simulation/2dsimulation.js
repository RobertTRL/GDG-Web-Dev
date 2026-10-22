allTransformFieldset
  .querySelectorAll("input[type='range']")
  .forEach((rangeInput) => {
    // Update when a range input changes
    rangeInput.addEventListener("input", () => {
      updateTransform();
    });

    // Reset the relevant setting when the range input is double clicked
    rangeInput.addEventListener("dblclick", (el) => {
      resetInput(el.target);
      updateTransform();
    });
  });

// Update when checkbox inputs change
allTransformFieldset
  .querySelectorAll("input[type='checkbox']")
  .forEach((checkboxInput) => {
    checkboxInput.addEventListener("input", () => {
      updateTransform();
    });
  });

// "Reset All" button
resetAllButton.addEventListener("click", () => {
  allTransformFieldset.querySelectorAll("input").forEach((input) => {
    resetInput(input);
  });
  updateTransform();
});

// Section reset buttons
allTransformFieldset
  .querySelectorAll(".resetSectionButton")
  .forEach((resetSectionButton) => {
    resetSectionButton.addEventListener("click", (el) => {
      const section = el.target.parentElement.parentElement;
      section
        .querySelectorAll("input[type='range'], input[type='checkbox']")
        .forEach((input) => resetInput(input));
      updateTransform();
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

function updateOutputs() {
  translateXOutput.value = `${translateXRange.value}px`;
  translateYOutput.value = `${translateYRange.value}px`;

  rotateOutput.value = `${rotateRange.value}°`;

  scaleXOutput.value = `${scaleXRange.value}x`;
  scaleYOutput.value = `${scaleYRange.value}x`;

  skewXOutput.value = `${skewXRange.value}°`;
  skewYOutput.value = `${skewYRange.value}°`;

  originXOutput.value = `${originXRange.value}%`;
  originYOutput.value = `${originYRange.value}%`;
}

function updateTransform() {
  updateOutputs();

  // Translate is applied on the wrapper so the origin dot travels with the shape.
  // Order matches the CSS shown below: translate → rotate → scale → skew.
  boxWrap.style.transform = `translate(${translateXRange.value}px, ${translateYRange.value}px)`;

  box.style.transform = `rotate(${rotateRange.value}deg)
                scale(${scaleXRange.value}, ${scaleYRange.value})
                skew(${skewXRange.value}deg, ${skewYRange.value}deg)`;
  box.style.transformOrigin = `${originXRange.value}% ${originYRange.value}%`;

  originDot.style.left = `${originXRange.value}%`;
  originDot.style.top = `${originYRange.value}%`;
  originDot.style.display = originDotCheckbox.checked ? "block" : "none";

  ghost.style.display = ghostCheckbox.checked ? "block" : "none";

  cssOutput.textContent =
    `transform: translate(${translateXRange.value}px, ${translateYRange.value}px)\n` +
    `           rotate(${rotateRange.value}deg)\n` +
    `           scale(${scaleXRange.value}, ${scaleYRange.value})\n` +
    `           skew(${skewXRange.value}deg, ${skewYRange.value}deg);\n` +
    `transform-origin: ${originXRange.value}% ${originYRange.value}%;`;
}
updateTransform();
