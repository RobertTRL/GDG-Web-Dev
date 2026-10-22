allTransformFieldset
  .querySelectorAll("input[type='range']")
  .forEach((rangeInput) => {
    // Event listeners for when the range inputs change
    rangeInput.addEventListener("input", (el) => {
      updateTransform();
    });

    // Reset the relevant transform setting when the range input is double clicked
    rangeInput.addEventListener("dblclick", (el) => {
      resetInput(el.target);
      updateTransform();
    });
  });

// Event listeners for when checkbox inputs change
allTransformFieldset
  .querySelectorAll("input[type='checkbox']")
  .forEach((checkboxInput) => {
    checkboxInput.addEventListener("input", (el) => {
      updateTransform();
    });
  });

// "Reset All" button event listener
resetAllButton.addEventListener("click", () => {
  allTransformFieldset.querySelectorAll("input").forEach((input) => {
    resetInput(input);
  });
  updateTransform();
});

// Section reset button event listeners
allTransformFieldset
  .querySelectorAll(".resetSectionButton")
  .forEach((resetSectionButton) => {
    resetSectionButton.addEventListener("click", (el) => {
      let allRanges = el.target.parentElement.parentElement.querySelectorAll(
        "input[type='range']",
      );
      allRanges.forEach((range) => {
        resetInput(range);
      });

      let allCheckboxes =
        el.target.parentElement.parentElement.querySelectorAll(
          "input[type='checkbox']",
        );
      allCheckboxes.forEach((check) => {
        resetInput(check);
      });

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
  translateZOutput.value = `${translateZRange.value}px`;

  rotateXOutput.value = `${rotateXRange.value}°`;
  rotateYOutput.value = `${rotateYRange.value}°`;
  rotateZOutput.value = `${rotateZRange.value}°`;

  scaleXOutput.value = `${scaleXRange.value}x`;
  scaleYOutput.value = `${scaleYRange.value}x`;
  scaleZOutput.value = `${scaleZRange.value}x`;

  skewXOutput.value = `${skewXRange.value}°`;
  skewYOutput.value = `${skewYRange.value}°`;

  perspectiveOutput.value = `${perspectiveRange.value}px`;

  perspectiveOriginXOutput.value = `${perspectiveOriginXRange.value}%`;
  perspectiveOriginYOutput.value = `${perspectiveOriginYRange.value}%`;
}

function updateTransform() {
  updateOutputs();

  cube.style.transform = `translate3d(${translateXRange.value}px,
                ${translateYRange.value}px,
                ${translateZRange.value}px)
                rotateX(${rotateXRange.value}deg)
                rotateY(${rotateYRange.value}deg)
                rotateZ(${rotateZRange.value}deg)
                scale3d(${scaleXRange.value},
                ${scaleYRange.value},
                ${scaleZRange.value})
                skewX(${skewXRange.value}deg)
                skewY(${skewYRange.value}deg)`;
  cube.style.backfaceVisibility = `${backfaceVisibilityCheckbox.checked ? "visible" : "hidden"}`;

  outputContainer.style.perspective = `${perspectiveRange.value}px`;
  outputContainer.style.perspectiveOrigin = `${perspectiveOriginXRange.value}% ${perspectiveOriginYRange.value}%`;

  perspectiveDot.style.top = `${perspectiveOriginYRange.value}%`;
  perspectiveDot.style.left = `${perspectiveOriginXRange.value}%`;
}
updateTransform();