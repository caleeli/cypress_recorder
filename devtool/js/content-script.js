chrome.runtime.sendMessage({ action: "visit", value: window.location.href });

const whenSelected = function () {
  const target = this;
  const reference = getBestDOMReference(target);
  console.log("changed!!", target, reference);
  if (reference) {
    chrome.runtime.sendMessage({ action: "select", reference, value: target.value });
  }
};

document.addEventListener(
  "mousedown",
  function (event) {
    const target = event.target;
    if (!target) {
      return;
    }
    // Find best reference
    let reference = "";
    const isSVG = target.closest("svg");
    const isMultiSelect = false; //checkIsMultiSelect(target);
    const isSelectControl = target.localName === "select";
    console.log("isSelectControl", isSelectControl);
    if (isSVG) {
      const g = target.closest("g[id]");
      if (g) {
        reference = reference || isBestSelector(`#${g.id}`, g);
      } else if (target.id) {
        reference = reference || isBestSelector(`#${target.id}`, target);
      }
    } else if (isMultiSelect) {
      // const control = target.closest(".multiselect");
      // reference = getBestDOMReference(control);
      // console.log(control, reference);
    } else if (isSelectControl) {
      //const events = window.getEventListeners(target);
      //if (!events.change || events.change.indexOf(whenSelected) === -1) {
        console.log("attache vent listener");
        target.addEventListener("change", whenSelected);
      //}
    } else {
      reference = getBestDOMReference(target);
    }
    if (reference) {
      chrome.runtime.sendMessage({ action: "click", reference });
    }
  },
  false
);

document.addEventListener(
  "keyup",
  function (event) {
    const target = event.target;
    let reference = "";
    if (target.localName == "input") {
      reference = getBestDOMReference(target);
    }
    if (reference) {
      chrome.runtime.sendMessage({
        action: "type",
        reference,
        key: event.key,
        value: target.value,
      });
    }
  },
  false
);

function isBestSelector(reference, target) {
  try {
    const selected = window.$(reference);
    if (selected.length == 1 && selected[0] == target) {
      return reference;
    } else if (selected.length > 1 && selected.length < 5) {
      let referenceN = null;
      selected.each((index, element) => {
        if (element == target) {
          referenceN = `${reference}:eq(${index})`;
        }
      });
      return referenceN;
    }
  } catch (e) {
    return;
  }
}

function getBestDOMReference(target, reference = "") {
  reference ||= isBestSelector(
    `${target.localName}[data-cy="${target.getAttribute("data-cy")}"]`,
    target
  );
  reference ||= isBestSelector(
    `${target.localName}[data-test="${target.getAttribute("data-test")}"]`,
    target
  );
  reference ||= isBestSelector(
    `${target.localName}[name="${target.getAttribute("name")}"]`,
    target
  );
  if (
    target.getAttribute("class") &&
    target.getAttribute("class").trim() &&
    target.getAttribute("class").trim().split(" ").length == 1
  ) {
    reference ||= isBestSelector(
      `${target.localName}.${target.getAttribute("class").trim()}`,
      target
    );
  }
  reference = reference || isBestSelector(`#${target.id}`, target);
  reference ||= isBestSelector(
    `${target.localName}:contains("${target.textContent.trim()}")`,
    target
  );
  reference ||= isBestSelector(
    `${target.localName}:contains("${target.innerHTML.trim()}")`,
    target
  );
  reference ||= isBestSelector(
    `${target.localName}:contains("${target.innerHTML.trim()}")`,
    target
  );
  reference ||= isBestSelector(
    `${target.localName}[title="${target.getAttribute("title")}"]`,
    target
  );
  if (!reference && target.parentNode) {
    reference = getBestDOMReference(target.parentNode);
  }
  return reference;
}

function addAnimation(target) {
  const className = target.getAttribute("class");
  target.setAttribute("class", `${className} pm4-tools-blink`);
  setTimeout(() => {
    const className = target
      .getAttribute("class")
      .split(" pm4-tools-blink")
      .join("");
    target.setAttribute("class", className);
  }, 1000);
}

function checkIsMultiSelect(target) {
  if (target.getAttribute("class") === "multiselect__tags") {
    return true;
  }
  if (target.getAttribute("class") === "multiselect__select") {
    return true;
  }
  if (target.getAttribute("class") === "multiselect__input") {
    return true;
  }
  if (target.getAttribute("class") === "multiselect__placeholder") {
    return true;
  }
  if (target.parentNode.getAttribute("class") === "multiselect") {
    return true;
  }
  return false;
}
