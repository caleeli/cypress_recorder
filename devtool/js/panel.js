const record = [];

document.getElementById("resetRecord").onclick = function () {
  record.splice(0);
  renderRecord();
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  record.push(request);
  renderRecord();
});

function renderRecord() {
  const html = basicTpl(
    "ProcessMaker 4",
    packRecord(record).map(parseRecord).join("\n")
  );
  document.getElementById("reference").innerHTML = `<pre>${html}</pre>`;
}

function packRecord(record) {
  const result = [];
  record.forEach((item, index) => {
    const last = result[result.length - 1];
    if (item.action === "type" && last && last.reference === item.reference) {
      result[result.length - 1] = item;
    } else if (item.action === "visit" && index > 0) {
    } else {
      result.push(item);
    }
  });
  return result;
}

function parseRecord(item) {
  if (item.action === "click") {
    return `    cy.get(${stringify(item.reference)}).click();`;
  }
  if (item.action === "type") {
    return `    cy.get(${stringify(
      item.reference
    )}).clear().type(${JSON.stringify(item.value)});`;
  }
  if (item.action === "visit") {
    return `    cy.visit(${JSON.stringify(item.value)});`;
  }
  if (item.action === "select") {
    return `    cy.get(${stringify(item.reference)}).select(${JSON.stringify(item.value)});`;
  }
}

// stringify string with single quotes
function stringify(str) {
  str = JSON.stringify(str);
  str = str.substr(1, str.length - 2);
  return "'" + str.replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
}

function basicTpl(title, content) {
  return `
describe('ProcessMaker 4', () => {
  it('${title}', () => {
${content}
  });
})
`;
}
